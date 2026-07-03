import { PRODUCTS_URL, UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber, category, price, rating, deals }) => ({
        url: PRODUCTS_URL,
        params: {
          keyword,
          pageNumber,
          category,
          price,
          rating,
          deals,
        },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getRelatedProducts: builder.query({
      query: (productId) => ({
        url: `/api/products/${productId}/related`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: 'POST',
        body: data,
      }),
    }),
    uploadMultipleProductImages: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}/multiple`,
        method: 'POST',
        body: data,
      }),
    }),
    createProductReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),
    getProductCategories: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/categories`,
      }),
    }),
  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductDetailsQuery,
  useGetRelatedProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useUploadMultipleProductImagesMutation,
  useCreateProductReviewMutation,
  useGetTopProductsQuery,
  useGetProductCategoriesQuery,
} = productsApiSlice;
