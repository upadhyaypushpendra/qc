import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useNavbarStore } from '../../stores/navbarStore';
import { ArrowLeft, Home, User, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { itemCount } = useCartStore();
  const { customHeading, customSubHeading } = useNavbarStore((s) => s);

  const isHome = location.pathname === '/';


  return (
    <nav className="bg-brand-600 text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo or Back Button with Heading */}
        <div className="flex items-center gap-3">
          {isHome ? (
            <Link to="/" className="flex items-center gap-2">
              <img src={'/AppLogoFull.png'} alt="QuickGrocery" className="h-10 w-auto" />
            </Link>
          ) : (
            <>
              <button
                onClick={() => navigate(-1)}
                className="hover:opacity-80 transition flex-shrink-0"
                title="Go back"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
              {customHeading && <h1 className="text-lg font-semibold">{customHeading}</h1>}
              {customSubHeading && <h2 className="text-sm font-small">{customSubHeading}</h2>}
              </div>
            </>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Home Button (only on non-home routes) */}
          {!isHome && (
            <button
              onClick={() => navigate('/')}
              className="hover:opacity-80 transition"
              title="Go to home"
            >
              <Home className="w-6 h-6" />
            </button>
          )}

          {/* Account Button */}
          <button
            onClick={() => {
              if (user) {
                navigate('/account');
              } else {
                navigate('/auth/login');
              }
            }}
            className="hover:opacity-80 transition"
            title={user ? 'Account' : 'Login'}
          >
            <User className="w-6 h-6" />
          </button>

          {/* Cart Button */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6" />
            {itemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
