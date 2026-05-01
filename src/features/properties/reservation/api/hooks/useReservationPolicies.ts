import { useQuery } from "@tanstack/react-query";
import { reservationApi } from "../reservationApi";

interface ReservationPoliciesResponse {
  dailyCheckout: string;
  dailyCheckin: string;
  dayUseCheckin: string;
  dayUseCheckout: string;
  wholeWeekCheckin: string;
  wholeWeekCheckout: string;
  weekEndCheckin: string;
  weekEndCheckout: string;
  weekDaysCheckin: string;
  weekDaysCheckout: string;
}

interface ReservationPolicyResult {
  checkInTime?: string;
  checkOutTime?: string;
  isLoading: boolean;
  error: unknown;
}

export const useReservationPolicies = (
  planKey: string | null
): ReservationPolicyResult => {
  const { data, isLoading, error } =
    useQuery<ReservationPoliciesResponse>({
      queryKey: ["reservation-policies"],
      queryFn: () => reservationApi.getReservationPolicies(),
      enabled: !!planKey
    });

  const getPolicy = (): Pick<
    ReservationPolicyResult,
    "checkInTime" | "checkOutTime"
  > => {
    switch (planKey) {
      case "WHOLE_WEEK":
        return {
          checkInTime: data?.wholeWeekCheckin,
          checkOutTime: data?.wholeWeekCheckout,
        };

      case "WEEK_DAYS":
        return {
          checkInTime: data?.weekDaysCheckin,
          checkOutTime: data?.weekDaysCheckout,
        };

      case "WEEK_END":
        return {
          checkInTime: data?.weekEndCheckin,
          checkOutTime: data?.weekEndCheckout,
        };

      case "DAILY":
        return {
          checkInTime: data?.dailyCheckin,
          checkOutTime: data?.dailyCheckout,
        };

      case "DAY_USE":
        return {
          checkInTime: data?.dayUseCheckin,
          checkOutTime: data?.dayUseCheckout,
        };

      default:
        return {
          checkInTime: undefined,
          checkOutTime: undefined,
        };
    }
  };

  return {
    ...getPolicy(),
    isLoading,
    error,
  };
};