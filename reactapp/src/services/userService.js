import { apiGet, apiPut, apiDelete } from "./api";

export const getUsers = async () => apiGet("/users");
export const updateUser = (id, user) => apiPut(`/users/${id}`, user);
export const deleteUser = (id) => apiDelete(`/users/${id}`);
