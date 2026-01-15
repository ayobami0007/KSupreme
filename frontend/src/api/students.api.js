import api from "./axios";
export const getStudents = async (filters = {}) =>
  (await api.get("/students", { params: filters })).data;

export const addStudent = async (studentData) =>
  (await api.post("/students", studentData)).data;

export const updateStudent = async (id, studentData) =>
  (await api.put(`/students/${id}`, studentData)).data;





// export const getStudentsByClass = async (classId, termId, sessionName, search = "", offset = 0) => {
//   const res = await api.get("/students/with-status", {
//     params: { class_id: classId, term_id: termId, sessionName, search, offset }
//   });
//   return res.data;
// };

// students.api.js
export const getStudentsByClass = async (
  classId = null,
  search = "",
  limit = 30,
  offset = 0
) => {
  const res = await api.get("/students/with-status", {
    params: {
      class_id: classId,   // optional: if null, returns all students
      search,              // optional: filter by name
      limit,               // default 30 per page
      offset               // pagination offset
    }
  });
  return res.data;
};

