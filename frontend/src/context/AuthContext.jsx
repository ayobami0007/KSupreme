
import { createContext, useContext, useState } from "react";
import { login as loginApi } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser || storedUser === "undefined") {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (err) {
      console.error("Invalid user in localStorage:", err);
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = async (data) => {
    const res = await loginApi(data);

 // ALWAYS stringify
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    setUser(res.user);
    // console.log("Login API response:", res)
  };

  const logout = () => {
    // localStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
