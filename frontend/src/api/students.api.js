import api from "./axios";
export const getStudents = async (filters = {}) =>
  (await api.get("/students", { params: filters })).data;

export const addStudent = async (studentData) =>
  (await api.post("/students", studentData)).data;

export const updateStudent = async (id, studentData) =>
  (await api.put(`/students/${id}`, studentData)).data;
