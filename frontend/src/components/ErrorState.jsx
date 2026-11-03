export default function ErrorState({ message = 'Could not load products.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="rounded-full bg-[var(--color-danger-50)] p-4 text-[var(--color-danger-700)]" role="img" aria-label="Error">
        &times;
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-strong)]">{message}</h3>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-primary-600)] bg-[var(--color-primary-600)] text-white px-4 py-1.5 text-sm font-semibold hover:bg-[var(--color-primary-700)] transition"
        >
          <span>↻</span> Retry
        </button>
      )}
    </div>
  );
}
