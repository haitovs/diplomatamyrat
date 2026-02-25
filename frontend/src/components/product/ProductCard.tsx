import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/currency';
import { getImageUrl } from '../../utils/format';
import { showToast } from '../common/Toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    showToast(`${product.name} added to cart`, 'success');
    openCart();
  };

  const imageUrl = getImageUrl(product.images?.[0]?.url);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 mb-3">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/e7e5e4/78716c?text=Product';
            }}
          />

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 badge badge-primary">
              {product.badge}
            </span>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // TODO: Add to favorites
            }}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
          >
            <Heart className="w-4 h-4 text-stone-600" />
          </button>

          {/* Quick Add */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className="w-full btn btn-primary btn-md shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              {t('common.addToCart')}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-stone-500 uppercase tracking-wide">
            {product.category?.name}
          </p>
          <h3 className="font-medium text-stone-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-stone-600 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-900">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-stone-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            {product.rating > 0 && (
              <div className="flex items-center gap-1 text-sm text-stone-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
