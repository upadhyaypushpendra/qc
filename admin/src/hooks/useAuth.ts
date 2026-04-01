import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import apiClient from '../lib/apiClient';

interface LoginRequest {
  identifier: string;
}

interface VerifyOtpRequest {
  identifier: string;
  otp: string;
}

interface OtpResponse {
  message: string;
  identifier: string;
  expiresIn: number;
  otp?: string;
}

interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  identifier: string;
  role: string;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export function useLogin() {
  const { setError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.post<OtpResponse>('/auth/login', data);
      return response.data;
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to send OTP';
      setError(message);
    },
  });
}

export function useVerifyOtp() {
  const { setAuth, setError, clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: VerifyOtpRequest) => {
      setError(null);
      const response = await apiClient.post<AuthResponse>('/auth/verify-otp', {
        ...data,
        role: 'admin',
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.user.role !== 'admin') {
        clearAuth();
        setError('Access denied. Admin role required.');
        return;
      }
      setAuth(data.user, data.accessToken);
      setError(null);
      apiClient.defaults.headers.common['Authorization'] =
        `Bearer ${data.accessToken}`;
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'OTP verification failed';
      setError(message);
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      clearAuth();
      delete apiClient.defaults.headers.common['Authorization'];
    },
    onSettled: () => {
      // Always clear local auth even if logout request fails
      clearAuth();
      delete apiClient.defaults.headers.common['Authorization'];
    },
  });
}

export function useMe() {
  const { user, accessToken, setAuth } = useAuthStore();

  return useQuery({
    queryKey: ['admin', 'me'],
    queryFn: async () => {
      const response = await apiClient.get<AuthResponse>('/auth/me');
      return response.data;
    },
    enabled: !!accessToken && !user,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      setAuth(data.user, data.accessToken);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useResendOtp() {
  const { setError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { identifier: string }) => {
      const response = await apiClient.post<OtpResponse>('/otp/resend', data);
      return response.data;
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to resend OTP';
      setError(message);
    },
  });
}
