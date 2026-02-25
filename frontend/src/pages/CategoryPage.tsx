import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getCategory } from '../api/products';
import ProductCard from '../components/product/ProductCard';

const categoryDescriptions: Record<string, string> = {
  kitchen: 'Cookware, serveware, and tools designed to celebrate everyday meals and elevate your culinary experience.',
  bathroom: 'Plush textures, aromatics, and rituals for your self-care sanctuary. Transform your bathroom into a spa.',
  living: 'Warm lighting, purposeful decor, and lounge-ready textiles for every gathering and quiet moment.',
  storage: 'Smart organization that calms the chaos and keeps essentials within reach. Declutter with style.',
  laundry: 'Care rituals that leave linens fresh, folded, and ready for rotation. Make laundry day enjoyable.',
  outdoor: 'Weather-ready accents for patio hangs, impromptu picnics, and golden hour dining under the stars.',
};

export default function CategoryPage() {
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
        <h1 className="text-2xl font-heading font-semibold mb-4">Category Not Found</h1>
        <p className="text-stone-600 mb-6">The category you're looking for doesn't exist.</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Browse All Products
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
            All Products
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <p className="eyebrow mb-2">Shop by Room</p>
          <h1 className="section-title mb-4">{category.name}</h1>
          <p className="text-lg text-stone-600 max-w-2xl">
            {category.description || categoryDescriptions[slug!] || 'Explore our curated collection.'}
          </p>
        </header>

        {/* Products Grid */}
        {category.products.length === 0 ? (
          <div className="text-center py-16 bg-stone-50 rounded-xl">
            <h3 className="text-xl font-heading font-semibold text-stone-900 mb-2">
              Coming Soon
            </h3>
            <p className="text-stone-600 mb-6">
              We're curating the perfect products for this category.
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Browse Other Products
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-stone-500 mb-6">
              {category.products.length} products
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
