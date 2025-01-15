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
                url: 'auth/register',
                method: 'POST',
                body: user
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'auth/logout',
                method: 'POST'
            })
        }),
        getUserProfile: builder.query<User, void>({
            query: () => ({
                url: 'users/profile',
                method: 'GET'
            })
        }),

    })
})

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useGetUserProfileQuery } = authEndpoints;