// src/services/productService.jsx
import { request } from "./api-utils.jsx";

const baseUrl = "api/v1/products";

/* ------------------------------------------------------------------ */
/* Queries                                                            */
/* ------------------------------------------------------------------ */

export const getAllProducts = () =>
    request(`${baseUrl}/all`, "GET");          // GET  /api/v1/products/all

export const totalProducts  = () =>
    request(`${baseUrl}/total`, "GET");        // GET  /api/v1/products/total

export const mostSold       = () =>
    request(`${baseUrl}/most-sold`, "GET");    // GET  /api/v1/products/most-sold

/* ------------------------------------------------------------------ */
/* Commands (ADMIN)                                                   */
/* ------------------------------------------------------------------ */

export const addProduct = (data) =>
    request(`${baseUrl}/add`, "POST", data);              // POST /add

export const updateProduct = (id, data) =>
    request(`${baseUrl}/edit/${id}`, "PUT", data);        // PUT  /edit/{id}

export const deleteProduct = (id) =>
    request(`${baseUrl}/delete/${id}`, "DELETE");         // DELETE /delete/{id}
