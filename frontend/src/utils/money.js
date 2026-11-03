export const formatMoney = (cents) => {
  const dollars = (cents || 0) / 100;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dollars);
};

export const formatCents = (cents) => `$${((cents || 0) / 100).toFixed(2)}`;
