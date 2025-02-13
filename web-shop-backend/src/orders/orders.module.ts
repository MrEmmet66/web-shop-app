import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        OrdersController,],
    providers: [
        OrdersService,],
})
export class OrdersModule { }
