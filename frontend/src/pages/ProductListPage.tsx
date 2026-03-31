import { useState } from 'react';
import { useAddToCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';
// import { useNavbarHeading } from '../hooks/useNavbarHeading';
import toast from 'react-hot-toast';
import CategorySidebar from '../components/CategorySidebar';
import ProductCard from '../components/ProductCard';

function Products({ subCategoryId }: { subCategoryId?: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts(page, 20, subCategoryId);
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


  return isLoading ? (
    <div className="text-brand-600">Loading products...</div>
  ) : data?.data?.length === 0 ? (
    <div className="text-center py-12">
      <p className="text-brand-600 text-lg">No products available</p>
    </div>
  ) : (
    <>
      <div className="grid grid-cols-2 gap-2 mb-8 items-start">
        {data?.data?.map((product: any) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
            isAddingToCart={addToCart.isPending}
          />
        ))}
      </div>

      {/* Pagination */}
      {data?.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border-2 border-brand-300 rounded text-brand-700 font-bold hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-2 rounded font-bold ${page === p
                ? 'bg-brand-600 text-white'
                : 'border-2 border-brand-300 text-brand-700 hover:bg-brand-50'
                }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(data.pages, page + 1))}
            disabled={page === data.pages}
            className="px-4 py-2 border-2 border-brand-300 rounded text-brand-700 font-bold hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}

export default function ProductListPage() {

  const [subCategoryId, setSubCategoryId] = useState<string | undefined>(undefined);
  // useNavbarHeading(categoryName);

  return (
    <div className="flex gap-6 min-h-[calc(100vh-48px)]">
      <CategorySidebar
        activeSlug={subCategoryId}
        onCategorySelect={setSubCategoryId}
      />

      <div className="flex-1 max-h-[calc(100vh-48px)] overflow-auto">
        {subCategoryId && <Products subCategoryId={subCategoryId} />}
      </div>
    </div>
  );
}
