import { Badge } from './Badge.jsx';

export default function StockBadge({ stock, className }) {
  if (stock === 0) return <Badge variant="danger" className={className}>Out of stock</Badge>;
  if (stock < 10) return <Badge variant="warning" className={className}>Only {stock} left</Badge>;
  return <Badge variant="success" className={className}>In stock</Badge>;
}
