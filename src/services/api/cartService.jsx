/* ------------------------------------------------------------------
   Cart API – versioned at /api/v1/cart
   Endpoints (as defined in CartController):
     GET    /api/v1/cart                       – get cart
     POST   /api/v1/cart/products              – add item
     PUT    /api/v1/cart/products/{productId}  – change qty
     DELETE /api/v1/cart/products/{productId}  – remove item
     DELETE /api/v1/cart                       – empty cart
------------------------------------------------------------------ */

import { BASE_URL } from '../../config/index.js';

/**
 * Low-level fetch wrapper
 */
function api(path = '', method = 'GET', body = null) {
    const url = `${BASE_URL}/cart/${path}`

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
            // 'Authorization': `Bearer ${token}`,   // ← add if you store JWT
        },
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options);
}

/**
 * Higher-level helper that normalises the response:
 *  – treats any 2xx as success
 *  – attaches parsed JSON (or null) as body
 */
async function request(path = '', method = 'GET', body = null) {
    try {
        const response = await api(path, method, body);
        const data = await response
            .json()
            .catch(() => null); // handle 204 / empty response

        if (!response.ok) { // any status outside 200–299
            const msg =
                (data && data.message) ||
                response.statusText ||
                'Request failed';
            const error = new Error(msg);
            error.status = response.status;
            throw error;
        }

        return {
            success: true,
            status: response.status,
            body: data,
        };
    } catch (error) {
        return {
            success: false,
            status: error.status ?? 500,
            message: error.message || 'Something went wrong',
        };
    }
}

/* ------------------------------------------------------------------
   Cart operations
------------------------------------------------------------------ */
export async function getCartByUserId() {
    return request(`all`, 'GET');
}

export const addProductToCart = product =>
    request('products', 'POST', product);

export const updateCartQuantity = (productId, payload) =>
    request(`products/${productId}`, 'PUT', payload);

export const deleteProductFromCart = productId =>
    request(`products/${productId}`, 'DELETE');

export const clearUserCart = () =>
    request('delete', 'DELETE');
