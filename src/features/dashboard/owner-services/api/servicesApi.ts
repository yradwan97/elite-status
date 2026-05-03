import { ApiResponse } from '@/common/api/commonApi';
import axios from '@/lib/axios';

export interface OwnerService {
  _id: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  icon: string
  __v: number
}

export interface OwnerServicesResponse {
    data: OwnerService[]
    itemsCount: number
    pages: number
}


export const servicesApi = {
    getOwnerServices: async (page: number, searchTerm: string | undefined = ""): Promise<ApiResponse<OwnerServicesResponse>> => {
        try {
            const response = await axios.get(`/services?page=${page}&search=${searchTerm}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching owner services:', error);
            throw error;
        }
    }
};