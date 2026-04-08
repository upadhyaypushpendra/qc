import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeletons';
import { Search } from 'lucide-react';
import { useMyFrequentProducts, useProducts, useTopProducts } from '../hooks/useProducts';
import { useProductSuggestions } from '../hooks/useProductSuggestions';
import { useAuthStore } from '../stores/authStore';
import { useSearchHistoryStore } from '../stores/searchHistoryStore';
import type { SuggestionProduct } from '../interfaces/products';

export default function SearchProductPage() {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const { searches, addSearch, removeSearch, clearHistory } = useSearchHistoryStore();

  // Debounce search input (300ms for more responsive suggestions)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim()) {
        setSearchQuery(inputValue.trim());
      } else {
        setSearchQuery('');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Data fetching
  const { data: searchResults, isLoading: searchLoading } = useProducts(1, 15, undefined, searchQuery);
  const { data: suggestions, isLoading: suggestionsLoading } = useProductSuggestions(inputValue.trim(), 8);
  const { data: topProducts, isLoading: topLoading } = useTopProducts();
  const { data: myFrequent, isLoading: myFrequentLoading } = useMyFrequentProducts();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setInputValue(suggestion.name);
    setSearchQuery(suggestion.name);
    addSearch(suggestion.name);
  };

  const handleRecentSearchClick = (search: string) => {
    setInputValue(search);
    setSearchQuery(search);
  };

  const isSearching = searchQuery.length > 0;
  const displayRecommendations = user && myFrequent ? myFrequent : topProducts;
  const recommendationsLoading = user ? myFrequentLoading : topLoading;

  // Product Card Component (removed inline, using imported component)
  return (
    <div>
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-10 bg-gray-900 pb-2 border-b-2 border-brand-200">
        <div className="flex items-center gap-3 w-full max-w-2xl bg-gray-800 border-2 border-brand-300 rounded-lg px-4 py-2 hover:border-brand-600 transition cursor-pointer hover:shadow-md">
          <Search className="w-5 h-5 text-brand-600 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search products by name, brand, tags..."
            value={inputValue}
            onChange={handleSearch}
            autoFocus
            className="flex-1 bg-transparent outline-none placeholder-brand-400 text-sm"
          />
        </div>
      </div>

      <div className="py-6 px-1">
        {/* No search query - show recent searches and recommendations */}
        {!isSearching && (
          <>
            {/* Recent Searches Section */}
            {searches.length > 0 && (
              <div className="mb-12 border-b-2 border-brand-200 pb-4">
                <h2 className="text-xl font-bold text-brand-700 mb-4">Recent Searches</h2>
                <div className="flex flex-wrap gap-2">
                  {searches.map((search) => (
                    <div key={search} className="flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full px-4 py-2">
                      <button
                        onClick={() => handleRecentSearchClick(search)}
                        className="text-sm text-brand-700 hover:text-brand-600 font-medium"
                      >
                        {search}
                      </button>
                      <button
                        onClick={() => removeSearch(search)}
                        className="text-brand-400 hover:text-brand-600 font-bold ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={clearHistory}
                    className="text-sm text-brand-600 hover:text-brand-700 font-bold ml-2"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Top Picks Section */}
            <div>
              <h2 className="text-xl font-bold text-brand-700 mb-4">
                {user && myFrequent ? 'Your frequent purchases' : 'Popular products'}
              </h2>
              {recommendationsLoading ? (
                <ProductGridSkeleton count={6} cols={2} />
              ) : displayRecommendations?.length === 0 ? (
                <p className="text-brand-600">No recommendations available</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {displayRecommendations?.map((product: any) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Search query - show suggestions and results */}
        {isSearching && (
          <>
            {/* Suggestions Section */}
            {!suggestionsLoading && suggestions?.length &&  suggestions?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-brand-600 mb-3 uppercase">Suggestions</h3>
                <div className="space-y-2">
                  {suggestions.map((suggestion: SuggestionProduct) => (
                    <button
                      key={suggestion._id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-1 p-2 hover:bg-brand-50 rounded-lg transition mb-0"
                    >
                      <img
                        src={suggestion.imageUrl}
                        alt={suggestion.name}
                        className="w-4 h-4 object-cover rounded-sm"
                      />
                      <div className="text-left flex-1">
                        <p className="text-sm font-small text-brand-700">{suggestion.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results Section */}
            <div>
              <h2 className="text-xl font-bold text-brand-700 mb-4">
                Results for "{searchQuery}"
              </h2>

              {searchLoading ? (
                <ProductGridSkeleton count={6} cols={2} />
              ) : searchResults?.data?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-brand-600 text-lg">No products found</p>
                  <button
                    onClick={() => {
                      setInputValue('');
                      setSearchQuery('');
                    }}
                    className="text-brand-600 font-bold hover:underline mt-2"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-brand-600">
                      Found {searchResults?.total || 0} product{searchResults?.total !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {searchResults?.data?.map((product: any) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
