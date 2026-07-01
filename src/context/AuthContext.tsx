'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import authService from '@/services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  toggleFavorite: (placeId: string) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      hydrateFavorites();
    }
    setLoading(false);
  }, []);

  const hydrateFavorites = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        const favorites = (response.data as any).favorites || [];
        setUser((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, favorites };
          localStorage.setItem('user', JSON.stringify(updated));
          return updated;
        });
      }
    } catch {
      // ignore — favorites will still work once toggled
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.success && response.data) {
      const { token: newToken, ...userData } = response.data as any;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      await hydrateFavorites();
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const response = await authService.register({ name, email, password, phone });
    if (response.success && response.data) {
      const { token: newToken, ...userData } = response.data as any;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      await hydrateFavorites();
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (data: Partial<User>) => {
    const response = await authService.updateProfile(data);
    if (response.success && response.data) {
      const { token: newToken, ...userData } = response.data as any;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const toggleFavorite = async (placeId: string) => {
    const response = await authService.toggleFavorite(placeId);
    if (response.success && user) {
      setUser({ ...user, favorites: response.data as string[] });
      localStorage.setItem('user', JSON.stringify({ ...user, favorites: response.data }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        toggleFavorite,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
