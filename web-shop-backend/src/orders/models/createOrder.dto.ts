export type OrderItemDto = {
    productId: number;
    quantity: number;
}

export enum OrderStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Shipped = 'Shipped',
    Delivered = 'Delivered',
    Cancelled = 'Cancelled',
}

export type CreateOrderDto = {
    orderItems: OrderItemDto[];
    shippingAddress: string;
    userId: number | null;

    
}