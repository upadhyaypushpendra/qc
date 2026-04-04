import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { useCreateOrder } from '../hooks/useOrders';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';
import { Phone, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const createOrder = useCreateOrder();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await apiClient.get('/users/addresses');
      return response.data;
    },
  });

  const handleCheckout = async (addressId: string) => {
    try {
      const order = await createOrder.mutateAsync({ addressId });
      clearCart();
      toast.success('Order created successfully!');
      navigate(`/orders/${order.id}`);
    } catch (err) {
      toast.error('Failed to place order');
    }
  };

  const handlePay = () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }
    handleCheckout(selectedAddressId);
  };

  const handleAddressSelect = useCallback((addressId: string) => {
    setSelectedAddressId(addressId);
  }, [setSelectedAddressId]);

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((addr: any) => addr.isDefault) || addresses[0];

      handleAddressSelect(defaultAddress.id);
    }
  }, [addresses, selectedAddressId, handleAddressSelect]);

  if (items.length === 0) {
    return <div className="text-center py-12 text-brand-600 text-lg">Cart is empty</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-6 text-brand-700">Checkout</h1>

        <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-brand-700">Delivery Address</h2>
          {addresses && addresses.length > 0 ? (
            <div className="space-y-3">
              {addresses.map((addr: any) => (
                <button
                  key={addr.id}
                  onClick={() => handleAddressSelect(addr.id)}
                  className={`w-full text-left p-4 border-2 rounded-lg transition ${selectedAddressId === addr.id
                      ? 'bg-brand-100 border-brand-500'
                      : 'border-brand-300 hover:bg-brand-100 hover:border-brand-500'
                    } text-brand-700`}
                >
                  <p className="font-bold text-brand-800">{addr.label}</p>
                  <p className="text-sm text-brand-600">{addr.line1}, {addr.city} {addr.postcode}</p>
                  {addr.phone && (
                    <p className="text-sm text-brand-600 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {addr.phone}
                    </p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-brand-600 mb-4">No addresses saved yet.</p>
              <button
                onClick={() => navigate('/addresses/new')}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-700"
              >
                Add Your First Address
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-brand-50 rounded-lg p-6 h-fit border-2 border-brand-200">
        <h2 className="text-lg font-bold mb-4 text-brand-700">Order Summary</h2>
        <div className="space-y-2 text-sm mb-6 text-brand-700">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between">
              <span>{item.name} x{item.quantity}</span>
              <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-brand-200 pt-4 space-y-2 text-brand-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs. {total().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>Rs. 2.50</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-brand-800">
            <span>Total</span>
            <span>Rs. {(total() + 2.5).toFixed(2)}</span>
          </div>
          <button
            onClick={handlePay}
            disabled={createOrder.isPending || !selectedAddressId}
            className="w-full mt-6 bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {createOrder.isPending ? 'Processing...' : <span className="flex items-center justify-center gap-2"><CreditCard className="w-4 h-4" /> Pay Now</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
