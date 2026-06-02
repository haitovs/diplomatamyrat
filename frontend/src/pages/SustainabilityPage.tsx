import { motion } from 'framer-motion';
import { Leaf, Package, Recycle, Sprout, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';

const icons = [Recycle, Package, Sprout, Truck];

export default function SustainabilityPage() {
  const { t } = useTranslation();
  const commitments = t('pages.sustainability.commitments', { returnObjects: true }) as {
    title: string;
    desc: string;
  }[];
  const impactStats = t('pages.sustainability.impactStats', { returnObjects: true }) as {
    num: string;
    label: string;
  }[];
  const materials = t('pages.sustainability.materials', { returnObjects: true }) as {
    title: string;
    desc: string;
  }[];
  const goals = t('pages.sustainability.goals', { returnObjects: true }) as {
    title: string;
    desc: string;
  }[];

  return (
    <div>
      <PageHero
        eyebrow={t('pages.sustainability.eyebrow')}
        title={t('pages.sustainability.title')}
        subtitle={t('pages.sustainability.subtitle')}
        variant="accent"
        icon={Leaf}
      />

      {/* Intro */}
      <section className="py-14 lg:py-20">
        <div className="container-narrow max-w-3xl text-center">
          <h2 className="section-title mb-4">{t('pages.sustainability.introTitle')}</h2>
          <p className="text-lg leading-relaxed text-stone-600">{t('pages.sustainability.introText')}</p>
        </div>

        {/* Impact stats */}
        <div className="container-narrow mt-12">
          <h3 className="mb-8 text-center font-heading text-2xl font-semibold text-stone-900">
            {t('pages.sustainability.impactTitle')}
          </h3>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {impactStats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-accent-50 p-6 text-center">
                <p className="font-heading text-3xl font-bold text-accent-700 sm:text-4xl">{s.num}</p>
                <p className="mt-1 text-sm text-stone-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="bg-accent-50 py-14 lg:py-20">
        <div className="container-narrow grid gap-6 sm:grid-cols-2">
          {commitments.map((c, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex gap-5 rounded-2xl bg-white p-6 shadow-sm sm:p-7"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-1 font-heading text-xl font-semibold text-stone-900">{c.title}</h3>
                  <p className="text-stone-600">{c.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Materials */}
      <section className="py-14 lg:py-20">
        <div className="container-narrow">
          <h2 className="section-title mb-10 text-center">{t('pages.sustainability.materialsTitle')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {materials.map((m) => (
              <div key={m.title} className="rounded-2xl border border-stone-200 p-6">
                <h3 className="mb-1 font-heading text-lg font-semibold text-stone-900">{m.title}</h3>
                <p className="text-sm text-stone-600">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="bg-accent-700 py-14 text-white lg:py-20">
        <div className="container-narrow">
          <h2 className="mb-10 text-center font-heading text-3xl font-bold">
            {t('pages.sustainability.goalsTitle')}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {goals.map((g, i) => (
              <div key={g.title}>
                <span className="font-heading text-4xl font-bold text-accent-300">0{i + 1}</span>
                <h3 className="mb-1 mt-2 font-heading text-xl font-semibold">{g.title}</h3>
                <p className="text-accent-50">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
