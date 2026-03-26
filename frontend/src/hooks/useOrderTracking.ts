import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export type OrderStatus = 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface StatusEvent {
  orderId: string;
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export function useOrderTracking(orderId: string | undefined, shouldConnect: boolean = true) {
  const [statusEvents, setStatusEvents] = useState<StatusEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useAuthStore((s) => s.accessToken);

  console.log('Should connect to SSE:', shouldConnect, 'Order ID:', orderId);
  useEffect(() => {
    if (!orderId || !accessToken || !shouldConnect) return;

    const url = `/api/orders/${orderId}/events?token=${accessToken}`;
    const es = new EventSource(url, { withCredentials: true });

    es.onopen = () => {
      setIsConnected(true);
    };

    es.onmessage = (e) => {
      try {
        const event: StatusEvent = JSON.parse(e.data);
        setStatusEvents((prev) => [...prev, event]);
      } catch (err) {
        console.error('Failed to parse SSE message:', err);
      }
    };

    es.onerror = () => {
      setIsConnected(false);
      es.close();
    };

    return () => {
      es.close();
    };
  }, [orderId, accessToken, shouldConnect]);

  return { statusEvents, isConnected };
}
