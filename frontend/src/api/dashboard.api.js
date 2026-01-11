import api from "./axios";

// Get dashboard summary
export const getDashboardSummary = async () => {
  const res = await api.get("/dashboard/summary");
  return res.data;
};
