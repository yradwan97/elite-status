import { useMutation } from "@tanstack/react-query";
import { propertiesApi, CreateTourPayload } from "../propertiesApi";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function useTourMutation() {
    const {t} = useTranslation();
    return useMutation({
        mutationFn: (payload: CreateTourPayload) =>
            propertiesApi.createTour(payload),

        onSuccess: () => {
            toast.success(t("Properties.Details.tour.success"));
        },

        onError: () => {
            toast.error(t("Properties.Details.tour.error"));
        },
    });
}