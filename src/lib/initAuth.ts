import { store } from "@/store";
import { setCredentials, clearCredentials } from "@/store/slices/authSlice";
import { isTokenValid } from "@/lib/tokenHelper";

export function initAuth() {
  const user = localStorage.getItem("user");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!user || !accessToken || !refreshToken) return;

  if (isTokenValid(accessToken)) {
    store.dispatch(setCredentials({
      user: JSON.parse(user),
      accessToken,
      refreshToken,
    }));
  } else {
    ["user", "accessToken", "refreshToken"].forEach((key) => localStorage.removeItem(key));
    store.dispatch(clearCredentials());
  }
}