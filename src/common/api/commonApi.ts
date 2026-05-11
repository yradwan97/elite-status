import api from "@/lib/axios"

export interface ApiResponse<T> {
    status: string
    message: string
    data: T[]
}

export interface ApiPaginationResponse<T> {
    status: string
    message: string
    data: T
}

export interface ApiError {
    response: {
        data: {
            message?: string
        }
    }
}

export interface InfoData {
    socialMedia: SocialMedia
    _id: string
    whatsappContact: string
    whatsappTours: string
    ownerServices: string
    email: string
    contact: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface InfoResponse {
    data: InfoData
}

export interface SocialMedia {
    whatsapp: string
    facebook: string
    tiktok: string
    instagram: string
    snapchat: string
}

export interface PoliciesData {
  _id: string
  refundPolicy: RefundPolicy
  privacyPolicy: PrivacyPolicy
  termsAndConditions: TermsAndConditions
  createdAt: string
  updatedAt: string
  __v: number
}

export interface PoliciesResponse {
    data: PoliciesData
}

export interface RefundPolicy {
  en: string
  ar: string
  _id: string
}

export interface PrivacyPolicy {
  en: string
  ar: string
  _id: string
}

export interface TermsAndConditions {
  en: string
  ar: string
  _id: string
}



export const commonApi = {
    getInfo: async (): Promise<InfoResponse> => {
        const response = await api.get<InfoResponse>('/info')
        return response.data
    },

    getPolicies: async (): Promise<PoliciesResponse> => {
        const response = await api.get<PoliciesResponse>('/policies')
        return response.data
    }
}