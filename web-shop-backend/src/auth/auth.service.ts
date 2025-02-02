import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { compare, genSalt, hash } from 'bcryptjs';
import { UserDto } from 'src/users/dto/user.dto';
import { MailService } from 'src/mail/mail.service';

interface JwtPayload {
    userId: number;
    email?: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {
    private readonly SALT_ROUNDS = 10;
    private readonly REFRESH_TOKEN_ROUNDS = 3;

    constructor(
        private readonly usersService: UsersService, 
        private readonly jwtService: JwtService, 
        private readonly mailService: MailService
    ) {}

    async login(email: string, password: string): Promise<{ user: User, accessToken: string, refreshToken: string }> {
        const user = await this.usersService.getUserByEmail(email);

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        const isPasswordValid = await this.validatePassword(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return { user, ...tokens };
    }

    async logout(userId: number): Promise<void> {
        await this.usersService.updateUser(userId, {
            refreshToken: null,
        });
    }

    async validatePassword(password: string, passwordHash: string): Promise<boolean> {
        return compare(password, passwordHash);
    }

    async register(user: UserDto): Promise<{ registeredUser: User, accessToken: string, refreshToken: string }> {
        const userExists = await this.usersService.getUserByEmail(user.email);

        if (userExists) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const { hashedPassword, salt } = await this.createPasswordHash(user.password);
        const registeredUser = await this.usersService.createUser({
            email: user.email,
            name: user.name,
            passwordHash: hashedPassword,
            passwordSalt: salt,
            phoneNumber: user.phoneNumber,
        });

        await this.sendConfirmationEmail(registeredUser);
        const tokens = await this.generateTokens(registeredUser.id, registeredUser.email);
        await this.updateRefreshToken(registeredUser.id, tokens.refreshToken);

        return { registeredUser, ...tokens };
    }

    async createPasswordHash(password: string): Promise<{ hashedPassword: string; salt: string }> {
        const salt = await genSalt(this.SALT_ROUNDS);
        const hashedPassword = await hash(password, salt);
        return { hashedPassword, salt };
    }

    async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await hash(refreshToken, this.REFRESH_TOKEN_ROUNDS);
        await this.usersService.updateUser(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    private async sendConfirmationEmail(user: User): Promise<void> {
        const emailToken = await this.generateJwtToken(
            { userId: user.id },
            process.env.JWT_EMAIL_SECRET,
            '30m'
        );
        await this.mailService.sendUserConfirmationMail(user, emailToken);
    }

    async refreshTokens(userId: number, refreshToken: string): Promise<TokenResponse> {
        const user = await this.usersService.getUserById(userId);

        if (!user || !user.refreshToken) {
            throw new ForbiddenException('Access Denied');
        }

        const isRefreshTokenValid = await compare(refreshToken, user.refreshToken);

        if (!isRefreshTokenValid) {
            throw new ForbiddenException('Access Denied');
        }

        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        
        return tokens;
    }

    private async generateTokens(userId: number, email: string): Promise<TokenResponse> {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateJwtToken(
                { userId, email },
                process.env.JWT_ACCESS_SECRET,
                '30m'
            ),
            this.generateJwtToken(
                { userId, email },
                process.env.JWT_REFRESH_SECRET,
                '30d'
            )
        ]);

        return { accessToken, refreshToken };
    }

    private async generateJwtToken(
        payload: JwtPayload,
        secret: string,
        expiresIn: string
    ): Promise<string> {
        return this.jwtService.signAsync(payload, { secret, expiresIn });
    }

    async confirmEmail(token: string): Promise<void> {
        try {
            const payload = await this.verifyToken(token, process.env.JWT_EMAIL_SECRET);
            await this.updateUserActivation(payload.userId);
        } catch(e) {
            throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
        } 
    }

    private async updateUserActivation(userId: number): Promise<void> {
        const user = await this.usersService.getUserById(userId);
        
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        await this.usersService.updateUser(user.id, {
            isActivated: true,
        });
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.usersService.getUserByEmail(email);

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const resetToken = await this.generateJwtToken(
            { userId: user.id },
            process.env.JWT_RESET_PASSWORD_SECRET,
            '30m'
        );
        
        await Promise.all([
            this.usersService.updateUser(user.id, { passwordResetToken: resetToken }),
            this.mailService.sendResetPasswordMail(user, resetToken)
        ]);
    }

    async resetPassword(newPassword: string, token: string): Promise<void> {
        try {
            const payload = await this.verifyToken(token, process.env.JWT_RESET_PASSWORD_SECRET);
            await this.processPasswordReset(payload.userId, newPassword, token);
        } catch(e) {
            throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
        }
    }

    private async verifyToken(token: string, secret: string): Promise<any> {
        return this.jwtService.verify(token, { secret });
    }

    private async processPasswordReset(userId: number, newPassword: string, token: string): Promise<void> {
        const user = await this.usersService.getUserById(userId);

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        if(user.passwordResetToken !== token) {
            throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
        }

        const { hashedPassword, salt } = await this.createPasswordHash(newPassword);
        await this.usersService.updateUser(user.id, {
            passwordHash: hashedPassword,
            passwordSalt: salt,
            passwordResetToken: null,
        });
    }
}