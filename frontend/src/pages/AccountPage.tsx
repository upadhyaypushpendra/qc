import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useLogout } from '../hooks/useAuth';
import ProfileHeader from '../components/ProfileHeader';

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
      {/* Profile Header */}
      <ProfileHeader firstName={user?.firstName} lastName={user?.lastName} email={user?.identifier} />

      {/* Account Info Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-brand-700 mb-4">Account Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email/Phone Verification */}
          <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-700">Identifier</p>
                <p className="text-xs text-brand-600 mt-1">{user?.identifier}</p>
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                ✓ Verified
              </span>
            </div>
          </div>

          {/* Account Age */}
          <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-700">Account Type</p>
                <p className="text-xs text-brand-600 mt-1">Regular Account</p>
              </div>
              <span className="text-2xl">👤</span>
            </div>
          </div>

          {/* Phone (placeholder) */}
          <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-700">Phone Number</p>
                <p className="text-xs text-brand-600 mt-1">Not added</p>
              </div>
              <span className="text-2xl">📱</span>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-700">Notifications</p>
                <p className="text-xs text-brand-600 mt-1">Enabled</p>
              </div>
              <span className="text-2xl">🔔</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-brand-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Addresses */}
          <button
            onClick={() => navigate('/addresses')}
            className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6 text-left hover:shadow-lg hover:border-brand-400 transition"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">📍</span>
              <div>
                <h3 className="font-bold text-brand-700">Manage Addresses</h3>
                <p className="text-sm text-brand-600 mt-1">Add or edit delivery addresses</p>
              </div>
            </div>
          </button>

          {/* Orders */}
          <button
            onClick={() => navigate('/orders')}
            className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6 text-left hover:shadow-lg hover:border-brand-400 transition"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">📦</span>
              <div>
                <h3 className="font-bold text-brand-700">View Orders</h3>
                <p className="text-sm text-brand-600 mt-1">Track your purchases</p>
              </div>
            </div>
          </button>

          {/* Settings (placeholder) */}
          <button
            disabled
            className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6 text-left opacity-60 cursor-not-allowed"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚙️</span>
              <div>
                <h3 className="font-bold text-brand-700">Settings</h3>
                <p className="text-sm text-brand-600 mt-1">Coming soon</p>
              </div>
            </div>
          </button>

          {/* Help (placeholder) */}
          <button
            disabled
            className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6 text-left opacity-60 cursor-not-allowed"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">❓</span>
              <div>
                <h3 className="font-bold text-brand-700">Help & Support</h3>
                <p className="text-sm text-brand-600 mt-1">Coming soon</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="space-y-3">
        <button
          disabled
          className="w-full bg-brand-50 text-brand-600 py-3 rounded-lg font-bold border-2 border-brand-200 opacity-60 cursor-not-allowed transition hover:opacity-40"
        >
          ✏️ Edit Profile
        </button>
        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 disabled:bg-red-300 transition"
        >
          {logout.isPending ? 'Logging out...' : '🚪 Logout'}
        </button>
      </div>
    </div>
  );
}
