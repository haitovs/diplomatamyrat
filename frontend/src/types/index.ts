export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  icon: string | null;
  sortOrder: number;
  _count?: { products: number };
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

export interface ProductHighlight {
  id: string;
  text: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  inStock: boolean;
  badge: string | null;
  category: Category;
  categoryId: string;
  images: ProductImage[];
  highlights?: ProductHighlight[];
  materials: string | null;
  leadTime: string | null;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  productId: string;
  quantity: number;
  variant: string | null;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  name: string;
  price: number;
  quantity: number;
  variant: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: string;
  billingAddress: string | null;
  paymentMethod: string;
  paymentStatus: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
