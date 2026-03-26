import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';

export default function AppShell() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { itemCount } = useCartStore();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-brand-600 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={'/AppLogo.png'} alt="QuickGrocery" className="h-8 w-8" />
            <span className="font-bold text-2xl">QuickGrocery</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (user) {
                  navigate('/account');
                } else {
                  navigate('/auth/login');
                }
              }}
              className="text-2xl hover:opacity-80"
              title={user ? 'Account' : 'Login'}
            >
              👤
            </button>

            <Link to="/cart" className="relative">
              <span className="text-2xl">🛒</span>
              {itemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full py-6 px-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>&copy; 2026 QuickGrocery. Fast, fresh, delivered.</p>
        </div>
      </footer>
    </div>
  );
}
