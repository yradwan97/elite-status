import axios from "@/lib/axios";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber: string;
  IDFront: string;
  IDBack: string;
}

export const authApi = {
  register: async (payload: RegisterPayload) => {
    const formData = new FormData();
    formData.append("firstName", payload.firstName);
    formData.append("lastName", payload.lastName);
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("mobileNumber", payload.mobileNumber);
    formData.append("IDFront", payload.IDFront);
    formData.append("IDBack", payload.IDBack);

    const { data } = await axios.post("/auth/register", formData);
    return data;
  },

  login: async (email: string, password: string) => {
    const { data } = await axios.post("/auth/login", { email, password, role: "USER" });
    return data.data;
  },

  forgetPassword: async (email: string) => {
    const { data } = await axios.post("/auth/forget-password", { email });
    return data.data;
  },

  resetPassword: async (password: string, token: string) => {
    const { data } = await axios.post(`/auth/reset_password?token=${token}`, { password });
    return data.data;
  },

  getUserProfile: async () => {
    const response = await axios.get("/users")
    return response.data.data;
  }
}