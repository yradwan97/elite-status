import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { CreateReservationPayload, reservationApi } from "../reservationApi";
import { ApiError } from "@/common/api/commonApi";

export default function useReservationMutation() {
    const { t } = useTranslation();
    return useMutation({
        mutationFn: (payload: CreateReservationPayload) =>
            reservationApi.createReservation(payload),

        onError: (e: unknown) => {
            const error = (e as ApiError)?.response?.data?.message ||
                (e as Error)?.message;
            toast.error(t("Properties.Reservation.confirmation.failure", { error }));
        },
    });
}