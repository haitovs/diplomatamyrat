import { Box, ClipboardCheck, PackageCheck, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';

const stepIcons = [ClipboardCheck, PackageCheck, Truck];

export default function ShippingPage() {
  const { t } = useTranslation();
  const zones = t('pages.shipping.zones', { returnObjects: true }) as {
    region: string;
    time: string;
    cost: string;
  }[];
  const steps = t('pages.shipping.steps', { returnObjects: true }) as { title: string; desc: string }[];
  const faqs = t('pages.shipping.faqs', { returnObjects: true }) as { q: string; a: string }[];

  return (
    <div>
      <PageHero
        eyebrow={t('pages.shipping.eyebrow')}
        title={t('pages.shipping.title')}
        subtitle={t('pages.shipping.subtitle')}
        icon={Truck}
      />

      {/* Zones */}
      <section className="py-14 lg:py-20">
        <div className="container-narrow max-w-4xl">
          <h2 className="section-title mb-8">{t('pages.shipping.zonesTitle')}</h2>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-stone-200 sm:block">
            <table className="w-full text-left">
              <tbody>
                {zones.map((z, i) => (
                  <tr key={z.region} className={i % 2 ? 'bg-stone-50' : 'bg-white'}>
                    <td className="px-6 py-4 font-medium text-stone-900">{z.region}</td>
                    <td className="px-6 py-4 text-stone-600">{z.time}</td>
                    <td className="px-6 py-4 text-right font-medium text-primary-600">{z.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 sm:hidden">
            {zones.map((z) => (
              <div key={z.region} className="rounded-xl border border-stone-200 bg-white p-4">
                <p className="font-medium text-stone-900">{z.region}</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-stone-600">{z.time}</span>
                  <span className="font-medium text-primary-600">{z.cost}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Free shipping callout */}
          <div className="mt-8 rounded-2xl bg-accent-50 p-6 ring-1 ring-accent-100">
            <h3 className="mb-1 font-heading text-lg font-semibold text-accent-800">
              {t('pages.shipping.freeTitle')}
            </h3>
            <p className="text-accent-700">{t('pages.shipping.freeDesc')}</p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-stone-100 py-14 lg:py-20">
        <div className="container-narrow">
          <h2 className="section-title mb-10 text-center">{t('pages.shipping.processTitle')}</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => {
              const Icon = stepIcons[i % stepIcons.length];
              return (
                <div key={s.title} className="text-center">
                  <div className="relative mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white">
                    <Icon className="h-6 w-6" />
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-primary-600 shadow">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mb-1 font-heading text-lg font-semibold text-stone-900">{s.title}</h3>
                  <p className="text-sm text-stone-600">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packaging + FAQ */}
      <section className="py-14 lg:py-20">
        <div className="container-narrow grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
              <Box className="h-6 w-6" />
            </div>
            <h2 className="section-title mb-3">{t('pages.shipping.packagingTitle')}</h2>
            <p className="text-lg leading-relaxed text-stone-600">{t('pages.shipping.packagingText')}</p>
          </div>
          <div>
            <h2 className="section-title mb-6">{t('pages.shipping.faqTitle')}</h2>
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
