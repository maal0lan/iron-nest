import { useEffect } from 'react';

export default function Button({ children, variant = 'primary', size = 'md', disabled, className, ...rest }) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs min-h-[36px]',
    md: 'px-5 py-2 min-h-[44px]',
    lg: 'px-6 py-2.5 text-base min-h-[52px]',
  };

  const base =
    'inline-block font-semibold text-sm rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  let style = {};
  let extraClass = '';

  if (variant === 'primary') {
    extraClass = 'bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)]';
    style = {
      '--ring-color': 'var(--color-focus-ring)',
    };
  } else if (variant === 'secondary') {
    extraClass = 'border border-[var(--color-primary-600)] text-[var(--color-primary-600)] bg-transparent hover:bg-[var(--color-primary-50)]';
  } else if (variant === 'ghost') {
    extraClass = 'text-[var(--text-muted)] hover:text-[var(--text-strong)]';
  } else if (variant === 'danger') {
    extraClass = 'bg-[var(--color-danger-700)] text-white hover:bg-[var(--color-danger-700)]';
  }

  return (
    <button
      className={`${base} ${sizes[size]} ${extraClass} ${className || ''}`.trim()}
      disabled={disabled}
      style={{
        ...style,
        ...(variant === 'primary' && {
          outlineColor: 'var(--color-focus-ring)',
        }),
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
