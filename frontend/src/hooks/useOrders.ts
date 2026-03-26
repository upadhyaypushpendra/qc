import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { useAuthStore } from '../stores/authStore';
import type { OrderStatus } from './useOrderTracking';

export interface Order {
  id: string;
  status: 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  totalAmount: number;
  addressSnapshot: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
  };
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  statusHistory: Array<{
    id: string;
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
  completed: boolean;
}

export function useOrders() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await apiClient.get('/orders');
      return response.data;
    },
    enabled: !!token,
    staleTime: 0,
  });
}

export function useOrder(orderId: string) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data as Order;
    },
    enabled: !!token && !!orderId,
    staleTime: 0,
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (data: { addressId: string }) => {
      const response = await apiClient.post('/orders', data);
      return response.data as Order;
    },
  });
}
