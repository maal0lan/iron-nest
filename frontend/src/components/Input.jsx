export default function Input({ id, label, type = 'text', placeholder, value, onChange, error, required, className }) {
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
        value={value || ''}
        onChange={onChange}
        required={required}
        className={`w-full min-h-[44px] rounded-md border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-body)] px-3 text-sm transition focus:border-[var(--color-primary-600)] focus:ring focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] ${error ? 'border-[var(--color-danger-700)] focus:border-[var(--color-danger-700)]' : ''} ${className || ''}`}
      />
      {error && (
        <span className="text-xs text-[var(--color-danger-700)]">{error}</span>
      )}
    </div>
  );
}
