import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import type { StatusEvent, OrderStatus } from '../hooks/useOrderTracking';

interface Order {
  id: string;
  status: OrderStatus;
  createdAt: string;
}

interface OrderStatusBadgeProps {
  orders: Order[];
  sticky?: boolean;
}

const statusLabels: Record<OrderStatus, string> = {
  placed: 'Order Placed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const statusIcons: Record<OrderStatus, string> = {
  placed: '📋',
  preparing: '👨‍🍳',
  out_for_delivery: '🚚',
  delivered: '✓',
  cancelled: '✗',
};

const statusColors: Record<OrderStatus, { bg: string; border: string; text: string }> = {
  placed: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
  preparing: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
  out_for_delivery: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800' },
  delivered: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
  cancelled: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
};

export default function OrderStatusBadge({ orders = [], sticky = true }: OrderStatusBadgeProps) {
  const navigate = useNavigate();
  const [displayIndex, setDisplayIndex] = useState(0);
  const [allStatusEvents, setAllStatusEvents] = useState<Record<string, StatusEvent[]>>({});
  const accessToken = useAuthStore((s) => s.accessToken);

  // Subscribe to ALL orders SSE at once on mount
  useEffect(() => {
    if (!orders || orders.length === 0 || !accessToken) return;

    const eventSources: Record<string, EventSource> = {};

    orders.forEach((order) => {
      const url = `/api/orders/${order.id}/events?token=${accessToken}`;
      const es = new EventSource(url, { withCredentials: true });

      es.onmessage = (e) => {
        try {
          const event: StatusEvent = JSON.parse(e.data);
          setAllStatusEvents((prev) => ({
            ...prev,
            [order.id]: [...(prev[order.id] || []), event],
          }));
        } catch (err) {
          console.error('Failed to parse SSE message:', err);
        }
      };

      es.onerror = () => {
        es.close();
      };

      eventSources[order.id] = es;
    });

    // Cleanup: close all connections
    return () => {
      Object.values(eventSources).forEach((es) => es.close());
    };
  }, [orders, accessToken]); // Only depends on orders list change and auth token

  if (!orders || orders.length === 0) return null;

  const currentOrder = orders[displayIndex];
  const currentStatusEvents = allStatusEvents[currentOrder.id] || [];

  // Get the latest status from SSE events, fallback to initial status
  const currentStatus = useMemo(() => {
    return currentStatusEvents.length > 0
      ? currentStatusEvents[currentStatusEvents.length - 1].status
      : currentOrder.status;
  }, [currentStatusEvents, currentOrder.status]);

  const colors = statusColors[currentStatus];

  const handlePrevious = () => {
    setDisplayIndex((prev) => (prev - 1 + orders.length) % orders.length);
  };

  const handleNext = () => {
    setDisplayIndex((prev) => (prev + 1) % orders.length);
  };

  return (
    <div
      className={`${sticky ? 'sticky top-auto bottom-6' : 'fixed bottom-6'
        } right-6 ${colors.bg} border-2 ${colors.border} rounded-lg p-3 shadow-lg max-w-sm z-40`}
    >
      <div className="flex items-center gap-3 cursor-pointer hover:opacity-80" onClick={() => navigate(`/orders/${currentOrder.id}`)}>
        {orders.length > 1 && (
          <span className={`text-xs font-bold ${colors.text}`}>{displayIndex + 1}/{orders.length}</span>
        )}
        <div className="text-2xl flex-shrink-0">{statusIcons[currentStatus]}</div>
        <div className="flex-1">
          <p className={`font-bold ${colors.text} text-sm`}>{statusLabels[currentStatus]}</p>
          <p className="text-xs text-gray-600 mt-1">Order #{currentOrder.id.slice(-8)}</p>
        </div>
        <button
          className={`w-8 h-8 p-1 ${colors.text} font-medium text-xs border border-current rounded-full hover:opacity-80 transition`}
        >
          →
        </button>
      </div>

      {/* Manual Navigation and Indicators */}
      {orders.length > 1 && (
        <div className="flex items-center justify-between gap-2 mt-2">
          <button
            onClick={handlePrevious}
            className={`p-1 ${colors.text} hover:opacity-60 transition`}
          >
            ←
          </button>
          <div className="flex gap-1 flex-1 justify-center">
            {orders.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setDisplayIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === displayIndex ? `${colors.border.replace('border-', 'bg-')} w-6` : 'bg-brand-300 w-2'
                  }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className={`p-1 ${colors.text} hover:opacity-60 transition`}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
