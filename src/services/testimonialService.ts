import api from '@/lib/api';
import { ApiResponse, Testimonial } from '@/types';

export type TestimonialInput = Omit<Testimonial, '_id' | 'createdAt' | 'updatedAt'>;

export const testimonialService = {
  getAll: async (params?: { limit?: number }) => {
    const response = await api.get<ApiResponse<Testimonial[]>>('/testimonials', { params });
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get<ApiResponse<Testimonial[]>>('/testimonials/admin/all');
    return response.data;
  },

  create: async (data: TestimonialInput) => {
    const response = await api.post<ApiResponse<Testimonial>>('/testimonials', data);
    return response.data;
  },

  update: async (id: string, data: TestimonialInput) => {
    const response = await api.put<ApiResponse<Testimonial>>(`/testimonials/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/testimonials/${id}`);
    return response.data;
  },
};

export default testimonialService;
