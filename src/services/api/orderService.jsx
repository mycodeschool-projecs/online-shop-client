/* ------------------------------------------------------------------
   Order API – base: /api/v1/order
------------------------------------------------------------------ */
import { BASE_URL } from '../../config/index.js';

/* ---------- low-level fetch wrapper -------------------------------- */
function api(path = '', method = 'GET', body = null) {
  const url = `${BASE_URL}/order/${path}`

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Requested-With': 'XMLHttpRequest',
      // 'Authorization': `Bearer ${token}`,  // uncomment if you store JWT
    },
  };
  if (body !== null) options.body = JSON.stringify(body);

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
   Order operations (same paths the back-end exposes)
------------------------------------------------------------------ */
export const addOrder            = order => request('sendOrder', 'POST', order);

export const getAllCustomerOrders = () => request('getCustomerOrders', 'GET');

export const getRecentOrders      = () => request('getRecentOrders',  'GET');

export const totalOrders          = () => request('totalOrders',      'GET');

export const totalRevenue         = () => request('totalRevenue',     'GET');

export const monthly              = () => request('monthly',          'GET');

export const getAllOrders         = () => request('all',     'GET');

export const deleteOrder          = id  => request(`deleteOrder/${id}`, 'DELETE');

export const updateOrder          = (id, data) =>
    request(`updateOrder/${id}`, 'PUT', data);

export const cancelOrder          = id =>
    request(`cancelOrder/${id}`, 'PUT');
