import { useParams } from 'react-router-dom';
import OrderDetails from '../components/OrderDetails';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import { OrderTrackingSkeleton } from '../components/Skeletons';
import { useNavbarHeading } from '../hooks/useNavbarHeading';
import { useOrder } from '../hooks/useOrders';
import { useOrderTracking } from '../hooks/useOrderTracking';
import {
  COMPLETED_ORDER_FINAL_STATUSES,
  CUSTOMER_ACTIVE_TRACKING_STATUSES,
  CUSTOMER_CANCELLED_TRACKING_STATUSES,
  type OrderStatus,
} from '../constants/orderStatus';

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id || '');
  const { statusEvents } = useOrderTracking(id, order?.completed ? false : undefined);

  // Set navbar heading 
  useNavbarHeading('Order Details', order ? `Order #${order.id.slice(-8)}` : null);

  if (isLoading) return <OrderTrackingSkeleton />;
  if (!order) return <div className="text-brand-600">Order not found</div>;

  const allEvents = [...(order.statusHistory || []), ...statusEvents]
    .filter((event) => Boolean(event?.status && event?.timestamp))
    .sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      return aTime - bTime;
    });

  const latestEvent = allEvents[allEvents.length - 1];
  const currentStatus = latestEvent?.status || order.status;

  // If order is completed, only show final status
  if (order.completed) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-brand-700">Order Tracking</h1>

        <OrderStatusTimeline
          currentStatus={currentStatus}
          allEvents={allEvents}
          finalStatuses={COMPLETED_ORDER_FINAL_STATUSES}
          isCompleted={true}
        />

        {/* Order Details */}
        <OrderDetails order={order} />
      </div>
    );
  }

  // Build statuses array based on current status
  const finalStatuses2: OrderStatus[] = currentStatus === 'cancelled'
    ? CUSTOMER_CANCELLED_TRACKING_STATUSES
    : CUSTOMER_ACTIVE_TRACKING_STATUSES;

  return (
    <div className="max-w-2xl mx-auto">
      <OrderStatusTimeline
        currentStatus={currentStatus}
        allEvents={allEvents}
        finalStatuses={finalStatuses2}
        isCompleted={false}
      />

      <OrderDetails order={order} />
    </div>
  );
}
