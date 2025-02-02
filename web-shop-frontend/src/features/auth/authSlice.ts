import { createSlice } from "@reduxjs/toolkit";
import { User } from "../users/user";
import { ACCESS_TOKEN_STORAGE } from "@/constants";

interface AuthState {
    jwtToken: string | null;
    user: User | null;
}

const initialState: AuthState = {
    jwtToken: null,
    user: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthState: (state, action) => {
            state.jwtToken = action.payload.jwtToken;
            state.user = action.payload.user;
        },
        resetAuthState: (state) => {
            state.jwtToken = null;
            state.user = null;
            localStorage.removeItem(ACCESS_TOKEN_STORAGE);
            console.log('resetAuthState');
            
        },
        refreshToken: (state, action) => {
            localStorage.setItem(ACCESS_TOKEN_STORAGE, action.payload.accessToken);
            state.jwtToken = action.payload;
        },
    }

})

export const { setAuthState, resetAuthState, refreshToken } = authSlice.actions;
export default authSlice.reducer;