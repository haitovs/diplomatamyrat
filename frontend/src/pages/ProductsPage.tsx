import { useQuery } from '@tanstack/react-query';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getProducts } from '../api/products';
import ProductCard from '../components/product/ProductCard';

export default function ProductsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'createdAt';

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', { category, search, sort }],
    queryFn: () => getProducts({ category, search, sort, limit: 50 }),
  });

  const handleCategoryChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('category', value);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    setSearchParams(newParams);
  };

  return (
    <div className="py-8 lg:py-12">
      <div className="container-narrow">
        {/* Header */}
        <div className="mb-8">
          <p className="eyebrow mb-2">{t('product.featured')}</p>
          <h1 className="section-title">
            {search ? `${t('common.search')}: "${search}"` : t('nav.allProducts')}
          </h1>
          {data && (
            <p className="text-stone-600 mt-2">
              Showing {data.products.length} of {data.total} products
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-stone-500" />
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="input py-2 pr-8"
              >
                <option value="">{t('categories.allCategories')}</option>
                {categoriesData?.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="input py-2 pr-8"
            >
              <option value="createdAt">Newest</option>
              <option value="name">Name A-Z</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-stone-200' : 'hover:bg-stone-100'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-stone-200' : 'hover:bg-stone-100'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-stone-200 rounded-xl mb-3" />
                <div className="h-3 bg-stone-200 rounded w-1/4 mb-2" />
                <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-stone-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : data?.products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-heading font-semibold text-stone-900 mb-2">
              {t('product.notFound')}
            </h3>
            <p className="text-stone-600">
              {t('product.notFoundDesc')}
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {data?.products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
