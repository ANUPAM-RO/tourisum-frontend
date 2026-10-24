import api from '@/lib/api';
import { ApiResponse, SiteSettings } from '@/types';

export const settingsService = {
  get: async () => {
    const response = await api.get<ApiResponse<SiteSettings>>('/settings');
    return response.data;
  },

  update: async (data: Partial<SiteSettings>) => {
    const response = await api.put<ApiResponse<SiteSettings>>('/settings', data);
    return response.data;
  },
};

export default settingsService;
