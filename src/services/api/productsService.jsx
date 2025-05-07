/* ------------------------------------------------------------------
   Product API – base path /api/v1/products
   Endpoints in ProductController:
     GET    /api/v1/products                – list all
     POST   /api/v1/products                – create
     PUT    /api/v1/products/{id}           – update
     DELETE /api/v1/products/{id}           – delete
     GET    /api/v1/products/most-sold      – top sellers
     GET    /api/v1/products/total          – count
------------------------------------------------------------------ */

// const BASE_URL = 'http://localhost:8080/api/v1/products';
import { BASE_URL } from '../../config/index.js';
/* ---------- low-level fetch wrapper -------------------------------- */
function api(path = '', method = 'GET', body = null) {
  const url =`${BASE_URL}/products/${path}`

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Requested-With': 'XMLHttpRequest',
      // 'Authorization': `Bearer ${token}`, // add if you persist JWT
    },
  };

  if (body !== null && method !== 'GET' && method !== 'HEAD') {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options);
}

/* ---------- higher-level helper with uniform result shape ---------- */
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
    throw Object.assign(new Error(msg), { status: response.status });
  } catch (err) {
    return {
      success: false,
      status: err.status ?? 500,
      message: err.message || 'Something went wrong',
    };
  }
}

/* ------------------------------------------------------------------
   Product operations
------------------------------------------------------------------ */
export const getAllProducts = () => request('all','GET');                         // GET /

export const totalProducts  = () => request('total', 'GET');           // GET /total

export const mostSold       = () => request('most-sold', 'GET');       // GET /most-sold

export const addProduct     = data => request('',     'POST', data);   // POST /

export const updateProduct  = (id, data) =>
    request(id, 'PUT', data);                                            // PUT /{id}

export const deleteProduct  = id =>
    request(id, 'DELETE');                                               // DELETE /{id}
