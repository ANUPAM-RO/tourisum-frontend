import api from '@/lib/api';
import { ApiResponse, Booking, BookingStatus, RoomPlan, Tour } from '@/types';

export interface BookingRequest {
  tourId: string;
  departureId: string;
  name: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
  message?: string;
  rooms?: RoomPlan;
}

/** Shape the admin form sends; departures/places are ids rather than populated objects. */
export type TourInput = Omit<Tour, '_id' | 'places' | 'departures' | 'nextDeparture' | 'createdAt' | 'updatedAt'> & {
  places: string[];
  departures: { _id?: string; startDate: string; seatsTotal: number }[];
};

export const tourService = {
  getAll: async (params?: { featured?: boolean; limit?: number }) => {
    const response = await api.get<ApiResponse<Tour[]>>('/tours', { params });
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<Tour>>(`/tours/${slug}`);
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get<ApiResponse<Tour[]>>('/tours/admin/all');
    return response.data;
  },

  create: async (data: TourInput) => {
    const response = await api.post<ApiResponse<Tour>>('/tours', data);
    return response.data;
  },

  update: async (id: string, data: TourInput) => {
    const response = await api.put<ApiResponse<Tour>>(`/tours/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/tours/${id}`);
    return response.data;
  },
};

export const bookingService = {
  create: async (data: BookingRequest) => {
    const response = await api.post<ApiResponse<Booking>>('/bookings', data);
    return response.data;
  },

  getAll: async (params?: { status?: BookingStatus | 'all'; search?: string }) => {
    const response = await api.get<ApiResponse<Booking[]>>('/bookings', { params });
    return response.data;
  },

  update: async (id: string, data: { status?: BookingStatus; adminNote?: string }) => {
    const response = await api.put<ApiResponse<Booking>>(`/bookings/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/bookings/${id}`);
    return response.data;
  },
};

export default tourService;
