import {
  ORDER_STATUS_ICONS,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from '../constants/orderStatus';
import type { LucideIcon } from 'lucide-react';

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

export default function OrderStatusTimeline({
  currentStatus,
  allEvents,
  finalStatuses,
  isCompleted,
}: OrderStatusTimelineProps) {
  // Completed order - show single final status
  if (isCompleted) {
    const bgColor = currentStatus === 'delivered' ? 'bg-green-950' : 'bg-red-950';
    const borderColor = currentStatus === 'delivered' ? 'border-green-800' : 'border-red-800';
    const textColor = currentStatus === 'delivered' ? 'text-green-300' : 'text-red-300';
    const labelColor = currentStatus === 'delivered' ? 'text-green-400' : 'text-red-400';
    const iconBg = currentStatus === 'delivered' ? 'bg-green-600' : 'bg-red-600';
    const latestEvent = allEvents[allEvents.length - 1];
 
    return (
      <div className={`mb-12 p-6 ${bgColor} border-2 ${borderColor} rounded-lg`}>
        <div className="flex gap-4 items-start">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${iconBg} flex-shrink-0 text-lg`}>
            {(() => { const Icon = ORDER_STATUS_ICONS[currentStatus] as LucideIcon; return <Icon className="w-5 h-5" />; })()}
          </div>
          <div className="flex-1">
            <p className={`font-bold ${textColor} text-lg mb-1`}>{ORDER_STATUS_LABELS[currentStatus].done}</p>
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
    <div className="mb-4 border-2 border-brand-200 rounded-lg p-4 bg-brand-50">
      <h1 className="text-lg font-bold mb-3 text-brand-700">Tracking Details</h1>
      <div className="relative">
        {/* Timeline background */}
        <div className="space-y-1">
          {finalStatuses.slice(0, currentStatusIndex + 2).map((status, idx, array) => {
            const isCompleted = idx <= currentStatusIndex;
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
                    {(() => { const Icon = ORDER_STATUS_ICONS[status] as LucideIcon; return <Icon className="w-5 h-5" />; })()}
                  </div>
                  {idx < array.length - 1 && (
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
                    className={`font-bold text-white mb-1 ${
                      isActive ? 'text-brand-800' : 'text-brand-700'
                    }`}
                  >
                    {isCompleted ? ORDER_STATUS_LABELS[status].done : ORDER_STATUS_LABELS[status].next}
                  </p>
                  {event && (
                    <>
                      <p className="text-sm text-white mb-1">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      {event.note && (
                        <p className="text-sm text-brand-800 italic">{event.note}</p>
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
