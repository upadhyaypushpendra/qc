import { MapPin, Phone } from 'lucide-react';
import type { Order } from "../interfaces/orders";


export default function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {/* Items */}
      <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6">
        <h2 className="font-bold mb-4 text-brand-700 text-lg">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center pb-2 border-b border-brand-100">
              <div className="flex-1">
                <p className="text-sm font-medium text-brand-800">{item.productName}</p>
                <p className="text-xs text-brand-600">Qty: {item.quantity}</p>
              </div>
              <span className="font-medium text-brand-700">Rs. {(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-brand-200 mt-4 pt-4 font-bold flex justify-between text-brand-800">
          <span>Total</span>
          <span>Rs. {order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6">
        <h2 className="font-bold mb-4 text-brand-700 text-lg flex items-center gap-2"><MapPin className="w-4 h-4" /> Delivery Address</h2>
        <div className="space-y-2">
          <p className="font-medium text-brand-800">{order.addressSnapshot.line1}</p>
          {order.addressSnapshot.line2 && (
            <p className="text-brand-700">{order.addressSnapshot.line2}</p>
          )}
          <p className="text-brand-700">
            {order.addressSnapshot.city}, {order.addressSnapshot.postcode}
          </p>
          {order.addressSnapshot.phone && (
            <p className="text-sm text-brand-600 mt-3 flex items-center gap-1"><Phone className="w-3 h-3" /> {order.addressSnapshot.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
}
