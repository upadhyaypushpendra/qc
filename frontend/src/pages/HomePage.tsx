import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useProducts';
import bannerImg from '../assets/app-banner.png';

export default function HomePage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div>
      <div className="relative lg overflow-hidden mb-8 h-80">
        <img
          src={bannerImg}
          alt="Fresh Groceries Delivered Fast"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold mb-4 text-center">Fresh Groceries Delivered Fast</h1>
          <p className="text-lg mb-6 text-center">Get fresh produce, dairy, and pantry items delivered to your door</p>
          <Link to="/products" className="inline-block bg-brand-600 text-white p-3 rounded font-bold hover:bg-brand-700">
            Shop Now
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div>Loading categories...</div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-brand-700">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories?.map((cat: any) => (
              <Link
                key={cat._id}
                to={`/categories/${cat.slug}`}
                className="bg-brand-50 border-2 border-brand-200 lg overflow-hidden hover:shadow-lg hover:border-brand-400 transition"
              >
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-32 object-cover bg-gray-200" />
                <div className="p-4 bg-brand-50">
                  <h3 className="font-bold text-center text-brand-700">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
