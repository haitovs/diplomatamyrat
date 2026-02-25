import type { AuthResponse, User } from '../types';
import api from './client';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post('/api/auth/register', data);
  return response.data;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await api.post('/api/auth/login', data);
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get('/api/auth/me');
  return response.data;
}

export function logout(): void {
  localStorage.removeItem('auth_token');
}
