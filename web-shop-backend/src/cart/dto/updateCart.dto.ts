export type UpdateCartDto = {
    cartId: number;
    cartItems: {
        productId: number;
        quantity: number;
    }[]
}