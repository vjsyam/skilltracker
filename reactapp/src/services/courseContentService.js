import { apiGet } from "./api";

export const getCourseContent = (skillId) => apiGet(`/skills/${skillId}/content`);


