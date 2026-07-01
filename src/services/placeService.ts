import api from '@/lib/api';
import { ApiResponse, Place } from '@/types';

export const placeService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    state?: string;
    city?: string;
    search?: string;
    minRating?: number;
  }) => {
    const response = await api.get<ApiResponse<Place[]>>('/places', { params });
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<Place>>(`/places/${slug}`);
    return response.data;
  },

  getSimilar: async (id: string) => {
    const response = await api.get<ApiResponse<Place[]>>(`/places/similar/${id}`);
    return response.data;
  },

  addReview: async (id: string, data: { rating: number; comment: string; photos?: string[] }) => {
    const response = await api.post<ApiResponse<Place>>(`/places/${id}/reviews`, data);
    return response.data;
  },

  create: async (data: Partial<Place>) => {
    const response = await api.post<ApiResponse<Place>>('/places', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Place>) => {
    const response = await api.put<ApiResponse<Place>>(`/places/${id}`, data);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get<ApiResponse<{ name: string; count: number }[]>>('/places/categories');
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/places/${id}`);
    return response.data;
  },
};

export default placeService;
