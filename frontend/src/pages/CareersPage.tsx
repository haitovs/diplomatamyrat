import { motion } from 'framer-motion';
import { Briefcase, Clock, GraduationCap, Heart, MapPin, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';

const perkIcons = [Clock, GraduationCap, Tag, Heart];

export default function CareersPage() {
  const { t } = useTranslation();
  const perks = t('pages.careers.perks', { returnObjects: true }) as { title: string; desc: string }[];
  const openings = t('pages.careers.openings', { returnObjects: true }) as {
    title: string;
    dept: string;
    location: string;
    type: string;
  }[];
  const culturePoints = t('pages.careers.culturePoints', { returnObjects: true }) as {
    title: string;
    desc: string;
  }[];
  const processSteps = t('pages.careers.processSteps', { returnObjects: true }) as {
    title: string;
    desc: string;
  }[];

  return (
    <div>
      <PageHero
        eyebrow={t('pages.careers.eyebrow')}
        title={t('pages.careers.title')}
        subtitle={t('pages.careers.subtitle')}
        icon={Briefcase}
      />

      {/* Intro + perks */}
      <section className="py-14 lg:py-20">
        <div className="container-narrow">
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg leading-relaxed text-stone-600">
            {t('pages.careers.introText')}
          </p>
          <h2 className="section-title mb-8 text-center">{t('pages.careers.perksTitle')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p, i) => {
              const Icon = perkIcons[i % perkIcons.length];
              return (
                <div key={p.title} className="rounded-2xl bg-stone-100 p-6 text-center">
                  <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1 font-heading font-semibold text-stone-900">{p.title}</h3>
                  <p className="text-sm text-stone-600">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="bg-primary-50 py-14 lg:py-20">
        <div className="container-narrow grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="section-title mb-4">{t('pages.careers.cultureTitle')}</h2>
            <p className="text-lg leading-relaxed text-stone-600">{t('pages.careers.cultureText')}</p>
          </div>
          <div className="space-y-4">
            {culturePoints.map((c) => (
              <div key={c.title} className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="font-heading font-semibold text-stone-900">{c.title}</h3>
                <p className="text-sm text-stone-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="bg-stone-100 py-14 lg:py-20">
        <div className="container-narrow max-w-3xl">
          <h2 className="section-title mb-8 text-center">{t('pages.careers.openingsTitle')}</h2>
          <div className="space-y-4">
            {openings.map((job, i) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-heading text-lg font-semibold text-stone-900">{job.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
                    <span>{job.dept}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="badge badge-neutral">{job.type}</span>
                  </div>
                </div>
                <a
                  href={`mailto:hello@hearthandhome.com?subject=${encodeURIComponent(job.title)}`}
                  className="btn btn-outline btn-md shrink-0 self-start sm:self-auto"
                >
                  {t('pages.careers.applyButton')}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring process */}
      <section className="py-14 lg:py-20">
        <div className="container-narrow">
          <h2 className="section-title mb-10 text-center">{t('pages.careers.processTitle')}</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s, i) => (
              <div key={s.title} className="relative">
                <span className="font-heading text-3xl font-bold text-primary-300">0{i + 1}</span>
                <h3 className="mb-1 mt-1 font-heading text-lg font-semibold text-stone-900">{s.title}</h3>
                <p className="text-sm text-stone-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
