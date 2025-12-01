// Currency
export const CURRENCY = 'XAF'
export const CURRENCY_SYMBOL = 'FCFA'

// Format price in XAF
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString('fr-CM')} ${CURRENCY_SYMBOL}`
}

// Subdivisions
export const SUBDIVISIONS = [
  { value: 'DOUALA_I', label: 'Douala I' },
  { value: 'DOUALA_II', label: 'Douala II' },
  { value: 'DOUALA_III', label: 'Douala III' },
  { value: 'DOUALA_IV', label: 'Douala IV' },
  { value: 'DOUALA_V', label: 'Douala V' },
] as const

// Order Status Labels
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PHARMACY_CONFIRMATION: 'Pending Confirmation',
  REJECTED: 'Rejected',
  ACCEPTED: 'Accepted',
  PREPARED: 'Prepared',
  ASSIGNED_TO_RIDER: 'Assigned to Rider',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

// Order Status Colors (for badges)
export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING_PHARMACY_CONFIRMATION: 'bg-yellow-100 text-yellow-800',
  REJECTED: 'bg-red-100 text-red-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  PREPARED: 'bg-purple-100 text-purple-800',
  ASSIGNED_TO_RIDER: 'bg-indigo-100 text-indigo-800',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
}

// Payment Method Labels
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  MTN_MOMO: 'MTN Mobile Money',
  ORANGE_MONEY: 'Orange Money',
  CASH_ON_DELIVERY: 'Cash on Delivery',
}

// Payment Status Labels
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
}

// Delivery Status Labels
export const DELIVERY_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  ON_THE_WAY_TO_PHARMACY: 'On the way to pharmacy',
  PICKED_UP: 'Picked up',
  ON_THE_WAY_TO_CLIENT: 'On the way to you',
  DELIVERED: 'Delivered',
}

// User Role Labels
export const USER_ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrator',
  PHARMACY: 'Pharmacy',
  CLIENT: 'Customer',
  RIDER: 'Delivery Rider',
}

// Category Icons (Lucide icon names)
export const CATEGORY_ICONS: Record<string, string> = {
  'pain-fever': 'Thermometer',
  'cough-cold': 'Wind',
  'malaria': 'Bug',
  'hypertension': 'HeartPulse',
  'diabetes': 'Droplet',
  'baby-children': 'Baby',
  'vitamins-supplements': 'Pill',
  'antibiotics': 'Shield',
  'skin-care': 'Sparkles',
  'first-aid': 'Cross',
}

// Default delivery fees (in XAF)
export const DEFAULT_DELIVERY_FEES = {
  '0_5km': 800,
  '5_10km': 1200,
}

// Default commission percentage
export const DEFAULT_COMMISSION_PERCENTAGE = 2

// App Info
export const APP_NAME = 'PharmaKart'
export const APP_DESCRIPTION = 'Get genuine medicines from licensed pharmacies in Douala, delivered in 1–2 hours.'
export const APP_TAGLINE = 'Your trusted pharmacy marketplace'
