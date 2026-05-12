import { ApiPaginationResponse, ApiResponse } from "@/common/api/commonApi"
import api from "@/lib/axios"

export interface CreateReservationPayload {
    property: string
    startDate: string
    reservationType: string
    deposit: boolean
    paymentMethod: "1" | "2"
    services: string[]
    usePlan: boolean
}

export interface CancelReservationPayload {
    reservation: string
    reason: string
}

export interface RequestExtraServicesPayload {
    reservation: string
    services: string[]
}

export type ReservationStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELED';
export type ReservationType = 'WHOLE_WEEK' | 'WEEKDAYS' | 'WEEKENDS' | 'DAILY' | "DAY_USE";

export interface ReservationService {
    _id: string;
    name: string;
    price: number;
}

export interface ReservationProperty {
    _id: string;
    titleAr: string;
    titleEn: string;
    address: string;
    images: string[];
    status: string;
}

export interface ReservationUser {
    _id: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    image: string;
}

export interface Reservation {
    _id: string;
    trackId: string;
    transaction: string;
    user: ReservationUser;
    amount: number;
    discount?: number
    services: ReservationService[];
    insurance: number;
    status: ReservationStatus;
    property: ReservationProperty;
    startDate: string;
    endDate: string;
    reservationType: ReservationType;
    reservationPrice: number;
    deposit: boolean;
    invoice?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReservationsResponse {
    data: Reservation[];
    itemsCount: number;
    pages: number;
}

export type ReservationTypeInfo = {
    _id: string
    type: ReservationType
    infoAr: string
    infoEn: string
    checkin: string
    checkout: string
}

export const reservationApi = {
    getReservedDates: async (propertyId: string) => {
        const response = await api.get(`/reservations/${propertyId}/rented-dates`)
        console.log(response.data)
        return response.data?.data
    },

    getReservationPolicies: async () => {
        const response = await api.get(`/reservation-polices`)
        console.log(response.data)
        return response.data?.data
    },

    getPaymentMethods: async () => {
        const response = await api.get('/static/payments-methods')
        return response.data?.data
    },

    createReservation: async (reservation: CreateReservationPayload) => {
        const response = await api.post('/reservations', { ...reservation })
        return response.data;
    },

    getExtraServices: async (page: number) => {
        const response = await api.get(`/extra-services?page=${page}&limit=6`)
        return response.data
    },

    getDiscountedReservations: async (
        page: number
    ): Promise<ApiPaginationResponse<ReservationsResponse>> => {
        const response = await api.get<ApiPaginationResponse<ReservationsResponse>>(
            `/reservations?page=${page}&discounted=true&size=6`,
        );
        return response.data;
    },

    getReservations: async (
        status: ReservationStatus,
        page: number,
    ): Promise<ApiPaginationResponse<ReservationsResponse>> => {
        const response = await api.get<ApiPaginationResponse<ReservationsResponse>>(
            `/reservations?status=${status}&page=${page}`,
        );
        return response.data;
    },

    requestReservationCancelation: async (cancelPayload: CancelReservationPayload) => {
        const response = await api.post("/requests/cancellations", { ...cancelPayload })
        return response.data;
    },

    requestExtraServices: async (payload: RequestExtraServicesPayload) => {
        const response = await api.post("/extra-services/requests", { ...payload })
        return response.data
    },

    getReservationTypesInfo: async () => {
        const response = await api.get<ApiResponse<ReservationTypeInfo>>("/reservation-types")
        return response.data
    }
}