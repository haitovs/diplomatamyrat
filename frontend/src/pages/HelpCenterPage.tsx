import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LifeBuoy } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PageHero from '../components/layout/PageHero';

export default function HelpCenterPage() {
  const { t } = useTranslation();
  const faqs = t('pages.help.faqs', { returnObjects: true }) as { q: string; a: string }[];
  const topics = t('pages.help.topics', { returnObjects: true }) as { title: string; desc: string }[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <PageHero
        eyebrow={t('pages.help.eyebrow')}
        title={t('pages.help.title')}
        subtitle={t('pages.help.subtitle')}
        icon={LifeBuoy}
      />

      {/* Topic cards */}
      <section className="py-14 lg:pt-20 lg:pb-10">
        <div className="container-narrow">
          <h2 className="mb-8 text-center font-heading text-2xl font-semibold text-stone-900">
            {t('pages.help.topicsTitle')}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((topic) => (
              <div key={topic.title} className="rounded-2xl border border-stone-200 p-6 transition-colors hover:border-primary-300">
                <h3 className="mb-1 font-heading text-lg font-semibold text-stone-900">{topic.title}</h3>
                <p className="text-sm text-stone-600">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="pb-14 lg:pb-20">
        <div className="container-narrow max-w-3xl">
          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={faq.q} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-medium text-stone-900">{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-5 pb-5 text-stone-600">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-100 py-14 text-center lg:py-16">
        <div className="container-narrow">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-stone-900">{t('pages.help.ctaTitle')}</h2>
          <p className="mb-6 text-stone-600">{t('pages.help.ctaDesc')}</p>
          <Link to="/contact" className="btn btn-primary btn-lg">
            {t('pages.help.ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  );
}
