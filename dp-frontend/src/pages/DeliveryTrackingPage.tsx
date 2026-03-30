import { useParams } from 'react-router-dom';
import OrderDetails from '../components/OrderDetails';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import { useNavbarHeading } from '../hooks/useNavbarHeading';
import { useOrder } from '../hooks/useOrders';
import type { OrderStatus } from '../hooks/useOrderTracking';
import { useOrderTracking } from '../hooks/useOrderTracking';

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id || '');
  const { statusEvents } = useOrderTracking(id, order?.completed ? false : undefined);
  
    // Set navbar heading 
    useNavbarHeading('Order Details');

  if (isLoading) return <div className="text-brand-600">Loading order...</div>;
  if (!order) return <div className="text-brand-600">Order not found</div>;

  const allEvents = [...(order.statusHistory || []), ...statusEvents];
  const latestEvent = allEvents[allEvents.length - 1];
  const currentStatus = latestEvent?.status || order.status;
  
  console.log('Order:', order.completed);
  // If order is completed, only show final status
  if (order.completed) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-brand-700">Order Tracking</h1>

        <OrderStatusTimeline
          currentStatus={currentStatus}
          allEvents={allEvents}
          finalStatuses={['delivered', 'cancelled']}
          isCompleted={true}
        />

        {/* Order Details */}
        <OrderDetails order={order} />
      </div>
    );
  }

  // Build statuses array based on current status
  const finalStatuses2: OrderStatus[] = currentStatus === 'cancelled'
    ? ['placed', 'cancelled']
    : ['placed', 'preparing', 'out_for_delivery', 'delivered'];

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
