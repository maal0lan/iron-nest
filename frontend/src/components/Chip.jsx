function Chip({ children, selected = false, removable, onRemove, className }) {
  const base = 'inline-flex items-center gap-1 rounded-pill px-3.5 py-1.5 text-xs font-semibold border transition-all duration-150';
  const selectedStyle = 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)] border-[var(--color-primary-600)]';
  const defaultStyle = 'bg-[var(--bg-card)] text-[var(--text-body)] border-[var(--border)] hover:border-[var(--color-primary-600)] hover:text-[var(--color-primary-600)]';

  return (
    <span className={`${base} ${selected ? selectedStyle : defaultStyle} ${className || ''}`}>
      {children}
      {removable && onRemove ? (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="ml-1 -mr-1 grid h-5 w-5 place-items-center rounded-full text-[var(--text-muted)] hover:bg-[var(--color-danger-50)] hover:text-[var(--color-danger-700)] leading-none"
          aria-label="Remove filter"
        >
          &times;
        </button>
      ) : null}
    </span>
  );
}

export { Chip };
export default Chip;
