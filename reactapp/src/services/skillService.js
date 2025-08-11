import api from "./api";

export const getSkills = () => api.get("/skills");
export const getSkillById = (id) => api.get(`/skills/${id}`);
export const createSkill = (skill) => api.post("/skills", skill);
export const updateSkill = (id, skill) => api.put(`/skills/${id}`, skill);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);
