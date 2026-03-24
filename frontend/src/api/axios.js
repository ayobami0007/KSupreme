// import axios from "axios";

// const api = axios.create({
//     baseURL: "https://ksupreme.onrender.com/api", 
//     headers:{
//        "Content-Type": "application/json"
//     }
// })

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;


// api.js
import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "https://ksupreme.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Remove invalid token if it exists
const tokenInStorage = localStorage.getItem("token");
if (!tokenInStorage || tokenInStorage === "undefined") {
  localStorage.removeItem("token");
}

// Request interceptor to attach token safely
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No valid token found! Redirect user to login if needed.");
      // Optional: redirect user to login page
      // window.location.href = "/login";
      return config; // send request without token (if some endpoints allow)
    }

    // Only attach Authorization if valid token exists
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;