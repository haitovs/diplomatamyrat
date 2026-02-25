import type { Order } from '../types';
import api from './client';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
  phone: string;
}

interface CreateOrderData {
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  notes?: string;
}

export async function getOrders(): Promise<Order[]> {
  const { data } = await api.get('/api/orders');
  return data;
}

export async function getOrder(id: string): Promise<Order> {
  const { data } = await api.get(`/api/orders/${id}`);
  return data;
}

export async function createOrder(data: CreateOrderData): Promise<Order> {
  const response = await api.post('/api/orders', data);
  return response.data;
}

export async function cancelOrder(id: string): Promise<Order> {
  const { data } = await api.patch(`/api/orders/${id}/cancel`);
  return data;
}
