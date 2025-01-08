import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accesstoken.guard';

@Controller()
export class UsersController {
    
    @UseGuards(AccessTokenGuard)
    @Get('users')
    getUsers() {
        return 'Users';
    }
}
