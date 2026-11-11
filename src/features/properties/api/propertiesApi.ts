import { ApiPaginationResponse, ApiResponse } from '@/common/api/commonApi';
import axios from '@/lib/axios';
import { Event } from '../reservation/types/types';

export type PropertyTypeKey = 'CHALET' | 'GROUP';

/** Only "ACTIVE" has been observed; the string fallback keeps other values type-safe. */
export type PropertyStatus = 'ACTIVE' | (string & {});

export type BedType = 'SINGLE' | 'DOUBLE' | 'BUNK';

export type OfferRate = 'VALUE' | 'PERCENTAGE';

/* -------------------------------------------------------------------------- */
/*                               Shared sub-types                             */
/* -------------------------------------------------------------------------- */

export interface Facility {
    _id: string;
    titleAr: string;
    titleEn: string;
    icon?: string;
}

export interface PropertyDocument {
    _id: string;
    key: string;
    path: string;
}

export interface PropertyTag {
    _id: string;
    titleAr: string;
    titleEn: string;
    __v?: number;
}

export interface PropertyEvent {
    _id: string;
    event: Event;
    price: number;
}

/** propertyType as returned by GET /properties/:id */
export interface PropertyTypeInfo<K extends PropertyTypeKey = PropertyTypeKey> {
    key: K;
    title: string;
}

/* -------------------------------------------------------------------------- */
/*                         Layout (rooms & beds per section)                  */
/* -------------------------------------------------------------------------- */

export interface Bed {
    bedType: BedType;
    count: number;
}

export interface Room {
    roomNumber: number;
    roomTypeAr: string;
    roomTypeEn: string;
    beds: Bed[];
}

/** A section of the property layout (e.g. a floor / wing). Replaces old `RoomDetail`. */
export interface LayoutSection {
    nameAr: string;
    nameEn: string;
    displayOrder: number;
    color: string;
    rooms: Room[];
    roomCount: number;
}

export interface NearbyPlace {
    nameAr: string;
    nameEn: string;
    distanceKm: number;
    icon?: string;
}

/** A single bookable chalet inside a group. Replaces old `PropertyGroupUnit`. */
export interface GroupChalet {
    _id: string;
    number: number;
    nameAr: string;
    nameEn: string;
    isDailyRentAllowed: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                  Property                                  */
/* -------------------------------------------------------------------------- */

/** Fields shared by every property, in both endpoints. `propertyType` is added per endpoint. */
export interface BasePropertyFields {
    _id: string;
    code: string;
    titleAr: string;
    titleEn: string;
    address: string;
    lat: string;
    long: string;
    images: string[];
    video: string | null;

    /** Location */
    area: string; // key from /static/area, e.g. "AL_ZOUR", "AL_KHIRAN"
    phaseNo: number;
    beachRow: number;

    /** Capacity */
    guests: number;
    bedrooms: number;
    bathrooms: number;
    lounges: number;

    descriptionAr: string; // HTML
    descriptionEn: string; // HTML
    documents: PropertyDocument[];

    /** Pricing */
    weekdaysPrice: number;
    weekendPrice: number;
    wholeWeekSundayPrice: number;
    wholeWeekThursdayPrice: number;
    dailyPrice: number;
    dayUsePrice: number;
    insurance: number;
    /** @deprecated not present in the current API response */
    wholeWeekPrice?: number;

    /** Offer */
    offerRate: OfferRate;
    offer: number | null;
    offerStartDate: string | null;
    offerEndDate: string | null;

    /** Relations */
    facilities: Facility[];
    tags: PropertyTag[];
    events: PropertyEvent[] | null;

    /** Layout / places: always present, empty arrays on a CHALET */
    layout: LayoutSection[];
    nearbyPlaces: NearbyPlace[];
    chalets: GroupChalet[];

