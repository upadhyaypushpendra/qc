import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useLogout } from '../hooks/useAuth';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const logout = useLogout();

  const handleLogout = async () => {
    await logout.mutateAsync();
    clearAuth();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-brand-700">Your Account</h1>

      <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-brand-700 mb-4">Your Details</h2>
        <div className="space-y-2">
          {user?.firstName && user?.lastName && (
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {user.firstName} {user.lastName}
            </p>
          )}
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {user?.email}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate('/addresses')}
        className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 mb-4"
      >
        Your Addresses
      </button>

      <button
        onClick={() => navigate('/orders')}
        className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 mb-4"
      >
        Order History
      </button>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
