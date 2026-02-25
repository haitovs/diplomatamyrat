import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import LanguageSwitcher from '../common/LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const itemCount = useCartStore((s) => s.getItemCount());
  const { openCart, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { name: t('categories.kitchen'), slug: 'kitchen' },
    { name: t('categories.bathroom'), slug: 'bathroom' },
    { name: t('categories.living'), slug: 'living' },
    { name: t('categories.storage'), slug: 'storage' },
    { name: t('categories.laundry'), slug: 'laundry' },
    { name: t('categories.outdoor'), slug: 'outdoor' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
      {/* Announcement Bar */}
      <div className="bg-primary-600 text-white text-center py-2 px-4 text-sm">
        <p>{t('cart.freeShipping')} • {t('common.complimentaryGiftWrap')}</p>
      </div>

      {/* Main Header */}
      <div className="container-narrow">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <span className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center font-heading font-bold text-lg">
              H&H
            </span>
            <div className="hidden sm:block">
              <h1 className="font-heading font-semibold text-lg text-stone-900">Hearth & Home</h1>
              <p className="text-xs text-stone-500">{t('common.thoughtfulEssentials')}</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search')}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-300 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <LanguageSwitcher />
            <Link
              to="/favorites"
              className="p-2 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5 text-stone-600" />
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-stone-600" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-stone-100 transition-colors">
                  <User className="w-5 h-5 text-stone-600" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b border-stone-100">
                    <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-stone-500">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/orders" className="block px-3 py-2 text-sm hover:bg-stone-50 rounded">
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      {t('auth.logout')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                {t('auth.loginButton')}
              </Link>
            )}

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-stone-600" />
              ) : (
                <Menu className="w-5 h-5 text-stone-600" />
              )}
            </button>
          </div>
        </div>

        {/* Category Navigation - Desktop */}
        <nav className="hidden md:flex items-center justify-between py-3 border-t border-stone-100">
          <ul className="flex items-center gap-6">
            <li>
              <Link
                to="/products"
                className="text-sm font-medium text-stone-700 hover:text-primary-600 transition-colors"
              >
                {t('nav.allProducts')}
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  to={`/category/${cat.slug}`}
                  className="text-sm text-stone-600 hover:text-primary-600 transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-stone-200 shadow-lg animate-slide-up">
          <div className="p-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 text-sm"
                />
              </div>
            </form>

            {/* Mobile Nav Links */}
            <nav className="space-y-1">
              <Link
                to="/products"
                className="block px-4 py-3 rounded-lg text-stone-700 hover:bg-stone-50 font-medium"
                onClick={closeMobileMenu}
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="block px-4 py-3 rounded-lg text-stone-600 hover:bg-stone-50"
                  onClick={closeMobileMenu}
                >
                  {cat.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <hr className="my-2" />
                  <Link
                    to="/login"
                    className="block px-4 py-3 rounded-lg text-primary-600 hover:bg-primary-50 font-medium"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 rounded-lg bg-primary-600 text-white text-center font-medium"
                    onClick={closeMobileMenu}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
