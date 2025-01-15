import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/refreshtoken.guard';
import { Response } from 'express';
import { AccessTokenGuard } from './guards/accesstoken.guard';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    async login(@Body() userDto: UserDto, @Res({passthrough: true}) res: Response) {
        const userData = await this.authService.login(userDto.email, userDto.password);
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000,  httpOnly: true });
        return userData;
        
    }

    @Post('/register')
    register(@Body() userDto: UserDto) {
        return this.authService.register(userDto);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('/refresh')
    async refreshTokens(@Req() req, @Res({passthrough: true}) res: Response) {
        const userId = req.user['userId'];
        const refreshToken = req.user.refreshToken;

        const tokens = await this.authService.refreshTokens(userId, refreshToken);
        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30*24*60*60*1000,  httpOnly: true });
        return tokens;
    }

    @Get('/confirm')
    confirmEmail(@Req() req) {
        const token = req.query.token;
        if(!token) {
            throw new Error('Token not found');
        }
        return this.authService.confirmEmail(token);
    }

}
