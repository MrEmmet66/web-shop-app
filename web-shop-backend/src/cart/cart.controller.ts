/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AccessTokenGuard } from 'src/auth/guards/accesstoken.guard';
import { Request } from 'express';
import { UpdateCartDto } from './dto/updateCart.dto';

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @Get()
    @UseGuards(AccessTokenGuard)
    async getCart(@Req() req: Request) {
        const userId = req.user['userId'];
        return this.cartService.getUserCart(userId);
    }

    @Patch()
    @UseGuards(AccessTokenGuard)
    async updateCart(@Body() updateCartDto: UpdateCartDto) {
        console.log(updateCartDto);
        
        return this.cartService.updateCart(updateCartDto);
    }





}
