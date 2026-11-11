import { useQuery } from "@tanstack/react-query";
import { reservationApi } from "../reservationApi";

interface RentedDate {
  type: string            // e.g. "RESERVATION"
  chalet: string
  startDate: string
  endDate: string
  reservationType: string // WEEK_DAYS | WEEK_END | WHOLE_WEEK_SUNDAY | WHOLE_WEEK_THURSDAY | DAILY
  status: string          // e.g. "ACTIVE"
}

interface ChaletRentedDates {
  chaletId: string;
  number: number;
  nameAr: string;
  nameEn: string;
  isDailyRentAllowed: boolean;
  rentedDates: RentedDate[];
}

interface GroupReservedDatesResponse {
  propertyId: string;
  propertyType: string;
  type: string;
  chalets: ChaletRentedDates[];
}

export const useGroupReservedDates = (propertyId: string) => {
  const { data, isLoading, error } = useQuery<GroupReservedDatesResponse>({
    queryKey: ["groupReservedDates", propertyId],
    queryFn: () => reservationApi.getGroupReservedDates(propertyId),
    enabled: !!propertyId,
    staleTime: 10000,
  });

  return {
    chalets: data?.chalets ?? [],
    propertyType: data?.propertyType,
    isLoading,
    error,
  };
};