import api from './api';

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image_url?: string;
  pharmacy_id: string;
}

class MedicineService {
  async getAll(): Promise<Medicine[]> {
    const response = await api.get<Medicine[]>('/medicines');
    return response.data;
  }

  async getById(id: string): Promise<Medicine> {
    const response = await api.get<Medicine>(`/medicines/${id}`);
    return response.data;
  }

  async search(query: string): Promise<Medicine[]> {
    const response = await api.get<Medicine[]>(`/medicines/search?q=${query}`);
    return response.data;
  }

  async create(data: Partial<Medicine>): Promise<Medicine> {
    const response = await api.post<Medicine>('/medicines', data);
    return response.data;
  }

  async update(id: string, data: Partial<Medicine>): Promise<Medicine> {
    const response = await api.put<Medicine>(`/medicines/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/medicines/${id}`);
  }
}

export default new MedicineService();

