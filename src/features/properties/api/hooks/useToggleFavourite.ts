import { useMutation } from "@tanstack/react-query";
import { propertiesApi } from "../propertiesApi";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/lib/query-client";

const useToggleFavourite = (propertyId: string) => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (isFavourite: boolean) => {
      return propertiesApi.toggleFavourite(propertyId, isFavourite);
    },

    onSuccess: (_data, isFavourite) => {
      queryClient.invalidateQueries({queryKey: ['favourites']})
      toast.success(
        isFavourite
          ? t("Properties.Details.Favorite.removeSuccess")
          : t("Properties.Details.Favorite.success")
      );
    },

    onError: (error) => {
      console.error("Error toggling favourite:", error);
      toast.error(t("Properties.Details.Favorite.error"));
    },
  });
};

export default useToggleFavourite;