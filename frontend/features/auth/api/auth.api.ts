import api from "@/lib/api";

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  email: string;
  password?: string;
  full_name: string;
  phone: string;
  city: string;
}

export const authApi = {
  login: async (data: LoginPayload) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterPayload) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
  
  // Future API endpoints like refresh, logout, etc can be added here
};
