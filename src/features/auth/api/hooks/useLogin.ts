import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: Error | string | unknown) => void;
}

export function useLogin({ onSuccess, onError }: UseLoginOptions = {}) {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      loginApi(payload.email, payload.password),
    onSuccess: (data) => {
      dispatch(setCredentials({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }));
      onSuccess?.();
    },
    onError: (error: Error | string | unknown) => {
      onError?.(error);
    },
  });
}