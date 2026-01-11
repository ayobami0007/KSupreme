import api from "./axios";
export const getReports = async (filters = {}) =>
  (await api.get("/reports/payments", { params: filters })).data;
