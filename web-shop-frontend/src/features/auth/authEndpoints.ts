import { apiSlice } from "../api/apiSlice";
import { User } from "../users/user";
import { AuthResponse } from "./models/authResponse";
import { UserDto } from "./models/userDto";

const authEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, {email: string, password: string}>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials
            })
        }),
        register: builder.mutation<AuthResponse, UserDto>({
            query: (user) => ({
                url: '/register',
                method: 'POST',
                body: user
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST'
            })
        }),
        getUserProfile: builder.query<User, void>({
            query: () => ({
                url: 'users/profile',
                method: 'GET'
            })
        }),
        forgotPassword: builder.mutation<void, {email: string}>({
            query: (email) => ({
                url: '/forgotPassword',
                method: 'POST',
                body: email
            })
        }),
        resetPassword: builder.mutation<void, {token: string, password: string}>({
            query: ({token, password}) => ({
                url: '/resetPassword',
                method: 'POST',
                body: {token, password}
            })
        })
    })
})

export const { useForgotPasswordMutation, useResetPasswordMutation, useLoginMutation, useRegisterMutation, useLogoutMutation, useGetUserProfileQuery } = authEndpoints;