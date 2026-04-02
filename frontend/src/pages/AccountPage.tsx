import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useLogout, useUpdateProfile } from '../hooks/useAuth';
import { usePushNotifications } from '../hooks/usePushNotifications';
import ProfileHeader from '../components/ProfileHeader';
import toast from 'react-hot-toast';
import { User, Bell, MapPin, Package, Pencil, LogOut } from 'lucide-react';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const logout = useLogout();
  const updateProfile = useUpdateProfile();
  const { isSubscribed, isSupported, isDenied, isLoading: pushLoading, subscribe, unsubscribe } = usePushNotifications();

  const [editOpen, setEditOpen] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');

  const handleLogout = async () => {
    await logout.mutateAsync();
    clearAuth();
    navigate('/');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(
      { firstName: firstName.trim(), lastName: lastName.trim() },
      {
        onSuccess: () => {
          toast.success('Profile updated');
          setEditOpen(false);
        },
        onError: () => toast.error('Failed to update profile'),
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ProfileHeader firstName={user?.firstName} lastName={user?.lastName} email={user?.identifier} />

      {/* Account Info Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-brand-700 mb-4">Account Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-700">Phone</p>
                <p className="text-xs text-brand-600 mt-1">{user?.identifier}</p>
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-900 text-green-300">
                ✓ Verified
              </span>
            </div>
          </div>

          {/* Account Type */}
          <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-700">Account Type</p>
                <p className="text-xs text-brand-600 mt-1">Regular Account</p>
              </div>
              <User className="w-6 h-6 text-brand-500" />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-700">Notifications</p>
                <p className="text-xs text-brand-600 mt-1">
                  {!isSupported
                    ? 'Not supported in this browser'
                    : isDenied
                      ? 'Blocked — enable in site settings'
                      : isSubscribed
                        ? 'Order updates enabled'
                        : 'Order updates disabled'}
                </p>
              </div>
              {isSupported && !isDenied ? (
                <button
                  onClick={isSubscribed ? unsubscribe : subscribe}
                  disabled={pushLoading}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    isSubscribed ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                  } disabled:opacity-50`}
                >
                  {pushLoading ? '...' : isSubscribed ? 'On' : 'Off'}
                </button>
              ) : (
                <Bell className="w-6 h-6 text-brand-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-brand-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/addresses')}
            className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6 text-left hover:shadow-lg hover:border-brand-400 transition"
          >
            <div className="flex items-start gap-4">
              <MapPin className="w-7 h-7 text-brand-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-brand-700">Manage Addresses</h3>
                <p className="text-sm text-brand-600 mt-1">Add or edit delivery addresses</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/orders')}
            className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6 text-left hover:shadow-lg hover:border-brand-400 transition"
          >
            <div className="flex items-start gap-4">
              <Package className="w-7 h-7 text-brand-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-brand-700">View Orders</h3>
                <p className="text-sm text-brand-600 mt-1">Track your purchases</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setFirstName(user?.firstName ?? '');
              setLastName(user?.lastName ?? '');
              setEditOpen(true);
            }}
            className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6 text-left hover:shadow-lg hover:border-brand-400 transition md:col-span-2"
          >
            <div className="flex items-start gap-4">
              <Pencil className="w-7 h-7 text-brand-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-brand-700">Edit Profile</h3>
                <p className="text-sm text-brand-600 mt-1">Update your name and personal info</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="space-y-3">
        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 disabled:bg-red-800 transition"
        >
          {logout.isPending ? 'Logging out...' : <span className="flex items-center justify-center gap-2"><LogOut className="w-4 h-4" /> Logout</span>}
        </button>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-brand-700 mb-6">Edit Profile</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-brand-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-2 border-2 border-brand-200 bg-brand-50 rounded-lg focus:outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-2 border-2 border-brand-200 bg-brand-50 rounded-lg focus:outline-none focus:border-brand-400"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="flex-1 py-2 border-2 border-brand-200 text-brand-700 rounded-lg font-semibold hover:bg-brand-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="flex-1 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 disabled:bg-gray-600 transition"
                >
                  {updateProfile.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
