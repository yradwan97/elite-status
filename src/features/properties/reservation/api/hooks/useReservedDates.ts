import { useQuery } from "@tanstack/react-query";
import { reservationApi } from "../reservationApi";

interface RentedDate {
  _id: string;
  status: string;
  startDate: string;
  endDate: string;
  reservationType: string;
}

interface ReservedDatesResponse {
  propertyId: string;
  rentedDates: RentedDate[];
}

export const useReservedDates = (propertyId: string) => {
  const { data, isLoading, error } = useQuery<ReservedDatesResponse>({
    queryKey: ["reservedDates", propertyId],
    queryFn: () => reservationApi.getReservedDates(propertyId),
    enabled: !!propertyId,
    // select: (res) => res.data,
  });

  return {
    reservedDates: data?.rentedDates ?? [],
    isLoading,
    error,
  };
};