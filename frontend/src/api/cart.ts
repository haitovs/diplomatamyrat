import type { Cart } from '../types';
import api from './client';

export async function getCart(): Promise<Cart> {
  const { data } = await api.get('/api/cart');
  return data;
}

export async function addToCart(productId: string, quantity = 1, variant?: string): Promise<void> {
  await api.post('/api/cart/items', { productId, quantity, variant });
}

export async function updateCartItem(itemId: string, quantity: number): Promise<void> {
  await api.patch(`/api/cart/items/${itemId}`, { quantity });
}

export async function removeFromCart(itemId: string): Promise<void> {
  await api.delete(`/api/cart/items/${itemId}`);
}

export async function clearCart(): Promise<void> {
  await api.delete('/api/cart');
}
