import { useOrders } from '../hooks/useOrders';
import { Link } from 'react-router-dom';
import { OrderListSkeleton } from '../components/Skeletons';
import {
  ORDER_STATUS_COLORS,
  formatOrderStatus,
  type OrderStatus,
} from '../constants/orderStatus';

export default function OrderHistoryPage() {
  const { data: orders, isLoading } = useOrders();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-brand-700">My Orders</h1>

      {isLoading ? (
        <OrderListSkeleton count={4} />
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const status = order.status as OrderStatus;
            const colors = ORDER_STATUS_COLORS[status];

            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-brand-50 border-2 border-brand-200 rounded-lg p-6 hover:shadow-lg hover:border-brand-400 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-brand-600">Order #{order.id.slice(0, 8)}</p>
                    <p className="font-bold text-lg text-brand-800">Rs. {Number(order.totalAmount).toFixed(2)}</p>
                    <p className="text-sm text-brand-600 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-bold ${colors.bg} ${colors.text}`}>
                    {formatOrderStatus(order.status)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-brand-600">No orders yet</p>
      )}
    </div>
  );
}
