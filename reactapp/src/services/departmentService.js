import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export const getDepartments = async (page = 0, size = 10, sortBy = "id", sortDir = "asc") => {
  try {
    const res = await apiGet("/departments", { page, size, sortBy, sortDir });
    return res.content || res.data || res || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};

export const getDepartmentById = (id) => apiGet(`/departments/${id}`);
export const createDepartment = (department) => apiPost("/departments", department);
export const updateDepartment = (id, department) => apiPut(`/departments/${id}`, department);
export const deleteDepartment = (id) => apiDelete(`/departments/${id}`);