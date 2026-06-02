import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PageHero from '../components/layout/PageHero';

const valueIcons = [ShieldCheck, Leaf, Sparkles];

export default function AboutPage() {
  const { t } = useTranslation();
  const paragraphs = t('pages.about.storyParagraphs', { returnObjects: true }) as string[];
  const values = t('pages.about.values', { returnObjects: true }) as { title: string; desc: string }[];
  const stats = t('pages.about.stats', { returnObjects: true }) as { num: string; label: string }[];
  const principles = t('pages.about.principles', { returnObjects: true }) as { title: string; desc: string }[];
  const milestones = t('pages.about.milestones', { returnObjects: true }) as {
    year: string;
    title: string;
    desc: string;
  }[];

  return (
    <div>
      <PageHero
        eyebrow={t('pages.about.eyebrow')}
        title={t('pages.about.title')}
        subtitle={t('pages.about.subtitle')}
      />

      {/* Story */}
      <section className="py-14 lg:py-20">
        <div className="container-narrow grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow mb-2">{t('pages.about.storyTitle')}</p>
            <div className="space-y-4 text-base leading-relaxed text-stone-600 sm:text-lg">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/images/living/hero.jpg" alt="" className="aspect-[4/5] w-full rounded-2xl object-cover" />
            <img src="/images/kitchen/hero.jpg" alt="" className="mt-8 aspect-[4/5] w-full rounded-2xl object-cover" />
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-primary-50 py-14 lg:py-20">
        <div className="container-narrow">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="section-title mb-4">{t('pages.about.philosophyTitle')}</h2>
            <p className="text-lg leading-relaxed text-stone-600">{t('pages.about.philosophyText')}</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <h3 className="mb-1 font-heading text-lg font-semibold text-stone-900">{p.title}</h3>
                <p className="text-sm text-stone-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-stone-100 py-14 lg:py-20">
        <div className="container-narrow">
          <h2 className="section-title mb-10 text-center">{t('pages.about.valuesTitle')}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="card p-7"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-heading text-xl font-semibold text-stone-900">{v.title}</h3>
                  <p className="text-stone-600">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 lg:py-20">
        <div className="container-narrow grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-4xl font-bold text-primary-600">{s.num}</p>
              <p className="mt-1 text-stone-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-stone-100 py-14 lg:py-20">
        <div className="container-narrow max-w-3xl">
          <h2 className="section-title mb-10 text-center">{t('pages.about.milestonesTitle')}</h2>
          <ol className="relative space-y-8 border-l-2 border-stone-300 pl-8">
            {milestones.map((m, i) => (
              <motion.li
                key={m.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
              >
                <span className="absolute -left-[3.4rem] flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white ring-4 ring-stone-100">
                  {m.year}
                </span>
                <h3 className="font-heading text-lg font-semibold text-stone-900">{m.title}</h3>
                <p className="mt-1 text-stone-600">{m.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-14 text-center text-white lg:py-20">
        <div className="container-narrow">
          <h2 className="mb-3 font-heading text-3xl font-bold">{t('pages.about.ctaTitle')}</h2>
          <p className="mx-auto mb-8 max-w-md text-primary-50">{t('pages.about.ctaDesc')}</p>
          <Link to="/products" className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50">
            {t('pages.about.ctaButton')}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
