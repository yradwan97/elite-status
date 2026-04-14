import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi, PropertiesFilters, Property } from '../propertiesApi';

interface UsePropertiesReturn {
    // Data
    properties: Property[];
    totalPages: number;
    currentPage: number;

    // Loading / error states
    isLoading: boolean;
    error: string | null;

    // Active filters
    filters: PropertiesFilters;

    // Actions
    setFilters: (filters: Partial<PropertiesFilters>) => void;
    resetFilters: () => void;
    setPage: (page: number) => void;
    refetch: () => void;
}

const DEFAULT_FILTERS: PropertiesFilters = {
    guests:     0,
    bedrooms:   0,
    bathrooms:  0,
    lounges:    0,
    facilities: [],
    search:     '',
    page:       1,
    limit:      12,
};

export function useProperties(): UsePropertiesReturn {
    const [filters, setFiltersState] = useState<PropertiesFilters>(DEFAULT_FILTERS);

    // Strip zero/empty values before sending to the API
    const cleanFilters: PropertiesFilters = {
        ...filters,
        guests:     filters.guests     || undefined,
        bedrooms:   filters.bedrooms   || undefined,
        bathrooms:  filters.bathrooms  || undefined,
        lounges:    filters.lounges    || undefined,
        search:     filters.search     || undefined,
        facilities: filters.facilities?.length ? filters.facilities : undefined,
    };

    const { data, isFetching, isError, refetch: queryRefetch } = useQuery({
        queryKey: ['properties', cleanFilters],
        queryFn:  () => propertiesApi.getProperties(cleanFilters),
        placeholderData: (prev) => prev, // keeps previous data visible while fetching next page
    });

    const setFilters = useCallback((partial: Partial<PropertiesFilters>) => {
        setFiltersState(prev => ({
            ...prev,
            ...partial,
            // reset to page 1 on any filter change unless page is explicitly provided
            page: partial.page ?? 1,
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setFiltersState(DEFAULT_FILTERS);
    }, []);

    const setPage = useCallback((page: number) => {
        setFiltersState(prev => ({ ...prev, page }));
    }, []);

    return {
        properties:  data?.data?.data        ?? [],
        totalPages:  data?.pages  ?? 1,
        currentPage: filters.page      ?? 1,
        isLoading:   isFetching,
        error:       isError ? 'Failed to load properties. Please try again.' : null,
        filters,
        setFilters,
        resetFilters,
        setPage,
        refetch: queryRefetch,
    };
}