import { formatMoney } from '../utils/money.js';

/**
 * Reusable stat card used across dashboards.
 * Keeps the design-system token structure so themes apply automatically.
 */
function StatCard({ title, value, icon, subtitle }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs text-[var(--color-gray-500)] uppercase font-semibold">{title}</p>
        <p className="text-lg font-bold text-[var(--text-strong)]">{typeof value === 'number' ? formatMoney(value) : value}</p>
        {subtitle && <p className="text-xs text-[var(--text-muted)] mt-1">{subtitle}</p>}
      </div>
      <div className="w-8 h-8 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center text-[var(--color-primary-600)] text-lg">
        {icon}
      </div>
    </div>
  );
}

export { StatCard };
export default StatCard;
