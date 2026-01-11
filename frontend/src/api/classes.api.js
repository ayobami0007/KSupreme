
import api from "./axios";

// Get all classes
export const getClasses = async (filters = {}) => {
  const res = await api.get("/classes", { params: filters });
  return res.data;
};

// Create a class
export const createClass = async (classData) => {
  const res = await api.post("/classes", classData);
  return res.data;
};

// Update a class
export const updateClass = async (id, classData) => {
  const res = await api.put(`/classes/${id}`, classData);
  return res.data;
};
