import api from '@/lib/api';
import { ApiResponse, User } from '@/types';

export interface DashboardStats {
  places: number;
  states: number;
  cities: number;
  hotels: number;
  restaurants: number;
  users: number;
  publishedPlaces: number;
}

export const adminService = {
  getStats: async () => {
    const response = await api.get<ApiResponse<DashboardStats>>('/admin/stats');
    return response.data;
  },

  getUsers: async (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    const response = await api.get<ApiResponse<User[]>>('/admin/users', { params });
    return response.data;
  },

  updateUserRole: async (id: string, role: string) => {
    const response = await api.put<ApiResponse<User>>(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/admin/users/${id}`);
    return response.data;
  },
};

export default adminService;
