import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import apiClient from '../lib/apiClient';

interface OrderRequestsResponse {
  type: string;
  data?: any;
  message?: string;
  count?: number;
  requests?: any[];
  timestamp?: string;
}

/**
 * Listen to order requests via SSE
 */
export const useOrderRequests = () => {
  const { setPendingOrders } = useOrderStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    // EventSource doesn't support headers, so we pass token as query param
    const eventSource = new EventSource(
      `/api/order-requests/listen?token=${accessToken}`,
    );

    eventSource.onmessage = (event) => {
      try {
        const message: OrderRequestsResponse = JSON.parse(event.data);

        if (message.type === 'connected') {
          console.log('✓ Connected to order request stream');
        } else if (message.type === 'order_request' && message.data) {
          setPendingOrders(message.data);
        } else if (message.type === 'error') {
          console.error('Order stream error:', message.message);
        }
      } catch (error) {
        console.error('Failed to parse order message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Order request stream error:', error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [setPendingOrders, accessToken]);
};

/**
 * Get pending order requests
 */
export const usePendingOrderRequests = () => {
  return useQuery({
    queryKey: ['orders', 'pending'],
    queryFn: async () => {
      const response = await apiClient.get('/order-requests/pending');
      return response.data;
    },
    refetchInterval: 10 * 1000, // Refetch every 10 seconds as fallback
  });
};

/**
 * Accept order request
 */
export const useAcceptOrder = () => {
  const { acceptOrder } = useOrderStore();

  return useMutation({
    mutationFn: async (orderRequestId: string) => {
      const response = await apiClient.post(
        `/order-requests/${orderRequestId}/accept`,
      );
      return response.data;
    },
    onSuccess: (_data, orderRequestId) => {
      acceptOrder(orderRequestId);
    },
  });
};

/**
 * Decline order request
 */
export const useDeclineOrder = () => {
  const { removePendingOrder } = useOrderStore();

  return useMutation({
    mutationFn: async (orderRequestId: string) => {
      const response = await apiClient.post(
        `/order-requests/${orderRequestId}/decline`,
      );
      return response.data;
    },
    onSuccess: (_data, orderRequestId) => {
      removePendingOrder(orderRequestId);
    },
  });
};
