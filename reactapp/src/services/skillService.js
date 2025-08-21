import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export const getSkills = async (page = 0, size = 10, sortBy = "id", sortDir = "asc") => {
  try {
    const res = await apiGet("/skills", { page, size, sortBy, sortDir });
    return res.content || res.data || res || [];
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
};

export const getSkillById = (id) => apiGet(`/skills/${id}`);
export const createSkill = (skill) => apiPost("/skills", skill);
export const updateSkill = (id, skill) => apiPut(`/skills/${id}`, skill);
export const deleteSkill = (id) => apiDelete(`/skills/${id}`);