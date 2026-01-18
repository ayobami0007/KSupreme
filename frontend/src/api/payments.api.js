import api from "./axios";
export const addPayment = async (paymentData) =>
  (await api.post("/payments", paymentData)).data;

export const getStudentDashboard = async (studentId) =>
  (await api.get(`/payments/dashboard/${studentId}`)).data;




export const getStudentPaymentInfo = async (id) => {
  const res = await api.get(`/payments/students/${id}/payment-info`);
  return res.data;
};

// }