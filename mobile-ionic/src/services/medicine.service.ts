import api from './api';

export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  description: string;
  price?: number;
  quantity?: number;
  image_url?: string;
  pharmacy_id?: string;
  categoryId?: string;
  dosage?: string;
  prescriptionRequired?: boolean;
  // From /medicines/available endpoint
  minPrice?: number;
  pharmacyCount?: number;
  pharmacies?: Array<{
    pharmacyId: string;
    pharmacyName: string;
    location?: string;
    price: number;
    stockQuantity: number;
  }>;
  pharmacy?: {
    id: string;
    name: string;
    location?: string;
  };
}

class MedicineService {
  // Get all medicines from real pharmacies (with pharmacy info)
  async getAll(): Promise<Medicine[]> {
    const response = await api.get<Medicine[]>('/medicines/available');
    return response.data;
  }
  
  // Get basic medicine list (without pharmacy details)
  async getAllBasic(): Promise<Medicine[]> {
    const response = await api.get<Medicine[]>('/medicines');
    return response.data;
  }

  async getById(id: string): Promise<Medicine> {
    const response = await api.get<Medicine>(`/medicines/${id}`);
    return response.data;
  }

  async search(query: string, categoryId?: string): Promise<Medicine[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (categoryId) params.append('categoryId', categoryId);
    
    const response = await api.get<Medicine[]>(`/medicines/available?${params.toString()}`);
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

  async getPharmacyOffers(medicineId: string): Promise<any[]> {
    const response = await api.get(`/medicines/${medicineId}/offers`);
    return response.data;
  }
}

export default new MedicineService();

