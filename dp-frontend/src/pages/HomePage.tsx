import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useWalletBalance } from '../hooks/useWallet';
import LocationTracker from '../components/LocationTracker';
import OrderRequestListener from '../components/OrderRequestListener';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { user } = useAuthStore();
  const { data: walletData, isLoading: walletLoading, error: walletError } = useWalletBalance();

  useEffect(() => {
    if (walletError) {
      toast.error('Failed to load wallet data');
    }
  }, [walletError]);

  const formatCurrency = (value: number | string | undefined) => {
    if (value === undefined) return '0.00';
    return parseFloat(value.toString()).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-brand-700">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-brand-600 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Available Balance */}
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <p className="text-sm text-brand-600 font-semibold mb-2">💰 Available Balance</p>
            {walletLoading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-24"></div>
            ) : (
              <p className="text-2xl font-bold text-green-600">₹{formatCurrency(walletData?.balance)}</p>
            )}
          </div>

          {/* Pending Earnings */}
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-brand-600 font-semibold mb-2">⏳ Pending Earnings</p>
            {walletLoading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-24"></div>
            ) : (
              <p className="text-2xl font-bold text-yellow-600">
                ₹{formatCurrency(walletData?.pendingEarnings)}
              </p>
            )}
          </div>

          {/* Total Earnings */}
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-sm text-brand-600 font-semibold mb-2">📈 Total Earnings</p>
            {walletLoading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-24"></div>
            ) : (
              <p className="text-2xl font-bold text-blue-600">
                ₹{formatCurrency(walletData?.totalEarnings)}
              </p>
            )}
          </div>
        </div>

        {/* Location Tracking */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-brand-700 mb-3">📍 Location Tracking</h2>
          <LocationTracker />
        </div>

        {/* Order Requests */}
        <div className="mb-6">
          <OrderRequestListener />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg hover:border-brand-400 transition border-2 border-brand-200"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">📋</span>
              <div>
                <h3 className="font-bold text-brand-700">My Deliveries</h3>
                <p className="text-sm text-brand-600 mt-1">View ongoing and completed deliveries</p>
              </div>
            </div>
          </button>

          <button
            className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg hover:border-brand-400 transition border-2 border-brand-200"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">📊</span>
              <div>
                <h3 className="font-bold text-brand-700">Analytics</h3>
                <p className="text-sm text-brand-600 mt-1">View earnings and statistics</p>
              </div>
            </div>
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <p className="text-sm font-semibold text-blue-700 mb-2">💡 Quick Tips:</p>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>✓ Keep location sharing enabled to receive more orders</li>
            <li>✓ Orders expire in 2 minutes - accept quickly to secure the delivery</li>
            <li>✓ Acceptance fee is added to your pending earnings immediately</li>
            <li>✓ Complete deliveries to move earnings to available balance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
