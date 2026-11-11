import { useQuery } from '@tanstack/react-query';
import { propertiesApi, PropertyDetails } from '../propertiesApi';

interface UsePropertyReturn {
    property: PropertyDetails | undefined;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useProperty(id: string): UsePropertyReturn {
    const { data, isFetching, isError, refetch } = useQuery({
        queryKey: ['property', id],
        queryFn: () => propertiesApi.getProperty(id),
        enabled: !!id,
    });

    return {
        property: data?.data,
        isLoading: isFetching,
        error: isError ? 'Failed to load property. Please try again.' : null,
        refetch,
    };
}