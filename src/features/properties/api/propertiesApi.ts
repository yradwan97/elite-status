import axios from '@/lib/axios';

export interface Facility {
    _id: string;
    titleAr: string;
    titleEn: string;
    icon?: string;
}

export interface Property {
    _id: string;
    titleAr: string;
    titleEn: string;
    address: string;
    lat: string;
    long: string;
    images: string[];
    propertyType: {key: string, title: string} | string;
    guests: number;
    bedrooms: number;
    bathrooms: number;
    lounges: number;
    descriptionAr: string;
    descriptionEn: string;
    documents: string[];
    weekdaysPrice: number;
    weekendPrice: number;
    wholeWeekPrice: number;
    dailyPrice: number;
    dayUsePrice: number;
    facilities: Facility[];   // array of facility IDs
    createdAt: string;
    updatedAt: string;
}

export interface PropertiesFilters {
    guests?: number;
    bedrooms?: number;
    bathrooms?: number;
    lounges?: number;
    facilities?: string[];
    search?: string;
    page?: number;
    limit?: number;
}

export interface PropertiesResponse {
    data: {
        data: Property[]
    }
    itemsCount: number;
    page?: number;
    pages: number;
}

export interface PropertyResponse {
    data: Property
}

export interface FacilitiesResponse {
    data: Facility[];
}

export const propertiesApi = {
    /**
     * Fetch paginated & filtered properties.
     * Maps to: GET {{url}}/properties?guests=5&bedrooms=2&bathrooms=1&lounges=2&facilities=xxx&search=بحر
     */
    getProperties: async (filters: PropertiesFilters): Promise<PropertiesResponse> => {
        const params = new URLSearchParams();

        if (filters.guests)      params.append('guests',    String(filters.guests));
        if (filters.bedrooms)    params.append('bedrooms',  String(filters.bedrooms));
        if (filters.bathrooms)   params.append('bathrooms', String(filters.bathrooms));
        if (filters.lounges)     params.append('lounges',   String(filters.lounges));
        if (filters.search)      params.append('search',    filters.search);
        if (filters.page)        params.append('page',      String(filters.page));
        if (filters.limit)       params.append('limit',     String(filters.limit));

        // facilities is multi-value: &facilities=id1&facilities=id2
        if (filters.facilities?.length) {
            filters.facilities.forEach(id => params.append('facilities', id));
        }

        const response = await axios.get<PropertiesResponse>(
            `/properties?${params.toString()}`
        );

        return response.data;
    },

    getProperty: async (id: string): Promise<PropertyResponse> => {
        const response = await axios.get<PropertyResponse>(
            `/properties/${id}`
        );

        return response.data;
    },

    /**
     * Fetch all available facilities for the filter panel.
     * Maps to: GET {{url}}/facilities
     */
    getFacilities: async (): Promise<FacilitiesResponse> => {
        const response = await axios.get<FacilitiesResponse>(`/properties/facilities`);
        return response.data;
    },
};