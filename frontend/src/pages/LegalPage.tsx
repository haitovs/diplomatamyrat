import { useTranslation } from 'react-i18next';
import PageHero from '../components/layout/PageHero';

interface LegalPageProps {
  kind: 'privacy' | 'terms';
}

/** Shared layout for the two legal pages — content differs entirely by `kind`. */
export default function LegalPage({ kind }: LegalPageProps) {
  const { t } = useTranslation();
  const base = `pages.legal.${kind}`;
  const sections = t(`${base}.sections`, { returnObjects: true }) as { title: string; body: string }[];

  return (
    <div>
      <PageHero eyebrow={t(`${base}.lastUpdated`)} title={t(`${base}.title`)} subtitle={t(`${base}.subtitle`)} />

      <section className="py-14 lg:py-20">
        <div className="container-narrow max-w-3xl">
          <div className="space-y-10">
            {sections.map((s, i) => (
              <div key={s.title}>
                <h2 className="mb-2 font-heading text-xl font-semibold text-stone-900">
                  <span className="mr-2 text-primary-400">{i + 1}.</span>
                  {s.title}
                </h2>
                <p className="leading-relaxed text-stone-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
