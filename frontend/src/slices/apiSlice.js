import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import { logout, setCredentials } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Attempt to get a new access token using the refresh token
    const refreshToken = api.getState().auth.userInfo?.refreshToken;
    if (refreshToken) {
      // Use baseQuery to call /users/refresh endpoint
      const refreshResult = await baseQuery(
        {
          url: '/users/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Refresh succeeded - save the new access token and rotated refresh token
        const userInfo = api.getState().auth.userInfo;
        api.dispatch(
          setCredentials({
            ...userInfo,
            token: refreshResult.data.token,
            refreshToken: refreshResult.data.refreshToken,
          })
        );
        // Retry the original query with the new access token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed (e.g. refresh token expired or invalid) - log out the user
        api.dispatch(logout());
      }
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
