import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { compare, genSalt, hash } from 'bcryptjs';
import { UserDto } from 'src/users/dto/user.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(private UsersService: UsersService, private jwtService: JwtService, private mailService: MailService) { }

    async login(email: string, password: string): Promise<{ user: User,accessToken: string, refreshToken: string}> {
        const user = await this.UsersService.getUserByEmail(email);

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        const isPasswordValid = await this.validatePassword(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return { user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    }

    async logout(userId: number) {
        await this.UsersService.updateUser(userId, {
            refreshToken: null,
        });
    }

    async validatePassword(password: string, passwordHash: string): Promise<boolean> {
        return await compare(password, passwordHash);
    }

    async register(user: UserDto): Promise<{ registeredUser: User, accessToken: string, refreshToken: string }> {
        const userExists = await this.UsersService.getUserByEmail(user.email);

        if (userExists) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const salt = await genSalt(10);
        const hashedPassword = await hash(user.password, salt);
        const registeredUser = await this.UsersService.createUser({
            email: user.email,
            name: user.name,
            passwordHash: hashedPassword,
            passwordSalt: salt,
            phoneNumber: user.phoneNumber,
        });
        const emailConfirmationToken = await this.generateJwtToken({ userId: registeredUser.id }, { secret: process.env.JWT_EMAIL_SECRET, expiresIn: '30m', });
        await this.mailService.sendUserConfirmationMail(registeredUser, emailConfirmationToken);

        const tokens = await this.generateTokens(registeredUser.id, registeredUser.email);
        await this.updateRefreshToken(registeredUser.id, tokens.refreshToken);

        return { registeredUser, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await hash(refreshToken, 3);
        await this.UsersService.updateUser(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.UsersService.getUserById(userId);

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

    async generateTokens(userId: number, email: string) {
        const accessToken = await this.generateJwtToken({ userId: userId, email: email },
            { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '30m', })

        const refreshToken = await this.generateJwtToken({ userId: userId, email: email },
            { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d', })

        return {
            accessToken,
            refreshToken,
        }
    }

    async generateJwtToken(payload: any, options: any): Promise<string> {
        return this.jwtService.signAsync(payload, options);
    }

    async confirmEmail(token: string) {
        try {
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_EMAIL_SECRET });
            const user = await this.UsersService.getUserById(payload.userId);

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            await this.UsersService.updateUser(user.id, {
                isActivated: true,
            });
        } catch(e) {
            throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
        } 
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.UsersService.getUserByEmail(email);

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const resetPasswordToken = await this.generateJwtToken({ userId: user.id }, { secret: process.env.JWT_RESET_PASSWORD_SECRET, expiresIn: '30m', });
        
        await this.UsersService.updateUser(user.id, {
            passwordResetToken: resetPasswordToken,
        })

        await this.mailService.sendResetPasswordMail(user, resetPasswordToken);
    }

    async resetPassword(newPassword: string, token: string) {
        try {
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_RESET_PASSWORD_SECRET });
            const user = await this.UsersService.getUserById(payload.userId);

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            if(user.passwordResetToken !== token) {
                throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
            }

            const salt = await genSalt(10);
            const hashedPassword = await hash(newPassword, salt);
            await this.UsersService.updateUser(user.id, {
                passwordHash: hashedPassword,
                passwordSalt: salt,
                passwordResetToken: null,
            });

        } catch(e) {
            throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
        }
    }

}
