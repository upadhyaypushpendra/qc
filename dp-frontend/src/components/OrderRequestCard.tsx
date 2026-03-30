import { useMemo } from 'react';
import { useAcceptOrder, useDeclineOrder } from '../hooks/useOrderRequests';
import toast from 'react-hot-toast';

interface OrderRequestCardProps {
  id: string;
  orderId: string;
  deliveryFee: number;
  expiresAt: Date | string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
}

export default function OrderRequestCard({
  id,
  orderId,
  deliveryFee,
  expiresAt,
  pickupLatitude,
  pickupLongitude,
  deliveryLatitude,
  deliveryLongitude,
}: OrderRequestCardProps) {
  const acceptOrder = useAcceptOrder();
  const declineOrder = useDeclineOrder();

  const timeRemaining = useMemo(() => {
    const expiryTime = new Date(expiresAt).getTime();
    const now = Date.now();
    const seconds = Math.floor((expiryTime - now) / 1000);

    if (seconds <= 0) return 'Expired';
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m`;
  }, [expiresAt]);

  const handleAccept = async () => {
    try {
      await acceptOrder.mutateAsync(id);
      toast.success('Order accepted! ✓');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to accept order');
    }
  };

  const handleDecline = async () => {
    try {
      await declineOrder.mutateAsync(id);
      toast.error('Order declined');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to decline order');
    }
  };

  const isExpired = timeRemaining === 'Expired';

  return (
    <div
      className={`border-2 rounded-lg p-4 transition ${
        isExpired
          ? 'border-red-300 bg-red-50'
          : 'border-brand-300 bg-gradient-to-r from-brand-50 to-blue-50'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-brand-700">Order #{orderId.slice(0, 8)}</p>
          <p className="text-xs text-brand-600 font-mono">{id.slice(0, 12)}...</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
            ₹{deliveryFee.toFixed(2)}
          </p>
          <p className={`text-xs font-semibold ${isExpired ? 'text-red-600' : 'text-blue-600'}`}>
            {timeRemaining}
          </p>
        </div>
      </div>

      {/* Location Info */}
      {(pickupLatitude || deliveryLatitude) && (
        <div className="mb-3 p-2 bg-white rounded border border-brand-200">
          <div className="text-xs space-y-1">
            {pickupLatitude && (
              <p>
                <span className="font-semibold">📍 Pickup:</span>{' '}
                {pickupLatitude.toFixed(4)}, {pickupLongitude?.toFixed(4)}
              </p>
            )}
            {deliveryLatitude && (
              <p>
                <span className="font-semibold">🚚 Delivery:</span>{' '}
                {deliveryLatitude.toFixed(4)}, {deliveryLongitude?.toFixed(4)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          disabled={isExpired || acceptOrder.isPending}
          className="flex-1 bg-green-500 text-white py-2 rounded font-bold text-sm hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {acceptOrder.isPending ? '⏳ Accepting...' : '✓ Accept'}
        </button>
        <button
          onClick={handleDecline}
          disabled={isExpired || declineOrder.isPending}
          className="flex-1 bg-red-500 text-white py-2 rounded font-bold text-sm hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {declineOrder.isPending ? '⏳ Declining...' : '✕ Decline'}
        </button>
      </div>

      {isExpired && (
        <p className="text-center text-xs text-red-600 font-semibold mt-2">This offer has expired</p>
      )}
    </div>
  );
}
