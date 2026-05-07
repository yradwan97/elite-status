import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { RequestExtraServicesPayload, reservationApi } from "../reservationApi";
import { ApiError } from "@/common/api/commonApi";

export default function useRequestExtraServicesMutation() {
    const { t } = useTranslation();
    return useMutation({
        mutationFn: (payload: RequestExtraServicesPayload) =>
            reservationApi.requestExtraServices(payload),

        onSuccess: (data) => {
            console.log(data)
            toast.success(t("Account.Bookings.services.success"));
        },

        onError: (e: unknown) => {
            const error = (e as ApiError)?.response?.data?.message ||
                (e as Error)?.message;
            toast.error(t("Account.Bookings.services.fail", { error }));
        },
    });
}