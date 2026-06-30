import api from '@/lib/api';
import { ApiResponse, User } from '@/types';

export const authService = {
  register: async (data: { name: string; email: string; password: string; phone?: string }) => {
    const response = await api.post<ApiResponse<User>>('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post<ApiResponse<User>>('/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data);
    return response.data;
  },

  toggleFavorite: async (placeId: string) => {
    const response = await api.post<ApiResponse<string[]>>('/auth/favorites/toggle', { placeId });
    return response.data;
  },

  getFavorites: async () => {
    const response = await api.get<ApiResponse<any[]>>('/auth/favorites');
    return response.data;
  },
};

export default authService;
