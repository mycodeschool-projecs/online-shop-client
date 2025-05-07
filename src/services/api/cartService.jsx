import {request} from "./api-utils.jsx";

const baseUrl = "cart";
export const getCartByUserId      = ()                        => request(baseUrl+'/all',          'GET');
export const addProductToCart     = product                   => request(baseUrl+'/products',     'POST', product);
export const updateCartQuantity   = (productId, payload)      => request(baseUrl+`/products/${productId}`, 'PUT',    payload);
export const deleteProductFromCart= productId                 => request(baseUrl+`/products/${productId}`, 'DELETE');
export const clearUserCart        = ()                        => request(baseUrl+'/delete',       'DELETE');
