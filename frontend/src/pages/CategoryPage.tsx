import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { getCategory } from '../api/products';
import ProductCard from '../components/product/ProductCard';

export default function CategoryPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();

  const { data: category, isLoading, error } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => getCategory(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container-narrow py-12">
        <div className="animate-pulse">
          <div className="h-4 bg-stone-200 rounded w-1/4 mb-4" />
          <div className="h-10 bg-stone-200 rounded w-1/2 mb-4" />
          <div className="h-6 bg-stone-200 rounded w-3/4 mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="aspect-square bg-stone-200 rounded-xl mb-3" />
                <div className="h-4 bg-stone-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container-narrow py-12 text-center">
        <h1 className="text-2xl font-heading font-semibold mb-4">{t('categories.notFound')}</h1>
        <p className="text-stone-600 mb-6">{t('categories.notFoundDesc')}</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          {t('categories.browseAll')}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container-narrow">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-primary-600"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('nav.allProducts')}
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <p className="eyebrow mb-2">{t('home.shopByRoom')}</p>
          <h1 className="section-title mb-4">{t(`categories.${slug}`, { defaultValue: category.name })}</h1>
          <p className="text-lg text-stone-600 max-w-2xl">
            {t(`categories.${slug}LongDesc`, { defaultValue: category.description || '' })}
          </p>
        </header>

        {/* Products Grid */}
        {category.products.length === 0 ? (
          <div className="text-center py-16 bg-stone-50 rounded-xl">
            <h3 className="text-xl font-heading font-semibold text-stone-900 mb-2">
              {t('categories.comingSoon')}
            </h3>
            <p className="text-stone-600 mb-6">
              {t('categories.comingSoonDesc')}
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              {t('categories.browseOther')}
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-stone-500 mb-6">
              {t('categories.productCount', { count: category.products.length })}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
