import { useQuery } from "@tanstack/react-query";
import { reservationApi } from "../reservationApi";

export interface ExtraServicesResponse {
  data: {
    data: ExtraService[]
  }
  itemsCount: number
  pages: number
}

export interface ExtraService {
  _id: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  icon: string
  price: number
  __v: number
}

interface ExtraServicesResult {
  services: ExtraService[];
  isLoading: boolean;
  error: Error | null;
  pages: number
  itemsCount: number
}

export const useExtraServices = (page: number): ExtraServicesResult => {
  const { data, isLoading, error } =
    useQuery<ExtraServicesResponse>({
      queryKey: ["extraservices", page],
      queryFn: () => reservationApi.getExtraServices(page),
    });

  return {
    services: data?.data?.data || [],
    isLoading,
    pages: data?.pages || 1,
    itemsCount: data?.itemsCount || 1,
    error: error as Error | null,
  };
};