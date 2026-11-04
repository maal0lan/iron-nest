import { Link } from 'react-router-dom';

/**
 * Reusable page title + optional actions row.
 * Keeps page headings consistent and responsive across the app.
 */
function PageHeader({ title, subtitle, actions, backTo }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="font-heading text-xl md:text-2xl font-bold text-[var(--text-strong)]">{title}</h1>
        {subtitle && <p className="text-[var(--color-gray-500)] text-sm">{subtitle}</p>}
      </div>

      {backTo && (
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm font-semibold text-[var(--text-body)] hover:bg-[var(--color-gray-100)] transition"
        >
          ← {backTo.label || 'Back'}
        </Link>
      )}

      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export { PageHeader };
export default PageHeader;
