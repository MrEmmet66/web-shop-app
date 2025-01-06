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
        login: (state, action) => {
            state.jwtToken = action.payload.jwtToken;
            state.user = action.payload.user;
            state.error = null;
        },
        logout: (state) => {
            state.jwtToken = null;
            state.user = null;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }

})

export const { login, logout, setError } = authSlice.actions;
export default authSlice.reducer;