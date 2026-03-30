import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import apiClient from '../lib/apiClient';

interface LoginRequest {
  identifier: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
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
  otp?: string; // Only in development
}

interface AuthResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    identifier: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * Send OTP for login
 */
export function useLogin() {
  const { setError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.post<OtpResponse>('/auth/login', data);
      return response.data;
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to send OTP';
      setError(message);
    },
  });
}

/**
 * Register and send OTP
 */
export function useRegister() {
  const { setError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await apiClient.post<OtpResponse>('/auth/register', data);
      return response.data;
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Registration failed';
      setError(message);
    },
  });
}

/**
 * Verify OTP and get tokens
 */
export function useVerifyOtp() {
  const { setAuth, setError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: VerifyOtpRequest) => {
      setError(null); // Clear any previous errors before making request
      const response = await apiClient.post<AuthResponse>('/auth/verify-otp', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      setError(null); // Explicitly clear error on success
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'OTP verification failed';
      setError(message);
    },
  });
}

/**
 * Logout
 */
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
  });
}

/**
 * Fetch current user
 */
export function useMe() {
  const { user, accessToken, setAuth } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await apiClient.get<AuthResponse>('/auth/me');
      return response.data;
    },
    enabled: !!accessToken && !user,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Resend OTP
 */
export function useResendOtp() {
  const { setError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { identifier: string }) => {
      const response = await apiClient.post<OtpResponse>('/otp/resend', data);
      return response.data;
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to resend OTP';
      setError(message);
    },
  });
}
