// src/services/userService.jsx
import { request } from "./api-utils.jsx";

const baseUrl = "api/v1/users";

/* ------------------------------------------------------------------ */
/* Authentication / Identity                                          */
/* ------------------------------------------------------------------ */

export const login    = (creds) => request(`${baseUrl}/login`,    "POST", creds);
export const register = (data)  => request(`${baseUrl}/register`, "POST", data);
export const getUserRole = ()   => request(`${baseUrl}/role`,     "GET"); // requires Auth header

/* ------------------------------------------------------------------ */
/* CRUD  (admin / self)                                               */
/* ------------------------------------------------------------------ */

export const getById    = (userId)       =>
    request(`${baseUrl}/find/${userId}`,  "GET");        // GET  /find/{id}

export const updateUser = (userId, data) =>
    request(`${baseUrl}/edit/${userId}`,  "PUT", data);  // PUT  /edit/{id}

export const deleteUser = (userId)       =>
    request(`${baseUrl}/delete/${userId}`, "DELETE");    // DELETE /delete/{id}

/* ------------------------------------------------------------------ */
/* Admin dashboards                                                   */
/* ------------------------------------------------------------------ */

export const totalUsers  = () => request(`${baseUrl}/total`,       "GET");
export const getAllUsers = () => request(`${baseUrl}/all`,         "GET");
export const mostActive  = () => request(`${baseUrl}/most-active`, "GET");

/* ------------------------------------------------------------------ */
/* (Optional) Admin-only create                                       */
/* ------------------------------------------------------------------ */

export const addUser = (data) =>
    request(`${baseUrl}/add`, "POST", data);
