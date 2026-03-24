import api from "./axios"

export const login = async (credentials) => {
    const res = await api.post("/bursar/login", credentials);
    return res.data; 
}

