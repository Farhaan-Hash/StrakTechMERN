import {PRODUCTS_SELECTED_URL, PRODUCTS_URL, UPLOAD_URL} from "../constants";
import {apiSlice} from "./apiSlice";

export const productsApiSLice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // * name gets changed down
    getProducts: builder.query({
      query: () => ({url: PRODUCTS_URL}),
      keepUnusedDataFor: 5,
    }),

    getSelectedProducts: builder.query({
      query: ({keyword, pageNumber}) => ({
        url: PRODUCTS_SELECTED_URL,
        params: {
          keyword,
          pageNumber,
        },
      }),
      keepUnusedDataFor: 5,
    }),

    getProductDetails: builder.query({
      query: (productId) => ({url: `${PRODUCTS_URL}/${productId}`}),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: PRODUCTS_URL,
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"], //invalidates cache so we have fresh data
    }),
    updateProduct: builder.mutation({
      query: (product) => ({
        url: `${PRODUCTS_URL}/${product._id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: "POST",
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
    }),
    createReview: builder.mutation({
      query: (review) => ({
        url: `${PRODUCTS_URL}/${review.productId}/reviews`,
        method: "POST",
        body: review,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteReview: builder.mutation({
      query: (params) => ({
        url: `${PRODUCTS_URL}/${params.productId}/reviews/${params.reviewId}`,
        method: "DELETE",
        body: params,
      }),
      invalidatesTags: ["Product"],
    }),
    topRatedProducts: builder.query({
      query: () => ({url: `${PRODUCTS_URL}/top`}),
    }),
    keepUnusedDataFor: 5,
  }),
});

// Endpoint name gets prefixed with 'use' and 'Query' is added at the last in the name
export const {
  useGetProductsQuery,
  useGetSelectedProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useTopRatedProductsQuery,
} = productsApiSLice;
