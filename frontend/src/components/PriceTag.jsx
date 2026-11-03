import { formatMoney } from '../utils/money.js';

export default function PriceTag({ priceCents, discountPercentage, className }) {
  const discounted = Math.round(priceCents * (1 - (discountPercentage || 0) / 100));
  const onSale = discountPercentage && discountPercentage > 0;
  const saved = priceCents - discounted;
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <span className="font-semibold text-[var(--text-strong)]">{formatMoney(discounted)}</span>
      {onSale ? (
        <>
          <span className="text-xs text-[var(--color-gray-500)] line-through">{formatMoney(priceCents)}</span>
          <Badge variant="discount">-{discountPercentage}%</Badge>
          <span className="text-xs text-[var(--color-success-700)] font-semibold">You save {formatMoney(saved)}</span>
        </>
      ) : null}
    </div>
  );
}
