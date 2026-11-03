import { useNavigate } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  const navigate = useNavigate();
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--color-gray-500)] mb-4">
      <ol className="flex flex-wrap gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {isLast ? (
                <span className="text-[var(--text-strong)]" aria-current="page">{item.label}</span>
              ) : (
                <button
                  onClick={() => navigate(item.to || '/')}
                  className="text-[var(--color-primary-600)] hover:underline"
                >
                  {item.label}
                </button>
              )}
              {!isLast && <span>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
