import { Link } from 'react-router-dom';
import OrderStatusBadge from '../components/OrderStatusBadge';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { CategoryGridSkeleton, ProductGridSkeleton } from '../components/Skeletons';
import { useOrders } from '../hooks/useOrders';
import { useCategories, useMyFrequentProducts, useTopProducts } from '../hooks/useProducts';
import { useAuthStore } from '../stores/authStore';

export default function HomePage() {
  const { user } = useAuthStore();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: topProducts, isLoading: topLoading } = useTopProducts();
  const { data: myFrequent, isLoading: myFrequentLoading } = useMyFrequentProducts();
  const { data: orders } = useOrders();

  // Find all in-progress orders (not completed)
  const inProgressOrders = orders?.filter((order: any) => !order.completed).map((order: any) => ({
    id: order.id,
    status: order.status,
    createdAt: order.createdAt,
  })) || [];

  const recommendations = user && myFrequent ? myFrequent : topProducts;
  const recommendationsLoading = user ? myFrequentLoading : topLoading;

  return (
    <div>
      {/* Search Bar */}
      <SearchBar categories={categories} />

      {/* Frequent Purchases / Trending Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 mt-4 text-brand-700">
          {user && myFrequent ? 'Your frequent purchases' : 'Popular products'}
        </h2>
        {recommendationsLoading ? (
          <ProductGridSkeleton count={6} cols={3} small />
        ) : recommendations?.length === 0 ? (
          <p className="text-brand-600">No recommendations available</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {recommendations?.slice(0, 6).map((product: any) => (
              <ProductCard
                key={product._id}
                product={product}
                small
              />
            ))}
          </div>
        )}
      </div>

      {/* Categories Section */}
      {categoriesLoading ? (
        <CategoryGridSkeleton count={6} />
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4 text-brand-700">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories?.map((cat: any) => (
              <Link
                key={cat._id}
                to={`/categories/${cat._id}`}
                className="bg-brand-50 border-2 border-brand-200 lg overflow-hidden hover:shadow-lg hover:border-brand-400 transition"
              >
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-32 object-cover bg-gray-700" />
                <div className="p-4 bg-brand-50">
                  <h3 className="font-bold text-center text-brand-700">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Order Status Badge - Show when order is in progress */}
      {user && inProgressOrders.length > 0 && (
        <OrderStatusBadge orders={inProgressOrders} sticky/>
      )}
    </div>
  );
}
