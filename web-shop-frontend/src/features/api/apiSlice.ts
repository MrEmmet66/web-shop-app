import { baseQueryWithReauth } from "@/redux/baseQueryWithReAuth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({})
})
