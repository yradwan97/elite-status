import { useMutation } from "@tanstack/react-query";
import { authApi } from "../authApi";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UseForgetPasswordOptions {
    onSuccess?: () => void;
    onError?: (error: Error | string | unknown) => void;
}

export function useForgetPassword({ onSuccess, onError }: UseForgetPasswordOptions = {}) {
    const {t} = useTranslation()
    return useMutation({
        mutationFn: (payload: { email: string; }) =>
            authApi.forgetPassword(payload.email),
        onSuccess: () => {
            toast.success(t("Auth.changePassword.success"))
            onSuccess?.();
        },
        onError: (error: Error | string | unknown) => {
            onError?.(error);
            toast.error(t("Auth.changePassword.fail"))
        },
    });
}