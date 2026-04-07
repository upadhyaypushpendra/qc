import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  categories?: any[];
}

export default function SearchBar({ categories = [] }: SearchBarProps) {
  const navigate = useNavigate();
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Rotate placeholder every 3 seconds with slide animation
  useEffect(() => {
    if (categories.length === 0) return;

    const interval = setInterval(() => {
      // Start slide animation
      setIsAnimating(true);

      // After animation completes, update index
      setTimeout(() => {
        setDisplayIndex((prev) => (prev + 1) % categories.length);
        setIsAnimating(false);
      }, 700); // Match animation duration
    }, 3000);

    return () => clearInterval(interval);
  }, [categories.length]);

  const getCurrentPlaceholder = () => {
    return `Search '${categories[displayIndex]?.name ?? 'milk'}'`;
  };

  const getNextPlaceholder = () => {
    const nextIndex = (displayIndex + 1) % categories.length;
    return `Search '${categories[nextIndex]?.name ?? 'milk'}'`;
  };

  return (
    <div className="mb-8">
      <div
        onClick={() => navigate('/search')}
        className="flex items-center gap-3 w-full max-w-2xl bg-gray-800 border-2 border-brand-300 rounded-lg px-4 py-2 hover:border-brand-600 transition cursor-pointer hover:shadow-md overflow-hidden"
      >
        <Search className="w-5 h-5 text-brand-600 flex-shrink-0" />
        <div className="flex-1 h-6 relative overflow-hidden">
          <div
            className={`absolute w-full ${
              isAnimating ? 'transition-transform duration-700 ease-in-out' : ''
            }`}
            style={{
              transform: isAnimating ? 'translateY(-24px)' : 'translateY(0px)',
            }}
          >
            {/* Current category */}
            <div className="h-6 text-brand-400 text-sm whitespace-nowrap">
              {getCurrentPlaceholder()}
            </div>
            {/* Next category */}
            <div className="h-6 text-brand-400 text-sm whitespace-nowrap">
              {getNextPlaceholder()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

