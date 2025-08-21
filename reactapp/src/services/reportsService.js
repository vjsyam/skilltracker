import { apiGet } from "./api";

export const getReports = async () => {
  try {
    const res = await apiGet("/reports");
    return res || {};
  } catch (error) {
    console.error('Error fetching reports:', error);
    return {};
  }
};