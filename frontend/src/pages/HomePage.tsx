import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, MessageCircle, Star, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../api/products';
import ProductCard from '../components/product/ProductCard';



export default function HomePage() {
  const { t } = useTranslation();
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: getFeaturedProducts,
  });

  const categories = [
    { name: t('categories.kitchen'), slug: 'kitchen', description: t('categories.kitchenDesc'), color: 'from-amber-500 to-orange-600' },
    { name: t('categories.bathroom'), slug: 'bathroom', description: t('categories.bathroomDesc'), color: 'from-cyan-500 to-blue-600' },
    { name: t('categories.living'), slug: 'living', description: t('categories.livingDesc'), color: 'from-emerald-500 to-teal-600' },
    { name: t('categories.storage'), slug: 'storage', description: t('categories.storageDesc'), color: 'from-violet-500 to-purple-600' },
    { name: t('categories.laundry'), slug: 'laundry', description: t('categories.laundryDesc'), color: 'from-pink-500 to-rose-600' },
    { name: t('categories.outdoor'), slug: 'outdoor', description: t('categories.outdoorDesc'), color: 'from-lime-500 to-green-600' },
  ];

  const benefits = [
    { icon: Truck, title: t('home.freeShipping'), description: t('home.freeShippingDesc') },
    { icon: Leaf, title: t('home.sustainablySourced'), description: t('home.sustainablySourcedDesc') },
    { icon: MessageCircle, title: t('home.designConcierge'), description: t('home.designConciergeDesc') },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-stone-100 via-stone-50 to-primary-50 overflow-hidden">
        <div className="container-narrow py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="eyebrow mb-4">{t('home.springRefresh')}</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-stone-900 leading-tight mb-6">
                {t('home.heroTitle')}
              </h1>
              <p className="text-lg text-stone-600 mb-8 max-w-xl">
                {t('home.heroDesc')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn btn-primary btn-xl">
                  {t('home.shopCollection')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/about" className="btn btn-outline btn-xl">
                  {t('home.ourStory')}
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-stone-200">
                <div>
                  <p className="text-3xl font-heading font-bold text-stone-900">2,500+</p>
                  <p className="text-sm text-stone-500">{t('home.fiveStarReviews')}</p>
                </div>
                <div>
                  <p className="text-3xl font-heading font-bold text-stone-900">48 hr</p>
                  <p className="text-sm text-stone-500">{t('home.averageDelivery')}</p>
                </div>
                <div>
                  <p className="text-3xl font-heading font-bold text-stone-900">95%</p>
                  <p className="text-sm text-stone-500">{t('home.sustainableMaterials')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-primary-200 to-primary-300 overflow-hidden">
                    <img
                      src="/images/kitchen/hero.jpg"
                      alt="Kitchen essentials"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent-200 to-accent-300 overflow-hidden">
                    <img
                      src="/images/living/hero.jpg"
                      alt="Living room decor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-stone-200 to-stone-300 overflow-hidden">
                    <img
                      src="/images/bath/hero.jpg"
                      alt="Bathroom spa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-amber-200 to-amber-300 overflow-hidden">
                    <img
                      src="/images/storage/hero.jpg"
                      alt="Storage solutions"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-20">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="eyebrow mb-2">{t('home.shopByRoom')}</p>
            <h2 className="section-title">{t('home.curatedForEvery')}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={`/category/${cat.slug}`}
                  className="group block relative aspect-[4/5] rounded-xl overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90`} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <h3 className="font-heading font-semibold text-lg mb-1">{cat.name}</h3>
                    <p className="text-sm text-white/80">{cat.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="py-12 bg-stone-100">
        <div className="container-narrow">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center shrink-0">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-stone-900">{benefit.title}</h3>
                  <p className="text-sm text-stone-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-20">
        <div className="container-narrow">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="eyebrow mb-2">{t('home.curatedSelection')}</p>
              <h2 className="section-title">{t('home.featuredProducts')}</h2>
            </div>
            <Link to="/products" className="btn btn-outline btn-md hidden sm:flex">
              {t('home.viewAll')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-stone-200 rounded-xl mb-3" />
                  <div className="h-3 bg-stone-200 rounded w-1/4 mb-2" />
                  <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link to="/products" className="btn btn-outline btn-lg">
              {t('home.viewAllProducts')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20 bg-primary-50">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="eyebrow mb-2">{t('home.lovedByHouseholds')}</p>
            <h2 className="section-title">{t('home.customerTestimonials')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: t('home.testimonial1Quote'),
                name: t('home.testimonial1Name'),
                location: t('home.testimonial1Location'),
              },
              {
                quote: t('home.testimonial2Quote'),
                name: t('home.testimonial2Name'),
                location: t('home.testimonial2Location'),
              },
              {
                quote: t('home.testimonial3Quote'),
                name: t('home.testimonial3Name'),
                location: t('home.testimonial3Location'),
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-stone-700 mb-4">"{testimonial.quote}"</blockquote>
                <div className="text-sm">
                  <p className="font-medium text-stone-900">{testimonial.name}</p>
                  <p className="text-stone-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 lg:py-20">
        <div className="container-narrow">
          <div className="max-w-2xl mx-auto text-center">
            <p className="eyebrow mb-2">{t('home.stayInLoop')}</p>
            <h2 className="section-title mb-4">{t('home.newsletterDesc')}</h2>
            <p className="text-stone-600 mb-8">
              {t('home.newsletterLongDesc')}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('home.emailPlaceholder')}
                className="input flex-1"
              />
              <button type="submit" className="btn btn-primary btn-lg shrink-0">
                {t('home.joinList')}
              </button>
            </form>
            <p className="text-xs text-stone-500 mt-4">
              {t('home.newsletterDisclaimer')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
