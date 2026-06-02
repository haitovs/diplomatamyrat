import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  variant?: 'primary' | 'accent';
  icon?: LucideIcon;
}

/**
 * Shared hero band for content pages (About, Contact, Legal, etc.).
 * Mirrors the HomePage hero aesthetic: warm gradient, Playfair heading,
 * soft decorative blur. Mobile-first padding.
 */
export default function PageHero({ eyebrow, title, subtitle, variant = 'primary', icon: Icon }: PageHeroProps) {
  const bg =
    variant === 'accent'
      ? 'from-accent-100 via-stone-50 to-accent-50'
      : 'from-stone-100 via-stone-50 to-primary-50';
  const blob = variant === 'accent' ? 'bg-accent-300/30' : 'bg-primary-300/30';

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${bg}`}>
      <div className={`pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full ${blob} blur-3xl`} aria-hidden />
      <div className="container-narrow relative py-12 sm:py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          {Icon && (
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/70 text-primary-600 shadow-sm ring-1 ring-stone-200/60">
              <Icon className="h-6 w-6" />
            </div>
          )}
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="text-3xl font-heading font-bold leading-tight text-stone-900 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">{subtitle}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
