import { apiSlice } from "@/features/api/apiSlice";
import { authSlice } from "@/features/auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch