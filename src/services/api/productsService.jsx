import {request} from "./api-utils.jsx";
const baseUrl = "products";
export const getAllProducts = ()          => request(baseUrl+'/all',     'GET');     // GET /
export const totalProducts  = ()          => request(baseUrl+'/total',   'GET');     // GET /total
export const mostSold       = ()          => request(baseUrl+'/most-sold','GET');    // GET /most-sold
export const addProduct     = data        => request(baseUrl,        'POST', data);
export const updateProduct  = (id, data)  => request(baseUrl+"/"+id,        'PUT',  data);
export const deleteProduct  = id          => request(baseUrl+"/"+id,        'DELETE');
