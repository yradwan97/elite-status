import { useMutation } from "@tanstack/react-query";
import { authApi } from "../authApi";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ApiError } from "@/common/api/commonApi";

interface UseResetPasswordOptions {
    onSuccess?: () => void;
    onError?: (error: Error | string | unknown) => void;
}

export function useResetPassword({ onSuccess, onError }: UseResetPasswordOptions = {}) {
    const { t } = useTranslation()
    return useMutation({
        mutationFn: (payload: { password: string, token: string }) =>
            authApi.resetPassword(payload.password, payload.token),
        onSuccess: () => {
            toast.success(t("Auth.resetPassword.success"))
            onSuccess?.();
        },
        onError: (error: Error | string | unknown) => {
            onError?.(error);
            const errorMessage =
                (error as ApiError)?.response?.data?.message ||
                (error as Error)?.message ||
                'Failed to change password';
            toast.error(t("Auth.resetPassword.error", { error: errorMessage}))
        },
    });
}