/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderDto } from './models/createOrder.dto';

@Injectable()
export class OrdersService {
    constructor(private prismaService: PrismaService) { }

    async createOrder(orderDto: CreateOrderDto) {
        return this.prismaService.order.create({
            data: {
                ...orderDto,
                orderItems: {
                    create: orderDto.orderItems.map((orderItem) => ({
                        quantity: orderItem.quantity,
                        product: {
                            connect: { id: orderItem.productId }
                        }
                    }))
                },
                updatedAt: new Date(),
                createdAt: new Date()
            }
        })
    }

    async getOrders() {
        return this.prismaService.order.findMany({
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }

    async getOrderById(orderId: number) {
        return this.prismaService.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }

    async updateOrderStatus(orderId: number, status: string) {
        return this.prismaService.order.update({
            where: { id: orderId },
            data: { status, updatedAt: new Date() }
        });
    }

    async getByUserId(userId: number) {
        return this.prismaService.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }
}
