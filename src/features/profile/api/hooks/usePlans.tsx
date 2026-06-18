import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { profileApi } from "../profileApi";
import { Plan } from "./usePlan";

export interface PlansResponse {
    plans: Plan[]
    isLoading: boolean
    error: Error | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, Error>>
}


export const usePlans = (): PlansResponse => {
    const { data, isFetching, error, refetch } = useQuery({
        queryKey: ['plans'],
        queryFn:  () => profileApi.getPlans(),
        placeholderData: (prev) => prev, // keeps previous data visible while fetching next page
    });

    return {
        plans:  data?.data.sort((a, b) => a.price - b.price) || [],
        isLoading:   isFetching,
        error:       error,
        refetch,
    }
}