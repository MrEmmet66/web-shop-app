import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accesstoken.guard';
import { UsersService } from './users.service';
import { Request } from 'express';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(AccessTokenGuard)
    @Get('/profile')
    getProfile(@Req() req: Request) {
        const userId = req.user['userId'];
        return this.usersService.getUserById(userId);
    }

    @UseGuards(AccessTokenGuard)
    @Post('/editProfile')
    editProfile(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
        const userId = req.user['userId'];
        return this.usersService.updateUser(userId, updateUserDto);
    }

    @UseGuards(AccessTokenGuard)
    @Post('/deleteProfile')
    deleteProfile(@Req() req: Request) {
        const userId = req.user['userId'];
        return this.usersService.deleteUser(userId);
    }

}
