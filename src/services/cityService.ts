import api from '@/lib/api';
import { ApiResponse, City } from '@/types';

export const cityService = {
  getAll: async (params?: { page?: number; limit?: number; state?: string; search?: string }) => {
    const response = await api.get<ApiResponse<City[]>>('/cities', { params });
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<City>>(`/cities/${slug}`);
    return response.data;
  },

  create: async (data: Partial<City>) => {
    const response = await api.post<ApiResponse<City>>('/cities', data);
    return response.data;
  },

  update: async (id: string, data: Partial<City>) => {
    const response = await api.put<ApiResponse<City>>(`/cities/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/cities/${id}`);
    return response.data;
  },
};

export default cityService;
