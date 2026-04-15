import { useQuery } from '@tanstack/react-query';
import { propertiesApi, Property } from '../propertiesApi';

interface UsePropertyReturn {
    property: Property | undefined
    isLoading: boolean,
    error: unknown,
    refetch: () => void

}

export function useProperty(id: string): UsePropertyReturn {

    const { data, isFetching, isError, refetch: queryRefetch } = useQuery({
        queryKey: ['properties', id],
        queryFn:  () => propertiesApi.getProperty(id),
    });

    return {
        property:  data?.data,
        isLoading:   isFetching,
        error:       isError ? 'Failed to load properties. Please try again.' : null,
        refetch: queryRefetch,
    };
}