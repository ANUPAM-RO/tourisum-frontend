'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import placeService from '@/services/placeService';
import stateService from '@/services/stateService';
import cityService from '@/services/cityService';
import authService from '@/services/authService';
import settingsService from '@/services/settingsService';
import tourService from '@/services/tourService';
import testimonialService from '@/services/testimonialService';
import { agencyFrom, withDefaults } from '@/lib/siteSettings';
import { hotelService, restaurantService } from '@/services/hotelRestaurantService';
import { Place, State, City, Hotel, Restaurant } from '@/types';
import { useAuth } from '@/context/AuthContext';

export const usePlaces = (params?: { page?: number; limit?: number; category?: string; state?: string; city?: string; search?: string; minRating?: number }) => {
  return useQuery({
    queryKey: ['places', params],
    queryFn: () => placeService.getAll(params),
    placeholderData: (prev) => prev,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => placeService.getCategories(),
  });
};

export const usePlaceBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['place', slug],
    queryFn: () => placeService.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useStates = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ['states', params],
    queryFn: () => stateService.getAll(params),
  });
};

export const useStateBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['state', slug],
    queryFn: () => stateService.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useCities = (params?: { page?: number; limit?: number; state?: string; search?: string }) => {
  return useQuery({
    queryKey: ['cities', params],
    queryFn: () => cityService.getAll(params),
  });
};

export const useCityBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['city', slug],
    queryFn: () => cityService.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useHotels = (params?: { page?: number; limit?: number; city?: string; minPrice?: number; maxPrice?: number; amenities?: string[]; search?: string }) => {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: () => hotelService.getAll(params),
  });
};

export const useHotelBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['hotel', slug],
    queryFn: () => hotelService.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useRestaurants = (params?: { page?: number; limit?: number; city?: string; cuisine?: string[]; vegNonVeg?: string; search?: string }) => {
  return useQuery({
    queryKey: ['restaurants', params],
    queryFn: () => restaurantService.getAll(params),
  });
};

export const useRestaurantBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['restaurant', slug],
    queryFn: () => restaurantService.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useFavorites = (enabled: boolean) => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => authService.getFavorites(),
    enabled,
  });
};

export const useToggleFavorite = () => {
  const { isAuthenticated, user, toggleFavorite } = useAuth();
  const queryClient = useQueryClient();

  const isFavorite = (placeId?: string) => !!placeId && !!user?.favorites?.includes(placeId);

  const toggle = async (placeId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }
    const wasFavorite = isFavorite(placeId);
    try {
      await toggleFavorite(placeId);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(wasFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return { isFavorite, toggle };
};

export const useSiteSettings = () => {
  const query = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => (await settingsService.get()).data,
    staleTime: 5 * 60 * 1000,
  });
  return { ...query, settings: withDefaults(query.data) };
};

export const useAgency = () => {
  const { settings } = useSiteSettings();
  return agencyFrom(settings);
};

export const useMapPlaces = () => {
  return useQuery({
    queryKey: ['map-places'],
    queryFn: async () => (await placeService.getMapPlaces()).data,
    staleTime: 10 * 60 * 1000,
  });
};

export const useTours = (params?: { featured?: boolean; limit?: number }) => {
  return useQuery({
    queryKey: ['tours', params],
    queryFn: async () => (await tourService.getAll(params)).data,
  });
};

export const useTour = (slug: string) => {
  return useQuery({
    queryKey: ['tour', slug],
    queryFn: async () => (await tourService.getBySlug(slug)).data,
    enabled: !!slug,
  });
};

export const useTestimonials = (limit = 8) => {
  return useQuery({
    queryKey: ['testimonials', limit],
    queryFn: async () => (await testimonialService.getAll({ limit })).data,
    staleTime: 5 * 60 * 1000,
  });
};
