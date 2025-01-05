import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

        return this.generateJwtToken(user);

    }

    async validatePassword(password: string, passwordHash: string): Promise<boolean> {
        return await compare(password, passwordHash);
    }

    async register(user: UserDto): Promise<string> {
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

        return this.generateJwtToken(registeredUser);
    }

    async generateJwtToken(user: User): Promise<string> {
        const payload = { id: user.id, email: user.email }
        return this.jwtService.sign(payload);
    }
    
}
