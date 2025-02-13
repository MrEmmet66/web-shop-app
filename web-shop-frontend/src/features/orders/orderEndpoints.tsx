import { apiSlice } from "../api/apiSlice";
import { Cart } from "./models/cart";

const orderEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query<Cart, void>({
            query: () => ({
                url: '/cart',
                method: 'GET'
            })
        }),
        updateCart: builder.mutation<Cart, Partial<Cart>>({
            query: (data) => ({
                url: '/cart',
                method: 'PATCH',
                body: data
            })
        })
    })
})

export const { useGetCartQuery, useUpdateCartMutation } = orderEndpoints;