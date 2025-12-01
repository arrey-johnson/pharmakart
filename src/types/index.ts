// User Roles
export type UserRole = 'ADMIN' | 'PHARMACY' | 'CLIENT' | 'RIDER'

// Order Statuses
export type OrderStatus = 
  | 'PENDING_PHARMACY_CONFIRMATION'
  | 'REJECTED'
  | 'ACCEPTED'
  | 'PREPARED'
  | 'ASSIGNED_TO_RIDER'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'

// Payment Statuses
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

// Payment Methods
export type PaymentMethod = 'MTN_MOMO' | 'ORANGE_MONEY' | 'CASH_ON_DELIVERY'

// Prescription Status
export type PrescriptionStatus = 'UPLOADED' | 'VERIFIED' | 'REJECTED'

// Delivery Status
export type DeliveryStatus = 
  | 'PENDING'
  | 'ON_THE_WAY_TO_PHARMACY'
  | 'PICKED_UP'
  | 'ON_THE_WAY_TO_CLIENT'
  | 'DELIVERED'

// Rider Status
export type RiderStatus = 'ACTIVE' | 'INACTIVE'

// Douala Subdivisions
export type Subdivision = 'DOUALA_I' | 'DOUALA_II' | 'DOUALA_III' | 'DOUALA_IV' | 'DOUALA_V'

// Base User
export interface User {
  id: string
  email: string
  phone: string | null
  name: string
  role: UserRole
  created_at: string
  updated_at: string
}

// Pharmacy
export interface Pharmacy {
  id: string
  user_id: string
  name: string
  logo_url: string | null
  address: string
  subdivision: Subdivision
  latitude: number | null
  longitude: number | null
  opening_hours: string | null
  is_verified: boolean
  rating: number
  total_reviews: number
  created_at: string
  updated_at: string
}

// Rider Profile
export interface Rider {
  id: string
  user_id: string
  status: RiderStatus
  vehicle_type: string | null
  license_number: string | null
  current_latitude: number | null
  current_longitude: number | null
  total_deliveries: number
  rating: number
  created_at: string
  updated_at: string
}

// Client Profile
export interface ClientProfile {
  id: string
  user_id: string
  default_address: string | null
  city: string | null
  subdivision: Subdivision | null
  language: 'EN' | 'FR'
  created_at: string
  updated_at: string
}

// Medicine (Global Catalog)
export interface Medicine {
  id: string
  name: string
  generic_name: string | null
  category: string
  description: string | null
  image_url: string | null
  prescription_required: boolean
  created_at: string
  updated_at: string
}

// Pharmacy Medicine (Inventory)
export interface PharmacyMedicine {
  id: string
  pharmacy_id: string
  medicine_id: string
  price: number
  stock_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined data
  medicine?: Medicine
  pharmacy?: Pharmacy
}

// Order
export interface Order {
  id: string
  client_id: string
  pharmacy_id: string
  delivery_address: string
  subdivision: Subdivision
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method: PaymentMethod
  subtotal: number
  delivery_fee: number
  commission_amount: number
  total_amount: number
  notes: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
  // Joined data
  client?: User
  pharmacy?: Pharmacy
  items?: OrderItem[]
  delivery?: Delivery
}

// Order Item
export interface OrderItem {
  id: string
  order_id: string
  pharmacy_medicine_id: string
  quantity: number
  unit_price: number
  subtotal: number
  // Joined data
  pharmacy_medicine?: PharmacyMedicine
}

// Prescription
export interface Prescription {
  id: string
  order_id: string | null
  client_id: string
  file_url: string
  status: PrescriptionStatus
  pharmacist_notes: string | null
  created_at: string
  updated_at: string
}

// Delivery
export interface Delivery {
  id: string
  order_id: string
  rider_id: string | null
  status: DeliveryStatus
  pickup_time: string | null
  delivered_time: string | null
  rider_fee: number
  rider_rating: number | null
  client_notes: string | null
  created_at: string
  updated_at: string
  // Joined data
  rider?: Rider
  order?: Order
}

// Payment
export interface Payment {
  id: string
  order_id: string
  amount: number
  method: PaymentMethod
  transaction_reference: string | null
  status: PaymentStatus
  created_at: string
}

// Cart Item (Local/Client-side)
export interface CartItem {
  pharmacy_medicine_id: string
  pharmacy_id: string
  medicine_id: string
  medicine_name: string
  pharmacy_name: string
  price: number
  quantity: number
  image_url: string | null
  prescription_required: boolean
}

// Medicine Category
export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string | null
}

// Settings
export interface PlatformSettings {
  id: string
  commission_percentage: number
  delivery_fee_0_5km: number
  delivery_fee_5_10km: number
  rider_fee_per_delivery: number
  updated_at: string
}
