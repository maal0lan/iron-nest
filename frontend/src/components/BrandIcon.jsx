function BrandIcon({ className = 'h-9 w-9' }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-md bg-[linear-gradient(135deg,var(--color-primary-600),var(--color-secondary-600))] text-[var(--on-primary)] shadow-glow ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-[68%] w-[68%]" fill="none">
        <path d="M5 9v6M8 7v10M16 7v10M19 9v6M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export { BrandIcon };
