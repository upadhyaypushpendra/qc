interface ItemQuantityProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  isLoading?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  isBlinking?: boolean;
}

export default function ItemQuantity({
  quantity,
  onQuantityChange,
  isLoading = false,
  minQuantity = 0,
  maxQuantity = 8,
  isBlinking = false,
}: ItemQuantityProps) {
  const handleDecrement = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`rounded-md bg-brand-500 p-1 shadow-md w-fit ${isBlinking ? 'animate-blink' : ''}`}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrement}
          disabled={isLoading || quantity <= minQuantity}
          className="p-1 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          −
        </button>
        <span className="w-auto text-center font-bold text-white">{quantity}</span>
        <button
          onClick={handleIncrement}
          disabled={isLoading || quantity >= maxQuantity}
          className="p-1 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  );
}
