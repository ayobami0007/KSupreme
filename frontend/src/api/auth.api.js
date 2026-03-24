// import api from "./axios"

// export const login = async (credentials) => {
//     const res = await api.post("/bursar/login", credentials);
//     return res.data; 
// }

import api from "./axios";

export const login = async (credentials) => {
  const res = await api.post("/bursar/login", credentials);

  // Handle token regardless of response structure
  const token = res.data.token || res.data.data?.token || res.data.accessToken;

  if (token) {
    localStorage.setItem("token", token);
    console.log("Token stored successfully!");
  } else {
    console.error("Login response did not contain a token!", res.data);
  }

  return res.data;
};