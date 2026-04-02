import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  MapPin,
  PackageCheck,
  XCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const ORDER_STATUSES = [
  'pending',
  'accepted',
  'going_for_pickup',
  'out_for_delivery',
  'reached',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderStatusColor = {
  bg: string;
  border: string;
  text: string;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, { next: string; done: string }> = {
  pending: {
    next: 'Waiting for confirmation',
    done: 'Confirmed',
  },
  accepted: {
    next: 'Finding delivery partner',
    done: 'Accepted',
  },
  going_for_pickup: {
    next: 'Going for Pickup',
    done: 'Order Picked Up',
  },
  out_for_delivery: {
    next: 'Will be out for delivery soon',
    done: 'Out for Delivery',
  },
  reached: {
    next: 'Reaching to your Doorstep',
    done: 'Reached Destination',
  },
  delivered: {
    next: 'Be ready to collect your order',
    done: 'Delivered',
  },
  cancelled: {
    next: 'Cancelled',
    done: 'Cancelled',
  },
};

export const ORDER_STATUS_ICONS: Record<OrderStatus, LucideIcon> = {
  pending: Clock,
  accepted: CheckCircle,
  going_for_pickup: Package,
  out_for_delivery: Truck,
  reached: MapPin,
  delivered: PackageCheck,
  cancelled: XCircle,
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, OrderStatusColor> = {
  pending: { bg: 'bg-gray-800', border: 'border-gray-600', text: 'text-gray-300' },
  accepted: { bg: 'bg-blue-950', border: 'border-blue-800', text: 'text-blue-300' },
  going_for_pickup: {
    bg: 'bg-yellow-950',
    border: 'border-yellow-800',
    text: 'text-yellow-300',
  },
  out_for_delivery: {
    bg: 'bg-orange-950',
    border: 'border-orange-800',
    text: 'text-orange-300',
  },
  reached: { bg: 'bg-indigo-950', border: 'border-indigo-800', text: 'text-indigo-300' },
  delivered: { bg: 'bg-green-950', border: 'border-green-800', text: 'text-green-300' },
  cancelled: { bg: 'bg-red-950', border: 'border-red-800', text: 'text-red-300' },
};

export const CUSTOMER_ACTIVE_TRACKING_STATUSES: OrderStatus[] = [
  'pending',
  'accepted',
  'going_for_pickup',
  'out_for_delivery',
  'reached',
  'delivered',
];

export const CUSTOMER_CANCELLED_TRACKING_STATUSES: OrderStatus[] = [
  'pending',
  'accepted',
  'cancelled',
];

export const COMPLETED_ORDER_FINAL_STATUSES: OrderStatus[] = [
  'delivered',
  'cancelled',
];

export const formatOrderStatus = (status: string): string => {
  const typedStatus = status as OrderStatus;
  if (ORDER_STATUS_LABELS[typedStatus]) {
    return ORDER_STATUS_LABELS[typedStatus].done;
  }

  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
