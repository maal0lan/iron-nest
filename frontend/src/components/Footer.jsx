export default function Footer() {
  return (
    <footer
      className="border-t border-[var(--border)] bg-[var(--bg-card)] py-6 mt-auto"
      style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-body)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--color-gray-500)]">
        <p>© {new Date().getFullYear()} IronNest · Fitness Marketplace</p>
        <p className="text-xs">Fake checkout · Images by URL · Built with React + Node + MongoDB</p>
      </div>
    </footer>
  );
}
