import api from './api';

export interface Order {
  id: string;
  user_id: string;
  pharmacy_id: string;
  items: any[];
  total_amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  pharmacy?: { name: string };
}

class OrderService {
  async getOrders(): Promise<Order[]> {
    const response = await api.get('/orders');
    return response.data;
  }

  async getOrderById(orderId: string): Promise<Order> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  }

  async createOrder(orderData: any): Promise<Order> {
    const response = await api.post('/orders', orderData);
    return response.data;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  }
}

export default new OrderService();

