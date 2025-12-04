import api from './api';

class AdminService {
  async getOverview(): Promise<any> {
    const response = await api.get('/admin/overview');
    return response.data;
  }

  async getUsers(): Promise<any[]> {
    const response = await api.get('/admin/users');
    return response.data;
  }

  async getPharmacies(): Promise<any[]> {
    const response = await api.get('/admin/pharmacies');
    return response.data;
  }

  async getRiders(): Promise<any[]> {
    const response = await api.get('/admin/riders');
    return response.data;
  }

  async getOrders(): Promise<any[]> {
    const response = await api.get('/admin/orders');
    return response.data;
  }

  async getSettings(): Promise<any> {
    const response = await api.get('/admin/settings');
    return response.data;
  }

  async updateSettings(settings: any): Promise<any> {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  }

  async verifyRider(riderId: string): Promise<any> {
    const response = await api.put(`/admin/riders/${riderId}/verify`);
    return response.data;
  }
}

export default new AdminService();

