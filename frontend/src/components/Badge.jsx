export default function Badge({ children, variant = 'neutral', className }) {
  const variants = {
    discount: 'bg-[var(--color-accent-50)] text-[var(--color-accent-600)] border border-[var(--color-accent-50)]',
    success: 'bg-[var(--color-success-50)] text-[var(--color-success-700)] border border-[var(--color-success-50)]',
    warning: 'bg-[var(--color-warning-50)] text-[var(--color-warning-700)] border border-[var(--color-warning-50)]',
    danger: 'bg-[var(--color-danger-50)] text-[var(--color-danger-700)] border border-[var(--color-danger-50)]',
    neutral: 'bg-[var(--color-gray-100)] text-[var(--color-gray-700)] border border-[var(--border)]',
    primary: 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] border border-[var(--color-primary-100)]',
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide border ${variants[variant]} ${className || ''}`}
    >
      {children}
    </span>
  );
}
