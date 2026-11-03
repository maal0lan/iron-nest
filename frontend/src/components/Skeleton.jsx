export default function Skeleton({ className, width = '100%', height = 16 }) {
  return (
    <div
      className={`animate-pulse rounded-md ${className || ''}`}
      style={{ width, height, backgroundColor: 'var(--color-gray-200)' }}
    />
  );
}
