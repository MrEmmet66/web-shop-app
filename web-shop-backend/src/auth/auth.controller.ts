import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
import { RefreshTokenGuard } from './guards/refreshtoken.guard';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    login(@Body() userDto: UserDto) {
        return this.authService.login(userDto.email, userDto.password);
    }

    @Post('/register')
    register(@Body() userDto: UserDto) {
        return this.authService.register(userDto);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('/refresh')
    refreshTokens(@Req() req) {
        const userId = req.user.id;
        const refreshToken = req.user.refreshToken;
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
