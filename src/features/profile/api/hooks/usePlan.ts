import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { profileApi } from "../profileApi";

export type Plan = {
  _id: string
  icon: string
  titleAr: string
  titleEn: string
  price: number
  terms: string
  termsAr: string
  termsEn: string
  reservationDiscount: number
  insuranceDiscount: number
  extraServicesDiscount: number
  periodOfTime: number
  featuresEn: string[]
  featuresAr: string[]
  createdAt: string
  updatedAt: string
  capacity?: number
  count?: number
  activeSubscription?: number
  __v: number
}

export interface PlanResponse {
    plan: Plan
    isLoading: boolean
    error: Error | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, Error>>
}


export const usePlan = (planId: string): PlanResponse => {
    const { data, isFetching, error, refetch } = useQuery({
        queryKey: ['plan', planId],
        queryFn:  () => profileApi.getPlan(planId),
        placeholderData: (prev) => prev, // keeps previous data visible while fetching next page
    });

    return {
        plan:  data?.data || null,
        isLoading:   isFetching,
        error:       error,
        refetch,
    }
}