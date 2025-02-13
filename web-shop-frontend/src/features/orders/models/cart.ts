import { ProductCartItem } from "./productCartItem";

export type CartItem = {
    id: number;
    productId: number;
    quantity: number;
}

export type Cart = {
    cartId: number;
    cartItems: ProductCartItem[];
    
}