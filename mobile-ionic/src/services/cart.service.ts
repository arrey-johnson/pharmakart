import api from './api';

export interface CartItem {
  id: string;
  medicine_id: string;
  medicine_name: string;
  pharmacy_id: string;
  pharmacy_name: string;
  quantity: number;
  price: number;
}

class CartService {
  async getCartItems(userId: string): Promise<CartItem[]> {
    const response = await api.get(`/cart/${userId}`);
    return response.data;
  }

  async addToCart(medicineId: string, quantity: number): Promise<any> {
    const response = await api.post('/cart', { medicine_id: medicineId, quantity });
    return response.data;
  }

  async updateQuantity(itemId: string, quantity: number): Promise<any> {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  }

  async removeFromCart(itemId: string): Promise<any> {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  }

  async clearCart(userId: string): Promise<any> {
    const response = await api.delete(`/cart/user/${userId}`);
    return response.data;
  }
}

export default new CartService();

