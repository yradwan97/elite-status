import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  exp: number;
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const { exp } = jwtDecode<TokenPayload>(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
}