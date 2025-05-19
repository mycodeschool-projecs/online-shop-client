// src/services/cartService.jsx
import { request } from "./api-utils.jsx";

const baseUrl = "/api/v1/cart";

/* ------------------------------------------------------------------ */
/* Queries                                                            */
/* ------------------------------------------------------------------ */

/** GET /api/v1/cart/all – returns the authenticated user’s cart */
export const getCart = () =>
    request(`${baseUrl}/all`, "GET");

/* ------------------------------------------------------------------ */
/* Commands                                                           */
/* ------------------------------------------------------------------ */

/** POST /api/v1/cart/products – body: { productId, quantity } (etc.) */
export const addProductToCart = (product) =>
    request(`${baseUrl}/products`, "POST", product);

/** PUT /api/v1/cart/products/{productId} – body: { quantity } */
export const updateCartQuantity = (productId, payload) =>
    request(`${baseUrl}/products/${productId}`, "PUT", payload);

/** DELETE /api/v1/cart/products/{productId} */
export const deleteProductFromCart = (productId) =>
    request(`${baseUrl}/products/${productId}`, "DELETE");

/** DELETE /api/v1/cart/delete – empties the whole cart */
export const clearUserCart = () =>
    request(`${baseUrl}/delete`, "DELETE");
