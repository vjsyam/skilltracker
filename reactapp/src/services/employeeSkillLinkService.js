import { apiGet, apiPost } from "./api";

export const fetchEmployeeSkillsByEmployee = (employeeId) =>
  apiGet(`/employee-skills/employee/${employeeId}`);

export const promoteSkillToProfile = (employeeId, skillId) =>
  apiPost(`/employee-skills/promote?employeeId=${employeeId}&skillId=${skillId}`);

export const createLearningLink = (employeeId, skillId) =>
  apiPost(`/employee-skills`, { employee: { id: employeeId }, skill: { id: skillId } });


