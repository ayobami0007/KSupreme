import api from "./axios";
export const addPayment = async (paymentData) =>
  (await api.post("/payments", paymentData)).data;

export const getStudentDashboard = async (studentId) =>
  (await api.get(`/payments/dashboard/${studentId}`)).data;
