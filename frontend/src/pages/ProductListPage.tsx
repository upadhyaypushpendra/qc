import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

export default function ProductListPage() {
  const { data, isLoading } = useProducts();
  const addToCart = useAddToCart();

  const handleAddToCart = (product: any) => {
    addToCart.mutate({
      productId: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      unit: product.unit,
    });
    toast.success('Added to cart!');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-brand-700">Products</h1>

      {isLoading ? (
        <div className="text-brand-600">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.data?.map((product: any) => (
            <div key={product._id} className="bg-brand-50 border-2 border-brand-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-brand-400 transition">
              <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover bg-gray-200" />
              <div className="p-4">
                <Link to={`/products/${product.slug}`} className="font-bold text-brand-700 hover:text-brand-600 hover:underline">
                  {product.name}
                </Link>
                <p className="text-sm text-brand-600 mt-1">{product.unit}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-lg text-brand-700">Rs. {product.price.toFixed(2)}</span>
                  {product.comparePrice && (
                    <span className="line-through text-brand-300 text-sm">Rs. {product.comparePrice.toFixed(2)}</span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock || addToCart.isPending}
                  className="w-full mt-3 bg-brand-600 text-white py-2 rounded font-medium hover:bg-brand-700 disabled:bg-gray-300"
                >
                  {addToCart.isPending ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
