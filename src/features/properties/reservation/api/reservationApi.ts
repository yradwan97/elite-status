import api from "@/lib/axios"

export interface CreateReservationPayload {
    property: string
    startDate: string
    reservationType: string
    deposit: boolean
    paymentMethod: "1" | "2"
    services: string[]
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
        const response = await api.post('/reservations', {...reservation})
        return response.data;
    },

    getExtraServices: async (page: number) => {
        const response = await api.get(`/extra-services?page=${page}&limit=6`)
        return response.data
    }
}