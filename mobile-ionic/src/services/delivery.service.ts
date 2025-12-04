import api from './api';

export interface Delivery {
  id: string;
  orderId: string;
  riderId: string;
  status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
  pickupAddress: string;
  deliveryAddress: string;
  fee: number;
  createdAt: string;
  order?: any;
  rider?: any;
}

class DeliveryService {
  async getAll(riderId?: string): Promise<Delivery[]> {
    const url = riderId ? `/deliveries?riderId=${riderId}` : '/deliveries';
    const response = await api.get(url);
    return response.data;
  }

  async getPending(): Promise<Delivery[]> {
    const response = await api.get('/deliveries/pending');
    return response.data;
  }

  async getEarnings(): Promise<any> {
    const response = await api.get('/deliveries/earnings');
    return response.data;
  }

  async getById(id: string): Promise<Delivery> {
    const response = await api.get(`/deliveries/${id}`);
    return response.data;
  }

  async assignRider(deliveryId: string, riderId: string): Promise<Delivery> {
    const response = await api.put(`/deliveries/${deliveryId}/assign`, { riderId });
    return response.data;
  }

  async updateStatus(deliveryId: string, status: string): Promise<Delivery> {
    const response = await api.put(`/deliveries/${deliveryId}/status`, { status });
    return response.data;
  }

  async rateDelivery(deliveryId: string, rating: number): Promise<any> {
    const response = await api.put(`/deliveries/${deliveryId}/rate`, { rating });
    return response.data;
  }
}

export default new DeliveryService();

