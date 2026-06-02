import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import CartDrawer from './components/cart/CartDrawer';
import ToastContainer from './components/common/Toast';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import ScrollToTop from './components/layout/ScrollToTop';
import AdminCategories from './pages/admin/AdminCategories';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import CategoryPage from './pages/CategoryPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import HelpCenterPage from './pages/HelpCenterPage';
import HomePage from './pages/HomePage';
import JournalPage from './pages/JournalPage';
import LegalPage from './pages/LegalPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductsPage from './pages/ProductsPage';
import ReturnsPage from './pages/ReturnsPage';
import ShippingPage from './pages/ShippingPage';
import SustainabilityPage from './pages/SustainabilityPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Public Routes */}
          <Route
            path="/*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />

                  {/* Company */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/sustainability" element={<SustainabilityPage />} />
                  <Route path="/journal" element={<JournalPage />} />
                  <Route path="/careers" element={<CareersPage />} />

                  {/* Support */}
                  <Route path="/support" element={<HelpCenterPage />} />
                  <Route path="/shipping" element={<ShippingPage />} />
                  <Route path="/returns" element={<ReturnsPage />} />
                  <Route path="/contact" element={<ContactPage />} />

                  {/* Legal */}
                  <Route path="/privacy" element={<LegalPage kind="privacy" />} />
                  <Route path="/terms" element={<LegalPage kind="terms" />} />

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
