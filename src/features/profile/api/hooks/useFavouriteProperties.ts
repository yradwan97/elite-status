import { propertiesApi } from "@/features/properties/api/propertiesApi";
import { useQuery } from "@tanstack/react-query";


export const useFavouriteProperties = (page: number) => {
    const { data, isFetching, isError, refetch: queryRefetch } = useQuery({
        queryKey: ['properties', 'favourites', page],
        queryFn:  () => propertiesApi.getFavouriteProperties(page),
        placeholderData: (prev) => prev, // keeps previous data visible while fetching next page
    });

    return {
        properties:  data?.data?.data || [],
        itemsCount: data?.data?.itemsCount,
        pages: data?.data?.pages || 1,
        isLoading:   isFetching,
        error:       isError ? 'Failed to load favourite properties. Please try again.' : null,
        refetch: queryRefetch,
    }
}