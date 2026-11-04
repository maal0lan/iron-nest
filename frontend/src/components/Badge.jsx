function Badge({ children, variant = 'neutral', className }) {
  const variants = {
    discount: 'bg-[var(--color-accent-50)] text-[var(--color-accent-600)] border-[color-mix(in_srgb,currentColor_28%,transparent)]',
    success: 'bg-[var(--color-success-50)] text-[var(--color-success-700)] border-[color-mix(in_srgb,currentColor_28%,transparent)]',
    warning: 'bg-[var(--color-warning-50)] text-[var(--color-warning-700)] border-[color-mix(in_srgb,currentColor_28%,transparent)]',
    danger: 'bg-[var(--color-danger-50)] text-[var(--color-danger-700)] border-[color-mix(in_srgb,currentColor_28%,transparent)]',
    neutral: 'bg-[var(--color-gray-100)] text-[var(--color-gray-700)] border-[var(--border)]',
    primary: 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] border-[var(--color-primary-100)]',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs leading-4 font-semibold uppercase tracking-wide ${variants[variant] || variants.neutral} ${className || ''}`}
    >
      {children}
    </span>
  );
}

export { Badge };
export default Badge;
