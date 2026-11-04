function Button({ children, variant = 'primary', size = 'md', disabled, className, type = 'button', ...rest }) {
  // Control heights from the design system: sm 36 · md 44 · lg 52
  const sizes = {
    sm: 'px-3 text-xs min-h-[var(--control-sm)]',
    md: 'px-5 text-sm min-h-[var(--control-md)]',
    lg: 'px-7 text-base min-h-[var(--control-lg)]',
  };

  const base =
    'inline-flex items-center justify-center gap-2 select-none font-semibold rounded-md ' +
    'transition-all duration-150 ease-out active:translate-y-0 ' +
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-page)] ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none';

  const variants = {
    primary:
      'bg-[var(--color-primary-600)] text-[var(--on-primary)] hover:bg-[var(--color-primary-700)] hover:-translate-y-0.5 hover:shadow-glow',
    secondary:
      'border border-[var(--color-primary-600)] text-[var(--color-primary-600)] bg-transparent hover:bg-[var(--color-primary-50)] hover:-translate-y-0.5',
    ghost:
      'text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--color-gray-100)]',
    danger:
      'bg-[var(--danger-solid)] text-white hover:brightness-110 hover:-translate-y-0.5',
  };

  return (
    <button
      type={type}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className || ''}`.trim()}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export { Button };
export default Button;
