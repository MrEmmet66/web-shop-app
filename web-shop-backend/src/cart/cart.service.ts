import { Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateCartDto } from './dto/updateCart.dto';

@Injectable()
export class CartService {
    constructor(private prismaService: PrismaService) {}

    async createCart(userId: number) {
        return this.prismaService.cart.create({
            data: {
                userId
            }
        })
    }

    async getUserCart(userId: number) {
        return this.prismaService.cart.findFirst({
            where: {
                userId
            },
            include: {
                cartItems: {
                    include: {
                        product: {

                        }
                    }
                    
                }
            }
        })
    }

    async updateCart(updateCartDto: UpdateCartDto) {
        const { cartId, cartItems } = updateCartDto;
        const cartItemsData = cartItems.map(cartItem => {
            return {
                productId: cartItem.productId,
                quantity: cartItem.quantity
            }
        })

        return this.prismaService.cart.update({
            where: {
                id: cartId
            },
            data: {
                cartItems: {
                    deleteMany: {},
                    createMany: {
                        data: cartItemsData
                    }
                }
            }
        })
    }




}
