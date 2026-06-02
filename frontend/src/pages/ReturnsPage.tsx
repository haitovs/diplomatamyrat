import { motion } from 'framer-motion';
import { Check, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';

export default function ReturnsPage() {
  const { t } = useTranslation();
  const steps = t('pages.returns.steps', { returnObjects: true }) as { title: string; desc: string }[];
  const policy = t('pages.returns.policy', { returnObjects: true }) as string[];
  const methods = t('pages.returns.methods', { returnObjects: true }) as { title: string; desc: string }[];
  const faqs = t('pages.returns.faqs', { returnObjects: true }) as { q: string; a: string }[];

  return (
    <div>
      <PageHero
        eyebrow={t('pages.returns.eyebrow')}
        title={t('pages.returns.title')}
        subtitle={t('pages.returns.subtitle')}
        icon={RotateCcw}
      />

      <section className="py-14 lg:py-20">
        <div className="container-narrow max-w-3xl">
          <p className="mb-12 text-lg leading-relaxed text-stone-600">{t('pages.returns.introText')}</p>

          {/* Timeline steps */}
          <ol className="relative space-y-8 border-l-2 border-stone-200 pl-8">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="relative"
              >
                <span className="absolute -left-[2.6rem] flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white ring-4 ring-stone-50">
                  {i + 1}
                </span>
                <h3 className="font-heading text-lg font-semibold text-stone-900">{s.title}</h3>
                <p className="mt-1 text-stone-600">{s.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Refund methods */}
      <section className="bg-stone-100 py-14 lg:py-20">
        <div className="container-narrow">
          <h2 className="section-title mb-10 text-center">{t('pages.returns.methodsTitle')}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {methods.map((m) => (
              <div key={m.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-1 font-heading text-lg font-semibold text-stone-900">{m.title}</h3>
                <p className="text-sm text-stone-600">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy + FAQ */}
      <section className="py-14 lg:py-20">
        <div className="container-narrow grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="section-title mb-6">{t('pages.returns.policyTitle')}</h2>
            <ul className="space-y-3">
              {policy.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-stone-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="section-title mb-6">{t('pages.returns.faqTitle')}</h2>
            <div className="space-y-5">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-medium text-stone-900">{faq.q}</h3>
                  <p className="mt-1 text-stone-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
