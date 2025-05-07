/* ------------------------------------------------------------------
   Category API – versioned at /api/v1/categories
   Endpoints (CategoryController):
     GET    /api/v1/categories                       – all categories
     POST   /api/v1/categories                       – create root category
     POST   /api/v1/categories/{id}/subcategories    – add sub-category
     PUT    /api/v1/categories/{id}                  – update
     DELETE /api/v1/categories/{id}                  – delete
------------------------------------------------------------------ */

import { BASE_URL } from '../../config/index.js';
/* ---------- low-level fetch wrapper ---------- */
function api(path = '', method = 'GET', body = null) {
    const url = `${BASE_URL}/categories/${path}`

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        },
    };
    if (body !== null) options.body = JSON.stringify(body);

    return fetch(url, options);
}

/* ---------- high-level helper with uniform result shape ---------- */
async function request(path = '', method = 'GET', body = null) {
    try {
        const response = await api(path, method, body);
        const data = await response.json().catch(() => null);

        if (response.ok) {
            return { success: true, status: response.status, body: data };
        }

        const msg =
            (data && data.message) ||
            response.statusText ||
            'Request failed';
        const error = new Error(msg);
        error.status = response.status;
        throw error;
    } catch (err) {
        return {
            success: false,
            status: err.status ?? 500,
            message: err.message || 'Something went wrong',
        };
    }
}

/* ------------------------------------------------------------------
   Category operations
------------------------------------------------------------------ */
export const getAllCategories = () => request("all",'GET');                       // GET /

export const addCategory = data => request('', 'POST', data);          // POST /

export const deleteCategory = id => request(id, 'DELETE');             // DELETE /{id}

export const updateCategory = (id, data) =>
    request(id, 'PUT', data);                                            // PUT /{id}

export const addSubcategory = (parentId, data) =>
    request(`${parentId}/subcategories`, 'POST', data);                  // POST /{id}/subcategories
