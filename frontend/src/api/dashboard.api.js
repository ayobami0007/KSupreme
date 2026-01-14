import api from "./axios";

// Get dashboard summary
export const getDashboardSummary = async () => {
  const res = await api.get("/dashboard/summary");
  return res.data;
  
};

export const getRecentPayments = async (limit = 20) => { 
  const res = await api.get(`/dashboard/recent-payments?limit=${limit}`); 
  return res.data; };