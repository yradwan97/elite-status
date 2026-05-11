import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '../propertiesApi';

export function useAds() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['ads'],
        queryFn:  propertiesApi.getAds,
        staleTime: 10 * 60000  //10 minutes 
    });

    return {
        ads: data?.data ?? [],
        isLoading,
        error: isError ? 'Failed to load facilities.' : null,
    };
}