import { createSlice } from "@reduxjs/toolkit";
import { User } from "../users/user";

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
            localStorage.removeItem('token');
            console.log('resetAuthState');
            
        },
        refreshToken: (state, action) => {
            localStorage.setItem('token', action.payload.accessToken);
            state.jwtToken = action.payload;
        },
    }

})

export const { setAuthState, resetAuthState, refreshToken } = authSlice.actions;
export default authSlice.reducer;