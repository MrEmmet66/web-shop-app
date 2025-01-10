import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { MailModule } from 'src/mail/mail.module';

@Module({
    imports: [
        UsersModule,
        MailModule,
        JwtModule.register({})
    ],
    controllers: [
        AuthController,],
    providers: [
        AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule { }
