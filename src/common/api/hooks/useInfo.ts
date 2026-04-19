import { useQuery } from '@tanstack/react-query';
import { commonApi, InfoData } from '../commonApi';

interface UseInfoReturn {
    info: InfoData | undefined
    isLoading: boolean,
    error: unknown,
    refetch: () => void

}

export function useInfo(): UseInfoReturn {

    const { data, isFetching, isError, refetch: queryRefetch } = useQuery({
        queryKey: ['info'],
        queryFn:  () => commonApi.getInfo(),
    });

    return {
        info:  data?.data,
        isLoading:   isFetching,
        error:       isError ? 'Failed to load info. Please try again.' : null,
        refetch: queryRefetch,
    };
}