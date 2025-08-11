import api from "./api";

export const getDepartments = () => api.get("/departments");
export const getDepartmentById = (id) => api.get(`/departments/${id}`);
export const createDepartment = (department) => api.post("/departments", department);
export const updateDepartment = (id, department) => api.put(`/departments/${id}`, department);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);
