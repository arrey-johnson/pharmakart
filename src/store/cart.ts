import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (pharmacyMedicineId: string) => void
  updateQuantity: (pharmacyMedicineId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getPharmacyId: () => string | null
  hasItemsRequiringPrescription: () => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get()
        
        // Check if adding from a different pharmacy
        if (items.length > 0 && items[0].pharmacy_id !== item.pharmacy_id) {
          // Clear cart and add new item (or could throw error/show warning)
          set({ items: [item] })
          return
        }
        
        // Check if item already exists
        const existingIndex = items.findIndex(
          (i) => i.pharmacy_medicine_id === item.pharmacy_medicine_id
        )
        
        if (existingIndex > -1) {
          // Update quantity
          const newItems = [...items]
          newItems[existingIndex].quantity += item.quantity
          set({ items: newItems })
        } else {
          // Add new item
          set({ items: [...items, item] })
        }
      },
      
      removeItem: (pharmacyMedicineId) => {
        set({
          items: get().items.filter(
            (item) => item.pharmacy_medicine_id !== pharmacyMedicineId
          ),
        })
      },
      
      updateQuantity: (pharmacyMedicineId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(pharmacyMedicineId)
          return
        }
        
        set({
          items: get().items.map((item) =>
            item.pharmacy_medicine_id === pharmacyMedicineId
              ? { ...item, quantity }
              : item
          ),
        })
      },
      
      clearCart: () => set({ items: [] }),
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
      
      getPharmacyId: () => {
        const { items } = get()
        return items.length > 0 ? items[0].pharmacy_id : null
      },
      
      hasItemsRequiringPrescription: () => {
        return get().items.some((item) => item.prescription_required)
      },
    }),
    {
      name: 'pharmakart-cart',
    }
  )
)
