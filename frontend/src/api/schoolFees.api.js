import api from "./axios";

// Set school fee for a class and term
export const setSchoolFee = async (feeData) => {
  const res = await api.post("/school-fees", feeData);
  return res.data;
};

export const getFees = async () => {
  const res = await api.get("/school-fees");
  return res.data;
};


// Optionally: get fee by class and term (if you expose it later)
export const getSchoolFee = async (classId, termId) => {
  const res = await api.get(`/school-fees?class_id=${classId}&term_id=${termId}`);
  return res.data;
};
