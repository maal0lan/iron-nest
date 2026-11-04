function ErrorState({ message = 'Could not load products.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-danger-50)] text-2xl text-[var(--color-danger-700)]" role="img" aria-label="Error">
        &times;
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-strong)]">{message}</h3>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 min-h-[var(--control-md)] rounded-md bg-[var(--color-primary-600)] text-[var(--on-primary)] px-5 text-sm font-semibold hover:bg-[var(--color-primary-700)] hover:shadow-glow transition-all"
        >
          <span>↻</span> Retry
        </button>
      )}
    </div>
  );
}

export { ErrorState };
export default ErrorState;
