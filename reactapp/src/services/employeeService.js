import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export const getEmployees = (page = 0, size = 10, sortBy = "id", sortDir = "asc") => 
  apiGet("/employees", { page, size, sortBy, sortDir });

export const getEmployeeById = (id) => apiGet(`/employees/${id}`);

export const createEmployee = (employee) => apiPost("/employees", employee);

export const updateEmployee = (id, employee) => apiPut(`/employees/${id}`, employee);

export const deleteEmployee = (id) => apiDelete(`/employees/${id}`);
