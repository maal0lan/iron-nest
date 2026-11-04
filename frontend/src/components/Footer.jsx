import { Link } from 'react-router-dom';

const SHOP = [
  ['Supplements', 'supplements'],
  ['Equipment', 'equipment'],
  ['Apparel', 'apparel'],
  ['Footwear', 'footwear'],
  ['Accessories', 'accessories'],
  ['Recovery', 'recovery'],
];

function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--bg-card)]">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5" aria-label="IronNest home">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-[linear-gradient(135deg,var(--color-primary-600),var(--color-secondary-600))] font-display text-lg font-bold text-[var(--on-primary)]">I</span>
            <span className="font-display text-xl font-bold uppercase tracking-wider text-[var(--text-strong)]">
              Iron<span className="text-[var(--color-primary-600)]">Nest</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-[var(--text-muted)]">
            A fitness marketplace for training, recovery and everyday movement. Independent sellers, one store.
          </p>
        </div>

        <nav aria-label="Shop">
          <h4 className="eyebrow !text-[var(--text-strong)]">Shop</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SHOP.map(([label, slug]) => (
              <li key={slug}>
                <Link to={`/products?category=${slug}`} className="text-[var(--text-muted)] transition-colors hover:text-[var(--color-primary-600)]">{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Account">
          <h4 className="eyebrow !text-[var(--text-strong)]">Account</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[['/login', 'Login'], ['/register', 'Create account'], ['/orders', 'My orders'], ['/wishlist', 'Wishlist'], ['/cart', 'Cart']].map(([to, label]) => (
              <li key={to}><Link to={to} className="text-[var(--text-muted)] transition-colors hover:text-[var(--color-primary-600)]">{label}</Link></li>
            ))}
          </ul>
        </nav>

        <div>
          <h4 className="eyebrow !text-[var(--text-strong)]">Store rules</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--text-muted)]">
            <li>Free shipping on orders of ₹999+</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-[var(--text-muted)] md:flex-row">
          <p>© {new Date().getFullYear()} IronNest · Fitness Marketplace</p>
          <p>Demo project · Built with React, Node and MongoDB</p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
export default Footer;
