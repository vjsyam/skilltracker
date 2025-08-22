import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export const getEmployees = (page = 0, size = 10) => 
  apiGet("/employees", { page, size });

export const getEmployeeById = (id) => apiGet(`/employees/${id}`);

export const createEmployee = (employee) => apiPost("/employees", employee);

export const updateEmployee = (id, employee) => apiPut(`/employees/${id}`, employee);

export const deleteEmployee = (id) => apiDelete(`/employees/${id}`);

// CSV export/import removed
