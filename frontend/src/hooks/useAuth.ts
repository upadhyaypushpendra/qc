import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import apiClient from '../lib/apiClient';
import toast from 'react-hot-toast';

export function useLogin() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiClient.post('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(
        { id: '', email: '', role: '' },
        data.accessToken,
      );
      toast.success('Login successful!');
    },
    onError: (error: any) => {
      console.log('Login error:', error);
      toast.error(error?.response?.data?.message || 'Login failed. Please try again.');
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(
        { id: '', email: '', role: '' },
        data.accessToken,
      );
      toast.success('Account created! Logging you in...');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Registration failed. Please try again.');
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      useAuthStore.getState().clearAuth();
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/me');
      return response.data;
    },
    enabled: !!useAuthStore.getState().accessToken,
  });
}
