import { apiSlice } from './apiSlice';

export const couponsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCouponByCode: builder.query({
      query: (code) => ({
        url: `/api/coupons/${code}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createCoupon: builder.mutation({
      query: (data) => ({
        url: '/api/coupons',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),
    getCoupons: builder.query({
      query: () => ({
        url: '/api/coupons',
      }),
      providesTags: ['Coupon'],
      keepUnusedDataFor: 5,
    }),
    deleteCoupon: builder.mutation({
      query: (couponId) => ({
        url: `/api/coupons/${couponId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupon'],
    }),
  }),
});

export const {
  useGetCouponByCodeQuery,
  useLazyGetCouponByCodeQuery,
  useCreateCouponMutation,
  useGetCouponsQuery,
  useDeleteCouponMutation,
} = couponsApiSlice;
