// Currency - Matching Web App
export const CURRENCY_SYMBOL = 'FCFA';

// Format price in XAF (Central African Franc)
export function formatPrice(amount: number | undefined | null): string {
  if (!amount && amount !== 0) return '0 FCFA';
  return `${amount.toLocaleString('fr-CM')} ${CURRENCY_SYMBOL}`;
}

// Example: 2500 → "2,500 FCFA"
// Example: 15000 → "15,000 FCFA"

