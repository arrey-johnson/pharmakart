import api from './api';

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role: 'CLIENT' | 'PHARMACY' | 'RIDER' | 'ADMIN';
  };
  profile: any;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'CLIENT' | 'PHARMACY' | 'RIDER';
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    
    // Store token and user
    localStorage.setItem('auth_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  async register(data: RegisterData): Promise<any> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  async getProfile(): Promise<any> {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();

