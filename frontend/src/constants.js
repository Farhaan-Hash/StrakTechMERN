export const BASE_URL = process.env.NODE_ENV === "development" ? "" : "";

export const PRODUCTS_URL = `/api/products`;

export const PRODUCTS_SELECTED_URL = `${PRODUCTS_URL}/selected`; //As per Pagination

export const USERS_URL = `/api/users`;

export const ORDERS_URL = `/api/orders`;

export const UPLOAD_URL = `/api/upload`;

export const PAYPAL_URL = `/api/config/paypal`;
