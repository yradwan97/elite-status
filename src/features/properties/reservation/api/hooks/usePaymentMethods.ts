import { useQuery } from "@tanstack/react-query";
import { reservationApi } from "../reservationApi";

interface PaymentMethodsResponse {
  KNET: string;
  CBK_QR: string;
}

interface PaymentMethod {
  name: string;
  value: "1" | "2";
}

interface PaymentMethodsResult {
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  error: Error | null;
}

export const usePaymentMethods = (): PaymentMethodsResult => {
  const { data, isLoading, error } =
    useQuery<PaymentMethodsResponse>({
      queryKey: ["payment-methods"],
      queryFn: () => reservationApi.getPaymentMethods(),
    });

  const paymentMethods: PaymentMethod[] = data
    ? Object.entries(data).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  return {
    paymentMethods,
    isLoading,
    error: error as Error | null,
  };
};