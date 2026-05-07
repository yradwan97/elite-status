import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { profileApi } from "../profileApi";
import { toast } from "sonner";
import { ApiError } from "@/common/api/commonApi";

export const useSubscribeToPlan = () => {
    const {t} = useTranslation();
    return useMutation({
        mutationFn: (planId: string) => profileApi.subscribeToPlan(planId),

        onSuccess: () => {
            // toast.success(t('Dashboard.Pricing.subsciptionSuccess'));
        },

        onError: (error: unknown) => {
            const errorMessage =
                (error as ApiError)?.response?.data?.message ||
                (error as Error)?.message ||
                'Failed to change password';

            toast.error(t("Dashboard.Pricing.subsciptionFailed", {error: errorMessage}));
        },
    });
};