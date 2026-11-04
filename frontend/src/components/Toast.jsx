import { useEffect, useState } from 'react';

function Toast({ message, actionLabel, onAction, autoHide = true }) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);
    if (!autoHide || !message) return;
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, [message, autoHide]);

  if (!visible || !message) return null;

  return (
    <div
      role="status"
      className="animate-pop-in fixed left-1/2 top-[calc(var(--header-height)+16px)] z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-[var(--border)] border-l-4 border-l-[var(--color-primary-600)] bg-[var(--bg-card)] px-5 py-3 text-sm font-medium text-[var(--text-strong)] shadow-lg"
    >
      <span>{message}</span>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="ml-2 text-sm font-semibold text-[var(--color-primary-600)] underline underline-offset-4 hover:text-[var(--color-primary-700)]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export { Toast };
export default Toast;
