import { formatMoney } from '../utils/money.js';
import { Badge } from './Badge.jsx';

function PriceTag({ priceCents, discountPercentage, className, compact = false }) {
  const discounted = Math.round(priceCents * (1 - (discountPercentage || 0) / 100));
  const onSale = Number(discountPercentage) > 0;
  const saved = priceCents - discounted;
  return (
    <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className || ''}`}>
      <span className="font-heading text-base font-bold text-[var(--text-strong)]">{formatMoney(discounted)}</span>
      {onSale ? (
        <>
          <span className="text-xs text-[var(--text-muted)] line-through">{formatMoney(priceCents)}</span>
          {!compact && (
            <>
              <Badge variant="discount">-{discountPercentage}%</Badge>
              <span className="text-xs font-semibold text-[var(--color-success-700)]">You save {formatMoney(saved)}</span>
            </>
          )}
        </>
      ) : null}
    </div>
  );
}

export { PriceTag };
export default PriceTag;
