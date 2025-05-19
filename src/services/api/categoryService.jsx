// src/services/categoryService.jsx
import { request } from "./api-utils.jsx";

const baseUrl = "api/v1/categories";

/* ------------------------------------------------------------------ */
/* Queries                                                            */
/* ------------------------------------------------------------------ */

/** GET /api/v1/categories/all – all categories (ADMIN or CLIENT) */
export const getAllCategories = () =>
    request(`${baseUrl}/all`, "GET");

/* ------------------------------------------------------------------ */
/* Commands (ADMIN-only)                                              */
/* ------------------------------------------------------------------ */

/** POST /api/v1/categories – create a root category */
export const addCategory = (data) =>
    request(baseUrl, "POST", data);

/** PUT /api/v1/categories/{id} – update a category */
export const updateCategory = (id, data) =>
    request(`${baseUrl}/${id}`, "PUT", data);

/** DELETE /api/v1/categories/{id} – delete a category */
export const deleteCategory = (id) =>
    request(`${baseUrl}/${id}`, "DELETE");

/** POST /api/v1/categories/{id}/subcategories – add a child category */
export const addSubcategory = (id, data) =>
    request(`${baseUrl}/${id}/subcategories`, "POST", data);
