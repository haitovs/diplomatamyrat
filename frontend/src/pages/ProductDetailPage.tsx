import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Heart, Shield, ShoppingBag, Star, Truck } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { getProduct, getRelatedProducts } from '../api/products';
import ProductCard from '../components/product/ProductCard';
import { useProductTranslation, useCategoryTranslation } from '../hooks/useProductTranslation';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { formatPrice } from '../utils/currency';
import { getImageUrl } from '../utils/format';

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug!),
    enabled: !!slug,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', slug],
    queryFn: () => getRelatedProducts(slug!),
    enabled: !!slug,
  });

  const tp = useProductTranslation(product);
  const translateCategory = useCategoryTranslation();

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    openCart();
  };

  if (isLoading) {
    return (
      <div className="container-narrow py-12">
        <div className="animate-pulse grid lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-stone-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-4 bg-stone-200 rounded w-1/4" />
            <div className="h-8 bg-stone-200 rounded w-3/4" />
            <div className="h-6 bg-stone-200 rounded w-1/4" />
            <div className="h-20 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-narrow py-12 text-center">
        <h1 className="text-2xl font-heading font-semibold mb-4">{t('product.notFound')}</h1>
        <p className="text-stone-600 mb-6">{t('product.notFoundDesc')}</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          {t('common.browseProducts')}
        </Link>
      </div>
    );
  }

  const mainImage = getImageUrl(product.images?.[selectedImage]?.url);

  return (
    <div className="py-8 lg:py-12">
      <div className="container-narrow">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-primary-600"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('product.backToProducts')}
          </Link>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-stone-100 rounded-2xl overflow-hidden"
            >
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/e7e5e4/78716c?text=Product';
                }}
              />
            </motion.div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={getImageUrl(image.url)}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/e7e5e4/78716c?text=+';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-4">
              <Link
                to={`/category/${product.category?.slug}`}
                className="text-sm text-primary-600 hover:text-primary-700 uppercase tracking-wide"
              >
                {translateCategory(product.category?.slug, product.category?.name || '')}
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-bold text-stone-900 mb-4">
              {tp.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-stone-600">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-stone-900">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xl text-stone-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {product.badge && (
                <span className="badge badge-primary">{tp.badge}</span>
              )}
            </div>

            <p className="text-stone-600 mb-6">{tp.description}</p>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-stone-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-stone-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-stone-50"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-xl flex-1"
              >
                <ShoppingBag className="w-5 h-5" />
                {t('common.addToCart')}
              </button>

              <button className="btn btn-outline p-3">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="flex items-center gap-6 py-4 border-y border-stone-200 mb-6">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Truck className="w-4 h-4" />
                <span>{tp.leadTime || t('leadTimes.ships_within_24_hours')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Shield className="w-4 h-4" />
                <span>{t('product.thirtyDayReturns')}</span>
              </div>
            </div>

            {/* Highlights */}
            {tp.highlights.length > 0 && (
              <div className="mb-6">
                <h3 className="font-heading font-semibold text-stone-900 mb-3">{t('product.highlights')}</h3>
                <ul className="space-y-2">
                  {tp.highlights.map((text, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-stone-600">
                      <Check className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specs */}
            {product.materials && (
              <div className="bg-stone-50 rounded-lg p-4">
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-stone-500">{t('product.materials')}</dt>
                    <dd className="font-medium text-stone-900">{tp.materials}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">SKU</dt>
                    <dd className="font-medium text-stone-900">{product.sku}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-stone-200">
            <h2 className="section-title mb-8">{t('home.youMightLike')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
