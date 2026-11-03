import { useDispatch, useSelector } from 'react-redux';
import { setTheme, selectTheme } from '../features/theme/themeSlice.js';

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const themes = [
    { name: 'light', label: 'Light', icon: '☀' },
    { name: 'dark', label: 'Dark', icon: '☾' },
    { name: 'iron', label: 'Iron', icon: '⚡' },
    { name: 'neon', label: 'Neon', icon: '✦' },
  ];

  const nextTheme = () => {
    const idx = themes.findIndex((t) => t.name === theme);
    const next = themes[(idx + 1) % themes.length];
    dispatch(setTheme(next.name));
  };

  const current = themes.find((t) => t.name === theme) || themes[0];

  return (
    <button
      onClick={nextTheme}
      className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)] transition"
      title={`Switch to ${current.label} theme`}
      aria-label="Theme switcher"
    >
      <span className="text-sm">{current.icon}</span>
    </button>
  );
}
