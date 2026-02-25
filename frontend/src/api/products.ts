import type { Category, Product } from '../types';
import api from './client';

interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

interface ProductFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  const { data } = await api.get(`/api/products?${params}`);
  return data;
}

export async function getProduct(slug: string): Promise<Product> {
  const { data } = await api.get(`/api/products/${slug}`);
  return data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await api.get('/api/products/featured');
  return data;
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  const { data } = await api.get(`/api/products/${slug}/related`);
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get('/api/categories');
  return data;
}

export async function getCategory(slug: string): Promise<Category & { products: Product[] }> {
  const { data } = await api.get(`/api/categories/${slug}`);
  return data;
}
