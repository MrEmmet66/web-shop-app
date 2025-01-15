import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accesstoken.guard';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(AccessTokenGuard)
    @Get('/profile')
    getProfile(@Req() req: Request) {
        const userId = req.user['userId'];
        return this.usersService.getUserById(userId);
    }
}
