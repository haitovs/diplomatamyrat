import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';

const covers = [
  '/images/kitchen/hero.jpg',
  '/images/bath/hero.jpg',
  '/images/living/hero.jpg',
  '/images/storage/hero.jpg',
];

export default function JournalPage() {
  const { t } = useTranslation();
  const articles = t('pages.journal.articles', { returnObjects: true }) as {
    category: string;
    title: string;
    excerpt: string;
    date: string;
  }[];
  const topics = t('pages.journal.topics', { returnObjects: true }) as string[];

  return (
    <div>
      <PageHero
        eyebrow={t('pages.journal.eyebrow')}
        title={t('pages.journal.title')}
        subtitle={t('pages.journal.subtitle')}
      />

      <section className="py-14 lg:py-20">
        {/* Topics */}
        <div className="container-narrow mb-10 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-stone-500">{t('pages.journal.topicsTitle')}:</span>
          {topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-stone-200 px-3 py-1 text-sm text-stone-600 transition-colors hover:border-primary-400 hover:text-primary-600"
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="container-narrow grid gap-8 sm:grid-cols-2">
          {articles.map((a, i) => (
            <motion.article
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card card-hover group overflow-hidden"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={covers[i % covers.length]}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-3 text-sm">
                  <span className="badge badge-accent">{a.category}</span>
                  <span className="text-stone-400">{a.date}</span>
                </div>
                <h2 className="mb-2 font-heading text-xl font-semibold text-stone-900">{a.title}</h2>
                <p className="mb-4 text-stone-600">{a.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600">
                  {t('pages.journal.readMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
