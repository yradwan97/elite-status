import { useQuery } from '@tanstack/react-query';
import { commonApi } from '../commonApi';


export function usePolicies() {

    const { data, isFetching, isError, refetch: queryRefetch } = useQuery({
        queryKey: ['policies'],
        queryFn:  () => commonApi.getPolicies(),
    });

    return {
        policies:  data?.data,
        isLoading:   isFetching,
        error:       isError ? 'Failed to load info. Please try again.' : null,
        refetch: queryRefetch,
    };
}