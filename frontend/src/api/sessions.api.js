import api from "./axios";

// Create a new session
export const createSession = async (sessionData) => {
  const res = await api.post("/sessions", sessionData);
  return res.data;
};

// Get all sessions
export const getSessions = async () => {
  const res = await api.get("/sessions");
  return res.data;
};

// Activate a session
export const activateSession = async (id) => {
  const res = await api.put(`/sessions/${id}/activate`);
  return res.data;
};

// Get active session
export const getActiveSession = async () => {
  const res = await api.get("/sessions/active");
  return res.data;
};
