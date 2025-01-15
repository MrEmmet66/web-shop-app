import { createSlice } from "@reduxjs/toolkit";
import { User } from "../users/user";

interface AuthState {
    jwtToken: string | null;
    user: User | null;
    error: string | null;
}

const initialState: AuthState = {
    jwtToken: null,
    user: null,
    error: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthState: (state, action) => {
            state.jwtToken = action.payload.jwtToken;
            state.user = action.payload.user;
            state.error = null;
        },
        resetAuthState: (state) => {
            state.jwtToken = null;
            state.user = null;
            state.error = null;
        },
        refreshToken: (state, action) => {
            console.log("refreshToken", action.payload);
            
            state.jwtToken = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }

})

export const { setAuthState, resetAuthState, refreshToken, setError } = authSlice.actions;
export default authSlice.reducer;