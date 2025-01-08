import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { compare, genSalt, hash } from 'bcryptjs';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
    constructor(private readonly UsersService: UsersService, private readonly jwtService: JwtService) {}

    async login(email: string, password: string) {
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
        return tokens;

    }

    async validatePassword(password: string, passwordHash: string): Promise<boolean> {
        return await compare(password, passwordHash);
    }

    async register(user: UserDto) {
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

        const tokens = await this.generateTokens(registeredUser.id, registeredUser.email);
        await this.updateRefreshToken(registeredUser.id, tokens.refreshToken);
        return tokens;
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await hash(refreshToken, 3);
        await this.UsersService.updateUser(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.UsersService.getUserById(userId);

        if(!user || !user.refreshToken) {
            throw new ForbiddenException('Access Denied');
        }

        const isRefreshTokenValid = await compare(refreshToken, user.refreshToken);

        if(!isRefreshTokenValid) {
            throw new ForbiddenException('Access Denied');
        }

        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async generateTokens(userId: number, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                userId: userId,
                email: email,
            },
            {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '30m',
            }),
            this.jwtService.signAsync({
                userId: userId,
                email: email,
            },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '30d',
                
            })
        ]);
        return {
            accessToken,
            refreshToken,
        }
    }
    
}
