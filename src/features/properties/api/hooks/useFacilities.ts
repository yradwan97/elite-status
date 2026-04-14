import { useQuery } from '@tanstack/react-query';
import { propertiesApi, Facility } from '../propertiesApi';

interface UseFacilitiesReturn {
    facilities: Facility[];
    isLoading: boolean;
    error: string | null;
}

export function useFacilities(): UseFacilitiesReturn {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['facilities'],
        queryFn:  propertiesApi.getFacilities,
        staleTime: Infinity, // facilities rarely change — fetch once per session
    });

    return {
        facilities: data?.data ?? [],
        isLoading,
        error: isError ? 'Failed to load facilities.' : null,
    };
}