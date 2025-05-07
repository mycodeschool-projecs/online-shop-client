
import {request} from "./api-utils.jsx";
const baseUrl = "users";
export const login    = creds => request(baseUrl+'/login',    'POST', creds);
export const register = data  => request(baseUrl+'/register', 'POST', data);

/* ------------------------------------------------------------------
   CRUD  (admin / self)
------------------------------------------------------------------ */
export const getById     = userId        => request(baseUrl+"/"+userId, 'GET');
export const updateUser  = (userId,data) => request(baseUrl+"/"+userId,  'PUT',    data);
export const deleteUser  = userId        => request(baseUrl+"/"+userId, 'DELETE');

/* ------------------------------------------------------------------
   Admin dashboards
------------------------------------------------------------------ */
export const totalUsers  = () => request(baseUrl+'/total',       'GET');
export const getAllUsers = () => request(baseUrl+'/all',         'GET');
export const mostActive  = () => request(baseUrl+'/most-active', 'GET');
