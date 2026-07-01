'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import placeService from '@/services/placeService';
import stateService from '@/services/stateService';
import cityService from '@/services/cityService';
import { hotelService, restaurantService } from '@/services/hotelRestaurantService';
import { Place, State, City, Hotel, Restaurant } from '@/types';

export const usePlaces = (params?: { page?: number; limit?: number; category?: string; state?: string; city?: string; search?: string; minRating?: number }) => {
  return useQuery({
    queryKey: ['places', params],
    queryFn: () => placeService.getAll(params),
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
