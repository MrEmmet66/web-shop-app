import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secret',
            signOptions: {
                expiresIn: '24h'
            }
        })
    ],
    controllers: [
        AuthController,],
    providers: [
        AuthService,],
})
export class AuthModule { }
