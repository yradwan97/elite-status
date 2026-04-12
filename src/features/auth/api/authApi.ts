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

export async function registerApi(payload: RegisterPayload) {
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
}

export async function loginApi(email: string, password: string) {
  const { data } = await axios.post("/auth/login", { email, password, role: "USER" });
  return data.data;
}