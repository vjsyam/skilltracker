import { apiGet, apiPut } from "./api";

export const getTasksForEmployeeSkill = (employeeSkillId) =>
  apiGet(`/learning-tasks/employee-skill/${employeeSkillId}`);

export const updateTaskStatus = (taskId, status) =>
  apiPut(`/learning-tasks/${taskId}/status?status=${status}`);


