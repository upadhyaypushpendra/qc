import type { OrderStatus } from '../hooks/useOrderTracking';

interface StatusEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  allEvents: StatusEvent[];
  finalStatuses: OrderStatus[];
  isCompleted: boolean;
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

export default function OrderStatusTimeline({
  currentStatus,
  allEvents,
  finalStatuses,
  isCompleted,
}: OrderStatusTimelineProps) {
  // Completed order - show single final status
  if (isCompleted) {
    const bgColor = currentStatus === 'delivered' ? 'bg-green-50' : 'bg-red-50';
    const borderColor = currentStatus === 'delivered' ? 'border-green-200' : 'border-red-200';
    const textColor = currentStatus === 'delivered' ? 'text-green-800' : 'text-red-800';
    const labelColor = currentStatus === 'delivered' ? 'text-green-600' : 'text-red-600';
    const iconBg = currentStatus === 'delivered' ? 'bg-green-600' : 'bg-red-600';
    const latestEvent = allEvents[allEvents.length - 1];
 
    return (
      <div className={`mb-12 p-6 ${bgColor} border-2 ${borderColor} rounded-lg`}>
        <div className="flex gap-4 items-start">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${iconBg} flex-shrink-0 text-lg`}>
            {statusIcons[currentStatus]}
          </div>
          <div className="flex-1">
            <p className={`font-bold ${textColor} text-lg mb-1`}>{statusLabels[currentStatus]}</p>
            {latestEvent && (
              <>
                <p className={`text-sm ${labelColor} mb-2`}>
                  {new Date(latestEvent.timestamp).toLocaleString()}
                </p>
                {latestEvent.note && (
                  <p className={`text-sm ${labelColor}`}>{latestEvent.note}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active order - show timeline
  const currentStatusIndex = finalStatuses.indexOf(currentStatus);
  const isFinalStatus = finalStatuses.includes(currentStatus);

  return (
    <div className="mb-1 border-2 border-brand-200 rounded-lg p-4 bg-brand-50">
      <h1 className="text-lg font-bold mb-3 text-brand-700">Tracking Details</h1>
      <div className="relative">
        {/* Timeline background */}
        <div className="space-y-1">
          {finalStatuses.map((status, idx) => {
            const isCompleted = idx < currentStatusIndex;
            const isActive = idx === currentStatusIndex;
            const event = allEvents.find((e) => e.status === status);

            return (
              <div key={status} className="flex gap-4">
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-md transition ${
                      isCompleted
                        ? 'bg-green-600'
                        : isActive && !isFinalStatus
                          ? 'bg-brand-600 animate-pulse shadow-lg'
                          : isActive && isFinalStatus
                            ? 'bg-green-600'
                            : 'bg-brand-200'
                    }`}
                  >
                    {statusIcons[status]}
                  </div>
                  {idx < finalStatuses.length - 1 && (
                    <div
                      className={`w-1.5 h-12 mt-2 transition ${
                        isCompleted ? 'bg-green-600' : 'bg-brand-300'
                      }`}
                    />
                  )}
                </div>

                {/* Status details */}
                <div className="pt-1 pb-6">
                  <p
                    className={`font-bold text-base mb-1 ${
                      isActive ? 'text-brand-800' : 'text-brand-700'
                    }`}
                  >
                    {statusLabels[status]}
                  </p>
                  {event && (
                    <>
                      <p className="text-sm text-brand-600 mb-1">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      {event.note && (
                        <p className="text-sm text-brand-500 italic">{event.note}</p>
                      )}
                    </>
                  )}
                  {!event && isActive && (
                    <p className="text-sm text-brand-500 italic">In progress...</p>
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
