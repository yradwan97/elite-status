// hooks/useReservations.ts

import { useQuery } from '@tanstack/react-query';
import { reservationApi, ReservationStatus } from '../reservationApi';

export const useReservations = (status: ReservationStatus, page: number) => {
  const {
    data,
    isFetching,
    isError,
    refetch: queryRefetch,
  } = useQuery({
    queryKey: ['reservations', status, page],
    queryFn: () => reservationApi.getReservations(status, page),
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