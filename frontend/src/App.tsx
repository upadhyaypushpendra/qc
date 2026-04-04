import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import { useMe } from './hooks/useAuth';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductListPage = lazy(() => import('./pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const SearchProductPage = lazy(() => import('./pages/SearchProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const AddressesPage = lazy(() => import('./pages/AddressesPage'));
const AddressFormPage = lazy(() => import('./pages/AddressFormPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

// Components
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import ServerWakingDialog from './components/ServerWakingDialog';
import { PageLoader } from './components/Skeletons';

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
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
