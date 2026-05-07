import { useQuery } from '@tanstack/react-query';
import { reservationApi } from '../reservationApi';

export const useDiscountedReservations = (page: number) => {
  const {
    data,
    isFetching,
    isError,
    refetch: queryRefetch,
  } = useQuery({
    queryKey: ['discounted-reservations', page],
    queryFn: () => reservationApi.getDiscountedReservations(page),
    placeholderData: (prev) => prev,
  });

  return {
    reservations:  data?.data?.data       ?? [],
    itemsCount:    data?.data?.itemsCount,
    pages:         data?.data?.pages      ?? 1,
    isLoading:     isFetching,
    error:         isError
      ? 'Failed to load reservations. Please try again.'
      : null,
    refetch: queryRefetch,
  };
};