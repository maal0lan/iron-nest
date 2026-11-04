import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, selectTheme } from '../features/theme/themeSlice.js';

// Swatches are previews only; the live look always comes from the data-theme tokens.
const THEMES = [
  { name: 'light', label: 'Light', bg: '#F9FAFB', fg: '#4338CA' },
  { name: 'dark', label: 'Dark', bg: '#0B0F19', fg: '#6366F1' },
  { name: 'iron', label: 'Iron', bg: '#0B0B0B', fg: '#DC2626' },
  { name: 'neon', label: 'Neon', bg: '#0A0A0A', fg: '#A3E635' },
];

function Swatch({ t }) {
  return (
    <span
      className="relative inline-block h-5 w-5 shrink-0 overflow-hidden rounded-full border border-[var(--border)]"
      style={{ background: t.bg }}
      aria-hidden="true"
    >
      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-tl-full" style={{ background: t.fg }} />
    </span>
  );
}

function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = THEMES.find((t) => t.name === theme) || THEMES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="grid h-10 w-10 place-items-center rounded-full border border-[color-mix(in_srgb,var(--on-header)_18%,transparent)] text-[var(--on-header)] transition-colors hover:bg-[color-mix(in_srgb,var(--on-header)_10%,transparent)]"
        aria-label={`Theme: ${current.label}. Change theme`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Swatch t={current} />
      </button>
      {open && (
        <div role="menu" className="animate-pop-in absolute right-0 mt-2 w-44 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-1.5 shadow-lg">
          {THEMES.map((t) => (
            <button
              key={t.name}
              type="button"
              role="menuitemradio"
              aria-checked={t.name === theme}
              onClick={() => { dispatch(setTheme(t.name)); setOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                t.name === theme
                  ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)]'
                  : 'text-[var(--text-body)] hover:bg-[var(--color-gray-100)]'
              }`}
            >
              <Swatch t={t} />
              <span className="flex-1 text-left">{t.label}</span>
              {t.name === theme && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { ThemeToggle };
export default ThemeToggle;
