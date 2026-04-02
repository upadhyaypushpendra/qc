import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import apiClient from '../lib/apiClient';
import { subscribeToPush, unsubscribeFromPush } from '../lib/pushNotifications';

interface LoginRequest {
  identifier: string;
}

interface RegisterRequest {
  identifier: string;
  role: 'user';
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
      const response = await apiClient.post<OtpResponse>('/auth/login', {
        ...data,
        role: 'user',
      });
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
    mutationFn: async (data: Omit<RegisterRequest, 'role'>) => {
      const response = await apiClient.post<OtpResponse>('/auth/register', {
        ...data,
        role: 'user',
      });
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
      const response = await apiClient.post<AuthResponse>('/auth/verify-otp', {
        ...data,
        role: 'user',
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.user.role !== 'user') {
        setError('This app is for customers only. Please use the correct app.');
        return;
      }
      setAuth(data.user, data.accessToken);
      setError(null); // Explicitly clear error on success
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      // Ask for push permission if not already granted
      if (Notification.permission !== 'granted') {
        subscribeToPush().catch(() => undefined);
      }
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
      await unsubscribeFromPush().catch(() => undefined);
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
  const { user, accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await apiClient.get<AuthResponse>('/auth/me');
      return response.data;
    },
    enabled: !!accessToken && !user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Update profile (firstName, lastName)
 */
export function useUpdateProfile() {
  const { user, setAuth } = useAuthStore();
  const accessToken = useAuthStore((s) => s.accessToken);

  return useMutation({
    mutationFn: async (data: { firstName: string; lastName: string }) => {
      const response = await apiClient.patch('/users/profile', data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      if (user && accessToken) {
        setAuth({ ...user, ...updatedUser }, accessToken);
      }
    },
  });
}
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
