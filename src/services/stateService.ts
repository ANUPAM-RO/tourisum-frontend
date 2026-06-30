import api from '@/lib/api';
import { ApiResponse, State } from '@/types';

export const stateService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get<ApiResponse<State[]>>('/states', { params });
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<State>>(`/states/${slug}`);
    return response.data;
  },

  create: async (data: Partial<State>) => {
    const response = await api.post<ApiResponse<State>>('/states', data);
    return response.data;
  },

  update: async (id: string, data: Partial<State>) => {
    const response = await api.put<ApiResponse<State>>(`/states/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/states/${id}`);
    return response.data;
  },
};

export default stateService;
