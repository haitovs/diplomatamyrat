import api from './client';

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: any[];
  topProducts: any[];
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  badge: string | null;
  materials: string | null;
  leadTime: string | null;
  categoryId: string;
  category: { name: string; slug: string };
  images: { url: string }[];
  isFeatured: boolean;
  isActive: boolean;
  _count: { orderItems: number; reviews: number };
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  user: { firstName: string; lastName: string; email: string };
  items: any[];
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  _count: { orders: number };
}

export async function getAdminStats(): Promise<DashboardStats> {
  const { data } = await api.get('/api/admin/stats');
  return data;
}

export async function getAdminProducts(params: { page?: number; limit?: number; search?: string } = {}) {
  const { data } = await api.get('/api/admin/products', { params });
  return data as { products: AdminProduct[]; total: number };
}

export async function createProduct(product: Partial<AdminProduct>) {
  const { data } = await api.post('/api/admin/products', product);
  return data;
}

export async function updateProduct(id: string, product: Partial<AdminProduct>) {
  const { data } = await api.put(`/api/admin/products/${id}`, product);
  return data;
}

export async function deleteProduct(id: string) {
  await api.delete(`/api/admin/products/${id}`);
}

export async function getAdminCategories() {
  const { data } = await api.get('/api/admin/categories');
  return data;
}

export async function createCategory(category: any) {
  const { data } = await api.post('/api/admin/categories', category);
  return data;
}

export async function updateCategory(id: string, category: any) {
  const { data } = await api.put(`/api/admin/categories/${id}`, category);
  return data;
}

export async function deleteCategory(id: string) {
  await api.delete(`/api/admin/categories/${id}`);
}

export async function getAdminOrders(params: { page?: number; status?: string } = {}) {
  const { data } = await api.get('/api/admin/orders', { params });
  return data as { orders: AdminOrder[]; total: number };
}

export async function updateOrderStatus(id: string, status: string) {
  const { data } = await api.put(`/api/admin/orders/${id}/status`, { status });
  return data;
}

export async function getAdminUsers(params: { page?: number; search?: string } = {}) {
  const { data } = await api.get('/api/admin/users', { params });
  return data as { users: AdminUser[]; total: number };
}

// Image Upload Functions
export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string;
  sortOrder: number;
}

export async function uploadProductImage(productId: string, file: File, alt?: string): Promise<ProductImage> {
  const formData = new FormData();
  formData.append('image', file);
  if (alt) formData.append('alt', alt);
  
  // Don't set Content-Type header - let axios set it with the correct boundary
  const { data } = await api.post(`/api/upload/products/${productId}/images`, formData);
  return data;
}

export async function uploadProductImages(productId: string, files: FileList | File[]): Promise<ProductImage[]> {
  const formData = new FormData();
  const fileArray = Array.from(files);
  
  console.log('Uploading files:', fileArray.length);
  fileArray.forEach((file, index) => {
    console.log(`File ${index}:`, file.name, file.type, file.size);
    formData.append('images', file);
  });
  
  // Log FormData contents
  console.log('FormData entries:');
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
  
  // DO NOT set Content-Type - browser must set it with correct boundary for multipart
  const { data } = await api.post(`/api/upload/products/${productId}/images/batch`, formData, {
    headers: {
      // Explicitly delete Content-Type so browser can set it with boundary
      'Content-Type': undefined as unknown as string,
    },
  });
  return data;
}

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const { data } = await api.get(`/api/upload/products/${productId}/images`);
  return data;
}

export async function deleteProductImage(imageId: string): Promise<void> {
  await api.delete(`/api/upload/images/${imageId}`);
}

export async function setProductImagePrimary(productId: string, imageId: string): Promise<ProductImage> {
  const { data } = await api.post(`/api/upload/products/${productId}/images/${imageId}/primary`);
  return data;
}

