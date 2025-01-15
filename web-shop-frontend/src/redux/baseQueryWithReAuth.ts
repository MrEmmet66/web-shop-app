import { refreshToken, resetAuthState } from '@/features/auth/authSlice'
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'

import { Mutex } from 'async-mutex'

const mutex = new Mutex()
const baseQuery = fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/v1',
  credentials: 'include', 
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  } 
 })

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = await baseQuery(
          '/refresh',
          api,
          extraOptions,
        )
        if (refreshResult.data) {
          api.dispatch(refreshToken(refreshResult.data))

          result = await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch(resetAuthState())
        }
        release()
      } catch(e) {
        release()
        throw e  
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}