import { createSlice } from "@reduxjs/toolkit";
import { Cart } from "./models/cart";

export interface CartState {
    cart: Cart | null;
}

const initialState: CartState = {
    cart: null
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action) => {
            console.log(action.payload);
            
            state.cart = {cartId: action.payload.id, cartItems: action.payload.cartItems}
        },
        addToCart: (state, action) => {
            if(state.cart) {
                state.cart.cartItems.push(action.payload)
            }
        },
        removeFromCart: (state, action) => {
            if(state.cart) {
                console.log(action.payload);
                
                state.cart.cartItems = state.cart.cartItems.filter((item) => item.id !== action.payload.id)
            }
        },
        updateCartItem: (state, action) => {
            if(state.cart) {
                state.cart.cartItems = state.cart.cartItems.map((item) => {
                    if(item.id === action.payload.id) {
                        return action.payload
                    }
                    return item
                })
            }
        }
    }
    
})

export const {
    setCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    
 } = cartSlice.actions;
export default cartSlice.reducer;