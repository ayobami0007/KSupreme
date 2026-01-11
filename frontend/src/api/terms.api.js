import api from "./axios";



export const createTerm = async (termData) => { 
  const res = await api.post("/terms", termData);
   return res.data; };

// Get all terms for a session
export const getTermsBySession = async (sessionId) => {
  const res = await api.get(`/terms/session/${sessionId}`);
  return res.data;
};

// Get all terms 
export const getTerms = async () => { 
const res = await api.get("/terms");
 return res.data; };

// Activate a term
export const activateTerm = async (id) => {
  const res = await api.put(`/terms/${id}/activate` );
  return res.data;
};

// Get active term for a session
export const getActiveTerm = async (sessionId) => {
  const res = await api.get(`/terms/active/${sessionId}`);
  return res.data;
};
