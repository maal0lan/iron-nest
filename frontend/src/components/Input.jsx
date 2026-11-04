function Input({ id, label, type = 'text', placeholder, value, onChange, error, required, className, ...rest }) {
  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-[var(--text-strong)]">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder || ''}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        className={`w-full min-h-[var(--control-md)] rounded-md border bg-[var(--bg-card)] px-3.5 text-sm leading-5 text-[var(--text-body)] placeholder:text-[var(--text-muted)] transition-all duration-150 focus:outline-none focus:ring-[3px] focus:ring-[var(--color-focus-ring)] ${
          error
            ? 'border-[var(--color-danger-700)] focus:border-[var(--color-danger-700)]'
            : 'border-[var(--color-gray-300)] focus:border-[var(--color-primary-600)]'
        }`}
        {...rest}
      />
      {error && <span className="text-xs font-medium text-[var(--color-danger-700)]">{error}</span>}
    </div>
  );
}

export { Input };
export default Input;
