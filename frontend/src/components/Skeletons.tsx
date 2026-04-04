function Bone({ className }: { className?: string }) {
  return <div className={`bg-gray-700 animate-pulse rounded ${className}`} />;
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[100vh]">
      <div className="w-10 h-10 border-[3px] border-gray-700 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}

export function ProductCardSkeleton({ small = false }: { small?: boolean }) {
  return (
    <div className="rounded-lg overflow-hidden">
      <Bone className={`w-full ${small ? 'h-20' : 'h-40'} rounded-lg`} />
      {!small && (
        <div className="pt-4 pb-3 space-y-2">
          <Bone className="h-3 w-10" />
          <Bone className="h-4 w-3/4" />
          <Bone className="h-4 w-1/3" />
        </div>
      )}
    </div>
  );
}

export function ProductGridSkeleton({ count = 6, cols = 2, small = false }: { count?: number; cols?: number; small?: boolean }) {
  return (
    <div className={`grid grid-cols-${cols} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} small={small} />
      ))}
    </div>
  );
}

export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded overflow-hidden">
          <Bone className="w-full h-32 rounded-none" />
          <div className="p-4 bg-gray-800">
            <Bone className="h-4 w-2/3 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrderListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-800 border-2 border-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Bone className="h-3 w-24" />
              <Bone className="h-5 w-32" />
              <Bone className="h-3 w-40" />
            </div>
            <Bone className="h-7 w-20 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8">
      <Bone className="w-full h-96 rounded-lg" />
      <div className="space-y-4">
        <Bone className="h-8 w-3/4" />
        <Bone className="h-5 w-1/3" />
        <Bone className="h-8 w-1/4" />
        <div className="space-y-2 pt-2">
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-2/3" />
        </div>
        <div className="p-4 bg-gray-800 rounded border-2 border-gray-700 space-y-2">
          <Bone className="h-4 w-1/3" />
          <Bone className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function OrderTrackingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Bone className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <Bone className="h-4 w-1/3" />
              <Bone className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
      <div className="border-2 border-gray-700 rounded-lg p-6 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Bone className="h-4 w-1/3" />
            <Bone className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
