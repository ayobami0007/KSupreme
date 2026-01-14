import api from "./axios";
export const getStudents = async (filters = {}) =>
  (await api.get("/students", { params: filters })).data;

export const addStudent = async (studentData) =>
  (await api.post("/students", studentData)).data;

export const updateStudent = async (id, studentData) =>
  (await api.put(`/students/${id}`, studentData)).data;





// Fetch students by class and term, with optional search
export const getStudentsByClass = async (classId, termId, search = "") => {
  const res = await api.get("/students/with-status", {
    params: {
      class_id: classId,
      term_id: termId,
      search
    }
  });
  return res.data;
};
