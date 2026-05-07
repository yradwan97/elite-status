import { useQuery } from "@tanstack/react-query";
import { servicesApi } from "../servicesApi";



export function useOwnerServices(page: number, searchTerm?: string, limit?: number) {

    const { data, isFetching, isError, refetch: queryRefetch } = useQuery({
        queryKey: ['owner-services', page, searchTerm],
        queryFn:  () => servicesApi.getOwnerServices(page, searchTerm, limit),
    });

    return {
        services:  data?.data.data || [],
        itemsCount: data?.data?.itemsCount,
        pages: data?.data?.pages || 1,
        isLoading:   isFetching,
        error:       isError ? 'Failed to load services. Please try again.' : null,
        refetch: queryRefetch,
    };
}