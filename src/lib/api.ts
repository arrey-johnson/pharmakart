const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ access_token: string; user: any; profile: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: string;
    pharmacyName?: string;
    pharmacyAddress?: string;
    subdivision?: string;
    vehicleType?: string;
  }) {
    const data = await this.request<{ access_token: string; user: any; profile: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setToken(data.access_token);
    return data;
  }

  async getProfile() {
    return this.request<{ user: any; profile: any }>('/auth/profile');
  }

  async updateProfile(data: { name?: string; phone?: string; address?: string; subdivision?: string }) {
    return this.request<{ user: any; profile: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async deleteAccount(password: string) {
    return this.request<{ message: string }>('/auth/account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  }

  logout() {
    this.setToken(null);
  }

  // Categories
  async getCategories() {
    return this.request<any[]>('/categories');
  }

  async seedCategories() {
    return this.request('/categories/seed', { method: 'POST' });
  }

  // Medicines
  async getMedicines(categoryId?: string) {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return this.request<any[]>(`/medicines${query}`);
  }

  async searchMedicines(query: string) {
    return this.request<any[]>(`/medicines/search?q=${encodeURIComponent(query)}`);
  }

  async getMedicine(id: string) {
    return this.request<any>(`/medicines/${id}`);
  }

  async getMedicineOffers(id: string) {
    return this.request<any[]>(`/medicines/${id}/offers`);
  }

  async searchAvailableMedicines(query?: string, categoryId?: string) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (categoryId) params.append('categoryId', categoryId);
    const queryString = params.toString();
    return this.request<{
      id: string;
      name: string;
      genericName: string;
      category: string;
      categoryId: string;
      prescriptionRequired: boolean;
      dosage: string;
      minPrice: number;
      pharmacyCount: number;
    }[]>(`/medicines/available${queryString ? `?${queryString}` : ''}`);
  }

  async seedMedicines() {
    return this.request('/medicines/seed', { method: 'POST' });
  }

  // Pharmacies
  async getPharmacies(verified = true) {
    return this.request<any[]>(`/pharmacies?verified=${verified}`);
  }

  async getAllPharmacies() {
    return this.request<any[]>(`/pharmacies?verified=false`);
  }

  async getPharmacy(id: string) {
    return this.request<any>(`/pharmacies/${id}`);
  }

  async verifyPharmacy(id: string) {
    return this.request<any>(`/pharmacies/${id}/verify`, { method: 'PUT' });
  }

  async getPharmacyInventory(id: string) {
    return this.request<any[]>(`/pharmacies/${id}/inventory`);
  }

  async getPharmacyStats(id: string) {
    return this.request<{
      todayOrders: number;
      todayRevenue: number;
      pendingOrders: number;
      completedOrders: number;
    }>(`/pharmacies/${id}/stats`);
  }

  async getPharmacyLowStock(id: string, threshold = 10) {
    return this.request<any[]>(`/pharmacies/${id}/low-stock?threshold=${threshold}`);
  }

  async updateInventoryStock(itemId: string, stockQuantity: number) {
    return this.request<any>(`/pharmacies/inventory/${itemId}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ stockQuantity }),
    });
  }

  async addPharmacyMedicine(pharmacyId: string, data: { medicineId: string; price: number; stockQuantity: number }) {
    return this.request<any>(`/pharmacies/${pharmacyId}/inventory`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createMedicineAndAdd(
    pharmacyId: string,
    data: {
      medicine: {
        name: string;
        genericName?: string;
        categoryId?: string;
        description?: string;
        dosage?: string;
        packaging?: string;
        prescriptionRequired?: boolean;
      };
      price: number;
      stockQuantity: number;
    }
  ) {
    return this.request<any>(`/pharmacies/${pharmacyId}/inventory/create`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInventoryItem(itemId: string) {
    return this.request<any>(`/pharmacies/inventory/${itemId}`);
  }

  async updateInventoryItem(
    itemId: string,
    data: {
      medicine: {
        name?: string;
        genericName?: string;
        categoryId?: string;
        description?: string;
        dosage?: string;
        packaging?: string;
        prescriptionRequired?: boolean;
      };
      price?: number;
      stockQuantity?: number;
    }
  ) {
    return this.request<any>(`/pharmacies/inventory/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Orders
  async createOrder(orderData: {
    pharmacyId: string;
    deliveryAddress: string;
    subdivision: string;
    paymentMethod: string;
    clientPhone: string;
    notes?: string;
    items: { pharmacyMedicineId: string; quantity: number }[];
  }) {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(status?: string, pharmacyId?: string) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (pharmacyId) params.append('pharmacyId', pharmacyId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/orders${query}`);
  }

  async getOrder(id: string) {
    return this.request<any>(`/orders/${id}`);
  }

  async getOrderItems(id: string) {
    return this.request<any[]>(`/orders/${id}/items`);
  }

  async updateOrderStatus(id: string, status: string, rejectionReason?: string) {
    return this.request<any>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, rejectionReason }),
    });
  }

  // Deliveries
  async getDeliveries(riderId?: string) {
    const query = riderId ? `?riderId=${riderId}` : '';
    return this.request<any[]>(`/deliveries${query}`);
  }

  async getPendingDeliveries() {
    return this.request<any[]>('/deliveries/pending');
  }

  async assignRider(deliveryId: string, riderId: string) {
    return this.request<any>(`/deliveries/${deliveryId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ riderId }),
    });
  }

  async updateDeliveryStatus(id: string, status: string) {
    return this.request<any>(`/deliveries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getRiderEarnings() {
    return this.request<{ totalEarnings: number; totalDeliveries: number; deliveries: any[] }>('/deliveries/earnings');
  }

  // Withdrawals
  async getPharmacyEarnings(pharmacyId: string) {
    return this.request<{
      totalEarnings: number;
      totalWithdrawn: number;
      pendingAmount: number;
      availableBalance: number;
      totalOrders: number;
    }>(`/withdrawals/earnings/${pharmacyId}`);
  }

  async requestWithdrawal(data: {
    pharmacyId: string;
    amount: number;
    method: 'MTN_MOMO' | 'ORANGE_MONEY' | 'BANK_TRANSFER';
    accountNumber: string;
    accountName?: string;
    bankName?: string;
  }) {
    return this.request<any>('/withdrawals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPharmacyWithdrawals(pharmacyId: string) {
    return this.request<any[]>(`/withdrawals/pharmacy/${pharmacyId}`);
  }

  // Admin
  async getAdminOverview() {
    return this.request<{
      stats: {
        totalUsers: number;
        totalPharmacies: number;
        totalRiders: number;
        totalOrders: number;
        monthlyRevenue: number;
        pendingVerifications: number;
      };
      recentOrders: {
        id: string;
        customerName: string;
        pharmacyName: string;
        total: number;
        status: string;
        createdAt: string;
      }[];
      pendingVerifications: {
        id: string;
        type: 'PHARMACY' | 'RIDER';
        name: string;
        createdAt: string;
      }[];
    }>(`/admin/overview`);
  }

  async getAdminUsers() {
    return this.request<any[]>(`/admin/users`);
  }

  async getAdminPharmacies() {
    return this.request<any[]>(`/admin/pharmacies`);
  }

  async getAdminRiders() {
    return this.request<any[]>(`/admin/riders`);
  }

  async verifyRider(id: string) {
    return this.request<any>(`/admin/riders/${id}/verify`, { method: 'PUT' });
  }

  async getAdminOrders() {
    return this.request<any[]>(`/admin/orders`);
  }

  async getAdminSettings() {
    return this.request<{
      id: string;
      defaultDeliveryFeeNear: number;
      defaultDeliveryFeeFar: number;
      commissionPercentage: number;
    }>(`/admin/settings`);
  }

  async updateAdminSettings(data: {
    defaultDeliveryFeeNear?: number;
    defaultDeliveryFeeFar?: number;
    commissionPercentage?: number;
  }) {
    return this.request(`/admin/settings`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
