export const formatMoney = (cents) => {
  const rupees = (cents || 0) / 100;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(rupees);
};

export const formatCents = (cents) => formatMoney(cents);
