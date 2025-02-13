/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AccessTokenGuard } from 'src/auth/guards/accesstoken.guard';
import { Request } from 'express';
import { CreateOrderDto } from './models/createOrder.dto';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @Get()
    @UseGuards(AccessTokenGuard)
    async getUserOrders(@Req() req: Request) {
        const userId = req.user['id'];
        return this.ordersService.getByUserId(userId);
    }

    @Post()
    @UseGuards(AccessTokenGuard)
    async createOrder(@Req() req: Request, @Body() orderDto: CreateOrderDto) {
        return this.ordersService.createOrder({...orderDto, userId: req.user['id']});
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    async getOrderById(@Req() req: Request) {
        return this.ordersService.getOrderById(Number(req.params.id));
    }

}
