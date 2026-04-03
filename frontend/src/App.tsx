import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// import { useRegisterSW } from 'virtual:pwa-register/react';
import { useAuthStore } from './stores/authStore';
import { useMe } from './hooks/useAuth';

// Pages (to be created)
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchProductPage from './pages/SearchProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AccountPage from './pages/AccountPage';
import AddressesPage from './pages/AddressesPage';
import AddressFormPage from './pages/AddressFormPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Components
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import ServerWakingDialog from './components/ServerWakingDialog';

function App() {
  // PWA registration
  // useRegisterSW({
  //   onNeedRefresh() {
  //     if (confirm('New version available! Update now?')) {
  //       window.location.reload();
  //     }
  //   },
  //   onOfflineReady() {
  //     console.log('App is ready for offline use');
  //   },
  // });

  // Restore auth state on mount
  const me = useMe();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (me.data) {
      setAuth(me.data, useAuthStore.getState().accessToken || '');
    }
  }, [me.data, setAuth]);

  return (
    <BrowserRouter>
      <ServerWakingDialog />
      <Toaster position="bottom-center" />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/categories/:id" element={<ProductListPage />} />
          <Route path="/search" element={<SearchProductPage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderTrackingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addresses"
            element={
              <ProtectedRoute>
                <AddressesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addresses/new"
            element={
              <ProtectedRoute>
                <AddressFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addresses/:id/edit"
            element={
              <ProtectedRoute>
                <AddressFormPage />
              </ProtectedRoute>
            }
          />

          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