    /** Meta */
    status: PropertyStatus;
    rate: number;
    count: number;
    isPlanEligible: boolean;
    isFavourite: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ChaletExtras {
    layout: [];
    nearbyPlaces: [];
    chalets: [];
    numberOfChalets?: never;
    numberOfFloors?: never;
}

interface GroupExtras {
    numberOfChalets: number;
    numberOfFloors: number;
}

/* ---------- GET /properties: propertyType is a string ---------- */
export type ChaletListItem = BasePropertyFields & ChaletExtras & { propertyType: 'CHALET' };
export type GroupListItem = BasePropertyFields & GroupExtras & { propertyType: 'GROUP' };
export type PropertyListItem = ChaletListItem | GroupListItem;

/* ---------- GET /properties/:id: propertyType is { key, title } ---------- */
export type ChaletDetails = BasePropertyFields & ChaletExtras & { propertyType: PropertyTypeInfo<'CHALET'> };
export type GroupDetails = BasePropertyFields & GroupExtras & { propertyType: PropertyTypeInfo<'GROUP'> };
export type PropertyDetails = ChaletDetails | GroupDetails;

/** Alias for list consumers (cards, favourites). Use `PropertyDetails` on the details page. */
export type Property = PropertyListItem;

export const isGroupListItem = (p: PropertyListItem): p is GroupListItem =>
    p.propertyType === 'GROUP';

export const isGroupDetails = (p: PropertyDetails): p is GroupDetails =>
    p.propertyType.key === 'GROUP';

/* -------------------------------------------------------------------------- */
/*                               Filters / responses                          */
/* -------------------------------------------------------------------------- */

export interface PropertiesFilters {
    guests?: number;
    bedrooms?: number;
    bathrooms?: number;
    lounges?: number;
    facilities?: string[];
    search?: string;
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    beachRow?: number;
    area?: string;
    phaseNo?: number;
    propertyType?: "SINGLE" | "GROUP";
}

export interface PropertiesResponse {
    data: {
        data: PropertyListItem[];
        itemsCount: number;
        pages: number;
    };
}

export interface PropertyResponse {
    data: PropertyDetails;
}

export interface Favourite {
    _id: string;
    item: PropertyListItem; // change to PropertyDetails if /favourites populates the details shape
    user: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface FavouritesResponse {
    data: Favourite[];
    itemsCount: number;
    pages: number;
}

export interface FacilitiesResponse {
    data: Facility[];
}

export interface CreateTourPayload {
    name: string;
    email: string;
    phone: string;
    message: string;
    property: string;
}

export type Ad = {
    _id: string;
    image: string;
    link: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
};

export type Area = {
    key: string;
    titleAr: string;
    titleEn: string;
};

export interface AdsResponse {
    data: Ad[];
}

export type PriceKey =
    | 'dayUsePrice'
    | 'dailyPrice'
    | 'weekdaysPrice'
    | 'wholeWeekSundayPrice'
    | 'wholeWeekThursdayPrice'
    | 'weekendPrice';

export type OfferFields = Pick<
    BasePropertyFields,
    'offer' | 'offerRate' | 'offerStartDate' | 'offerEndDate'
>;

export type PricedProperty = Pick<BasePropertyFields, PriceKey> & OfferFields;

const toLocalDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
};

export const propertiesApi = {
    /** GET /properties */
    getProperties: async (filters: PropertiesFilters): Promise<PropertiesResponse> => {
        const params = new URLSearchParams();

        if (filters.guests) params.append('guests', String(filters.guests));
        if (filters.bedrooms) params.append('bedrooms', String(filters.bedrooms));
        if (filters.bathrooms) params.append('bathrooms', String(filters.bathrooms));
        if (filters.lounges) params.append('lounges', String(filters.lounges));
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('size', String(filters.limit));
        if (filters.startDate) params.append('startDate', toLocalDate(filters.startDate));
        if (filters.endDate) params.append('endDate', toLocalDate(filters.endDate));
        if (filters.beachRow) params.append('beachRow', String(filters.beachRow));
        if (filters.area) params.append('area', filters.area);
        if (filters.phaseNo) params.append('phaseNo', String(filters.phaseNo));
        if (filters.propertyType) params.append('propertyType', filters.propertyType);

        filters.facilities?.forEach(id => params.append('facilities', id));

        const response = await axios.get<PropertiesResponse>(`/properties?${params.toString()}`);
        return response.data;
    },

    /** GET /properties/:id */
    getProperty: async (id: string): Promise<PropertyResponse> => {
        const response = await axios.get<PropertyResponse>(`/properties/${id}`);
        return response.data;
    },

    /** GET /properties/facilities */
    getFacilities: async (): Promise<FacilitiesResponse> => {
        const response = await axios.get<FacilitiesResponse>(`/properties/facilities`);
        return response.data;
    },

    toggleFavourite: async (propertyId: string, isFavourite: boolean): Promise<void> => {
        if (!isFavourite) {
            await axios.post(`/favourites`, { item: propertyId });
        } else {
            await axios.delete(`/favourites/${propertyId}`);
        }
    },

    createTour: async (payload: CreateTourPayload): Promise<void> => {
        await axios.post(`/tours`, payload);
    },

    getFavouriteProperties: async (page: number): Promise<ApiPaginationResponse<FavouritesResponse>> => {
        const response = await axios.get<ApiPaginationResponse<FavouritesResponse>>(
            `/favourites?page=${page}&limit=9`
        );
        return response.data;
    },

    getAds: async (): Promise<ApiResponse<Ad>> => {
        const response = await axios.get<ApiResponse<Ad>>('/ads');
        return response.data;
    },

    getAreas: async (): Promise<ApiResponse<Area>> => {
        const response = await axios.get<ApiResponse<Area>>('/static/area');
        return response.data;
    },
};