import api from '@/lib/api';
import { ApiResponse, Hotel, Restaurant } from '@/types';

export const hotelService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
    search?: string;
  }) => {
    const response = await api.get<ApiResponse<Hotel[]>>('/hotels', { params });
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<Hotel>>(`/hotels/${slug}`);
    return response.data;
  },

  create: async (data: Partial<Hotel>) => {
    const response = await api.post<ApiResponse<Hotel>>('/hotels', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Hotel>) => {
    const response = await api.put<ApiResponse<Hotel>>(`/hotels/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/hotels/${id}`);
    return response.data;
  },
};

export const restaurantService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    city?: string;
    cuisine?: string[];
    vegNonVeg?: string;
    search?: string;
  }) => {
    const response = await api.get<ApiResponse<Restaurant[]>>('/restaurants', { params });
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<Restaurant>>(`/restaurants/${slug}`);
    return response.data;
  },

  create: async (data: Partial<Restaurant>) => {
    const response = await api.post<ApiResponse<Restaurant>>('/restaurants', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Restaurant>) => {
    const response = await api.put<ApiResponse<Restaurant>>(`/restaurants/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/restaurants/${id}`);
    return response.data;
  },
};

export default { hotelService, restaurantService };
