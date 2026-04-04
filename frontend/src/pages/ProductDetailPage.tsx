import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import ItemQuantity from '../components/ItemQuantity';
import { ProductDetailSkeleton } from '../components/Skeletons';
import { useAddToCart, useUpdateCartQuantity } from '../hooks/useCart';
import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../stores/cartStore';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || '');
  const addToCart = useAddToCart();
  const updateQuantity = useUpdateCartQuantity();
  const cartItem = useCartStore((s) => s.items.find((i) => i.productId === slug));
  const cartQty = cartItem?.quantity ?? 0;

  const handleAddToCart = () => {
    if (product) {
      addToCart.mutate({
        productId: product.slug,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        unit: product.unit,
      });
      toast.success('Added to cart!');
    }
  };

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product) return <div className="text-brand-600 text-lg">Product not found</div>;

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className="w-full rounded-lg bg-gray-700 h-96 object-cover" />
        <div className='absolute bottom-0 right-2 translate-y-1/4'>
        {cartQty > 0 ? (
          <ItemQuantity
            quantity={cartQty}
            onQuantityChange={(qty) => {
                updateQuantity.mutate({ productId: product.slug, quantity: qty });
            }}
            isLoading={updateQuantity.isPending}
            minQuantity={0}
          />
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || addToCart.isPending}
            className={`px-4 py-2 bg-brand-500 text-white-600 rounded-lg font-bold disabled:bg-gray-600 shadow-md transition text-lg ${addToCart.isPending ? 'animate-blink' : ''}`}
          >
            {addToCart.isPending ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        )}
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2 text-brand-800">{product.name}</h1>
        <p className="text-brand-600 mb-4 font-medium">{product.brand}</p>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-3xl font-bold text-brand-700">Rs. {product.price.toFixed(2)}</span>
          {product.comparePrice && (
            <span className="line-through text-brand-300">Rs. {product.comparePrice.toFixed(2)}</span>
          )}
        </div>

        <p className="text-brand-700 mb-6">{product.description}</p>

        <div className="mb-6 p-4 bg-brand-50 rounded border-2 border-brand-200">
          <p className="text-sm text-brand-700"><strong>Unit:</strong> {product.unit}</p>
          <p className="text-sm text-brand-700"><strong>In Stock:</strong> {product.inStock ? `${product.stockQty} available` : 'Out of stock'}</p>
        </div>

        
      </div>
    </div>
  );
}
