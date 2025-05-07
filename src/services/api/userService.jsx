/* ------------------------------------------------------------------
   User API – base: /api/v1/users
------------------------------------------------------------------ */

import { BASE_URL } from '../../config/index.js';

/* ---------- low-level fetch wrapper -------------------------------- */
function api(path = '', method = 'GET', body = null) {
    const url = `${BASE_URL}/users/${path}`

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
            // 'Authorization': `Bearer ${token}`,   // add if you store JWT
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
   Auth
------------------------------------------------------------------ */
export const login    = creds => request('login',    'POST', creds);
export const register = data  => request('register', 'POST', data);

/* ------------------------------------------------------------------
   CRUD  (admin / self)
------------------------------------------------------------------ */
export const getById = userId =>
    request(String(userId), 'GET');                     // GET /{id}

export const updateUser = (userId, data) =>
    request(String(userId), 'PUT', data);               // PUT /{id}

export const deleteUser = userId =>
    request(String(userId), 'DELETE');                  // DELETE /{id}

/* ------------------------------------------------------------------
   Admin dashboards
------------------------------------------------------------------ */
export const totalUsers   = () => request('total',        'GET');  // GET /total
export const getAllUsers  = () => request('all',             'GET');  // GET /      (same as list)
export const mostActive   = () => request('most-active',  'GET');  // GET /most-active
