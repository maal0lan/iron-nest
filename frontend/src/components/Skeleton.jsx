function Skeleton({ className, width = '100%', height = 16 }) {
  return <div className={`shimmer rounded-md ${className || ''}`} style={{ width, height }} aria-hidden="true" />;
}

export { Skeleton };
export default Skeleton;

// Loading placeholder that matches the ProductCard footprint (4:5 image, text, button).
function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-sm" aria-hidden="true">
      <div className="shimmer aspect-[4/5] w-full" />
      <div className="space-y-3 p-4">
        <div className="shimmer h-3 w-1/3 rounded" />
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-2/3 rounded" />
        <div className="shimmer mt-4 h-11 w-full rounded-md" />
      </div>
    </div>
  );
}

export { ProductCardSkeleton };
