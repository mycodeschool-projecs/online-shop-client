
import {request} from "./api-utils.jsx";
const baseUrl = "categories";
export const getAllCategories = ()            => request(baseUrl+'all', 'GET');        // GET /
export const addCategory      = data          => request(baseUrl,    'POST', data); // POST /
export const deleteCategory   = id            => request(baseUrl+"/"+id,    'DELETE');     // DELETE /{id}
export const updateCategory   = (id, data)    => request(baseUrl+"/"+id,    'PUT',  data); // PUT   /{id}
export const addSubcategory   = (id, data)    =>
    request(baseUrl+`/${id}/subcategories`, 'POST', data);                                // POST  /{id}/subcategories
