import { useParams } from 'react-router-dom';
import { useOrder, type Order } from '../hooks/useOrders';
import { useOrderTracking} from '../hooks/useOrderTracking';
import type { OrderStatus } from '../hooks/useOrderTracking';

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

function OrderDetails({ order }: { order: Order }) {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6">
          <h2 className="font-bold mb-4 text-brand-700">Items</h2>
          <div className="space-y-2 text-brand-700">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.productName} x{item.quantity}</span>
                <span>Rs. {(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-brand-200 mt-4 pt-4 font-bold flex justify-between text-brand-800">
            <span>Total</span>
            <span>Rs. {order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6">
          <h2 className="font-bold mb-4 text-brand-700">Delivery Address</h2>
          <p className="text-brand-700">{order.addressSnapshot.line1}</p>
          {order.addressSnapshot.line2 && <p className="text-brand-700">{order.addressSnapshot.line2}</p>}
          <p className="text-brand-700">{order.addressSnapshot.city}, {order.addressSnapshot.postcode}</p>
        </div>
      </div>
  );
}

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id || '');
  const { statusEvents } = useOrderTracking(id, order?.completed ? false : undefined);

  if (isLoading) return <div className="text-brand-600">Loading order...</div>;
  if (!order) return <div className="text-brand-600">Order not found</div>;

  const allEvents = [...(order.statusHistory || []), ...statusEvents];
  const latestEvent = allEvents[allEvents.length - 1];
  const currentStatus = latestEvent?.status || order.status;

  console.log('Order:', order.completed);
  // If order is completed, only show final status
  if (order.completed) {
    const bgColor = currentStatus === 'delivered' ? 'bg-green-50' : 'bg-red-50';
    const borderColor = currentStatus === 'delivered' ? 'border-green-200' : 'border-red-200';
    const textColor = currentStatus === 'delivered' ? 'text-green-800' : 'text-red-800';
    const labelColor = currentStatus === 'delivered' ? 'text-green-600' : 'text-red-600';
    const iconBg = currentStatus === 'delivered' ? 'bg-green-600' : 'bg-red-600';

    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-brand-700">Order Tracking</h1>

        <div className={`mb-12 p-6 ${bgColor} border-2 ${borderColor} rounded-lg`}>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${iconBg}`}>
                {statusIcons[currentStatus]}
              </div>
            </div>
            <div>
              <p className={`font-bold ${textColor} text-lg`}>{statusLabels[currentStatus]}</p>
              {latestEvent && (
                <>
                  <p className={`text-sm ${labelColor}`}>{new Date(latestEvent.timestamp).toLocaleString()}</p>
                  {latestEvent.note && <p className={`text-sm ${labelColor} mt-1`}>{latestEvent.note}</p>}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Order Details - reuse from below */}
        <OrderDetails order={order} />
      </div>
    );
  }

  // Build statuses array based on current status
  const finalStatuses: OrderStatus[] = currentStatus === 'cancelled'
    ? ['placed', 'cancelled']
    : ['placed', 'preparing', 'out_for_delivery', 'delivered'];

  const currentStatusIndex = finalStatuses.indexOf(currentStatus);
  const isFinalStatus = currentStatus === 'delivered' || currentStatus === 'cancelled';

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-brand-700">Order Tracking</h1>

      {/* Status Timeline */}
      <div className="mb-12 p-6 bg-brand-50 border-2 border-brand-200 rounded-lg">
        <div className="space-y-8">
          {finalStatuses.map((status, idx) => {
            const isCompleted = idx < currentStatusIndex;
            const isActive = idx === currentStatusIndex;
            const event = allEvents.find((e) => e.status === status);

            return (
              <div key={status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      isCompleted ? 'bg-green-600' :
                      isActive && !isFinalStatus ? 'bg-brand-600 animate-pulse' :
                      isActive && isFinalStatus ? 'bg-green-600' :
                      'bg-brand-300'
                    }`}
                  >
                    {statusIcons[status]}
                  </div>
                  {idx < finalStatuses.length - 1 && (
                    <div className={`w-1 h-12 ${isCompleted ? 'bg-green-600' : 'bg-brand-300'}`} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-brand-800">{statusLabels[status]}</p>
                  {event && (
                    <>
                      <p className="text-sm text-brand-600">{new Date(event.timestamp).toLocaleString()}</p>
                      {event.note && <p className="text-sm text-brand-600 mt-1">{event.note}</p>}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      
    </div>
  );
}
