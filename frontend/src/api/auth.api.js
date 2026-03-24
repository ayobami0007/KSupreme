// import api from "./axios"

// export const login = async (credentials) => {
//     const res = await api.post("/bursar/login", credentials);
//     return res.data; 
// }

import api from "./axios";

export const login = async (credentials) => {
  const res = await api.post("/bursar/login", credentials);
  
  // ✅ Save token immediately after login
  const token = res.data.token; // make sure your backend returns { token: "..." }
  if (token) {
    localStorage.setItem("token", token);
  } else {
    console.error("Login response did not contain a token!");
  }

  return res.data;
};