import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { CancelReservationPayload, reservationApi } from "../reservationApi";

export default function useCancelReservationMutation() {
    const { t } = useTranslation();
    return useMutation({
        mutationFn: (payload: CancelReservationPayload) =>
            reservationApi.requestReservationCancelation(payload),

        onSuccess: (data) => {
            console.log(data)
            toast.success(t("Account.Bookings.cancel.success"));
        },

        onError: (e: unknown) => {
            const error = (e as any)?.response?.data?.message ||
                (e as Error)?.message;
            toast.error(t("Account.Bookings.cancel.failure", { error }));
        },
    });
}