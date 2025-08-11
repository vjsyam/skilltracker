import api from "./api"; // axios instance

export const getEmployees = () => api.get("/employees");

export const getEmployeeById = (id) => api.get(`/employees/${id}`);

export const createEmployee = (employee) => api.post("/employees", employee);

export const updateEmployee = (id, employee) => api.put(`/employees/${id}`, employee);

export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
