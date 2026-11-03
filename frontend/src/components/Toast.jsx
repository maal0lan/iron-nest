import { useEffect, useState } from 'react';

export default function Toast({ message, actionLabel, onAction, autoHide = true }) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (!autoHide || !message) return;
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, [message, autoHide]);

  if (!visible || !message) return null;

  return (
    <div
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-lg px-5 py-3 text-sm text-[var(--text-strong)]"
      style={{
        borderLeft: '4px solid var(--color-primary-600)',
      }}
    >
      <span>{message}</span>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-sm font-semibold text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] underline ml-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
