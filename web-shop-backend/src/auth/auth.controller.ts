import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';

@Controller()
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
}
