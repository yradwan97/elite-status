import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '../propertiesApi';

export function useAreas() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['areas'],
        queryFn:  propertiesApi.getAreas,
        staleTime: 10 * 60000  //10 minutes 
    });

    return {
        areas: data?.data ?? [],
        isLoading,
        error: isError ? 'Failed to load areas.' : null,
    };
}