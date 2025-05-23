// src/services/orderService.jsx
import { request } from "./api-utils.jsx";

const baseUrl = "api/v1/order";

/* ------------------------------------------------------------------ */
/* Commands (CLIENT & ADMIN)                                          */
/* ------------------------------------------------------------------ */

export const addOrder             = (order)      =>
    request(`${baseUrl}/sendOrder`,         "POST",   order);

export const cancelOrder          = (id)         =>
    request(`${baseUrl}/cancelOrder/${id}`, "PUT");

export const deleteOrder          = (id)         =>
    request(`${baseUrl}/deleteOrder/${id}`, "DELETE");

export const updateOrder          = (id, data)   =>
    request(`${baseUrl}/updateOrder/${id}`, "PUT",   data);

/* ------------------------------------------------------------------ */
/* Queries                                                            */
/* ------------------------------------------------------------------ */

export const getAllCustomerOrders = () =>
    request(`${baseUrl}/getCustomerOrders`, "GET");

export const getRecentOrders      = () =>
    request(`${baseUrl}/getRecentOrders`,   "GET");

export const totalOrders          = () =>
    request(`${baseUrl}/totalOrders`,       "GET");

export const totalRevenue         = () =>
    request(`${baseUrl}/totalRevenue`,      "GET");

export const monthly              = () =>
    request(`${baseUrl}/monthly`,           "GET");

export const getAllOrders         = () =>
    request(`${baseUrl}/all`,               "GET");
