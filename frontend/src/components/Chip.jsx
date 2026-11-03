export default function Chip({ children, selected = false, removable, onRemove, className }) {
  const base = 'inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold border transition';
  const selectedStyle = 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)] border-[var(--color-primary-600)]';
  const defaultStyle = 'bg-[var(--color-gray-200)] text-[var(--color-gray-700)] border-[var(--border)]';

  return (
    <span className={`${base} ${selected ? selectedStyle : defaultStyle} ${className || ''}`}>
      {children}
      {removable && onRemove ? (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="ml-1 -mr-1 text-[var(--color-gray-500)] hover:text-[var(--color-danger-700)] leading-none p-0.5"
          aria-label="Remove filter"
        >
          &times;
        </button>
      ) : null}
    </span>
  );
}
