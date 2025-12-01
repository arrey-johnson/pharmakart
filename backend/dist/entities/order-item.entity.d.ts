import { Order } from './order.entity';
import { PharmacyMedicine } from './pharmacy-medicine.entity';
export declare class OrderItem {
    id: string;
    orderId: string;
    order: Order;
    pharmacyMedicineId: string;
    pharmacyMedicine: PharmacyMedicine;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}
