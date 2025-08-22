import { apiGet } from "./api";

export const getUsers = async () => apiGet("/users");
