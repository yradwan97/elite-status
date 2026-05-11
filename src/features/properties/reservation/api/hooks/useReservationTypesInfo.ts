import { useQuery } from "@tanstack/react-query";
import { reservationApi } from "../reservationApi";

export const useReservationTypesInfo = () => {
  const { data, isLoading, error } =
    useQuery({
      queryKey: ["reservationTypesInfo"],
      queryFn: () => reservationApi.getReservationTypesInfo(),
    });

  return {
    typesInfo: data?.data || [],
    isLoading,
    error: error as Error | null,
  };
};