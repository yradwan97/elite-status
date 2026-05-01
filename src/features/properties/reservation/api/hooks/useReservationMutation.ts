import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { CreateReservationPayload, reservationApi } from "../reservationApi";

export default function useReservationMutation() {
    const { t } = useTranslation();
    return useMutation({
        mutationFn: (payload: CreateReservationPayload) =>
            reservationApi.createReservation(payload),

        onSuccess: (data) => {
            console.log(data)
            toast.success(t("Properties.Reservation.confirmation.success"));
        },

        onError: (e: unknown) => {
            const error = (e as any)?.response?.data?.message ||
                (e as Error)?.message;
            toast.error(t("Properties.Reservation.confirmation.failure", { error }));
        },
    });
}