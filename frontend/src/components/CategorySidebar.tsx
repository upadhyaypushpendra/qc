import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSubcategories } from '../hooks/useProducts';

interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  sortOrder: number;
}

interface CategorySidebarProps {
  categories?: Category[];
  activeSlug?: string;
  onCategorySelect?: (slug: string) => void;
  onViewAllClick?: () => void;
}

export default function CategorySidebar({
  // categories = [],
  activeSlug,
  onCategorySelect,
  // onViewAllClick,
}: CategorySidebarProps) {
  const { id } = useParams<{ id?: string }>();
  const { data: categories } = useSubcategories(id);


  useEffect(() => {
    if (categories?.length && onCategorySelect) {
      onCategorySelect(categories[0]._id);
    }
  }, [categories,onCategorySelect]);

  return (
    <div className="w-20 flex-shrink-0 -ml-4 -mt-2 shadow-md">
      <div className="bg-brand-50 p-0 sticky max-h-[calc(100vh-48px)] overflow-y-auto br-1 border-brand-200">
        <div className="space-y-0">

          {/* Categories */}
          {categories?.map((category) => (
            <button
              key={category._id}
              onClick={() => onCategorySelect && onCategorySelect(category._id)}
              className={`w-full text-center px-3 py-4 text-xs transition ${
                activeSlug === category._id
                  ? 'bg-brand-100 font-bold text-brand-700 border-r-4 border-brand-600'
                  : 'text-brand-700 border-r-4 border-transparent'
              }`}
            >
              {category.imageUrl && (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-8 h-8 inline-block mb-1 object-cover"
                />
              )}
              <br/>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
