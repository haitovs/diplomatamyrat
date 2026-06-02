import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showToast } from '../components/common/Toast';
import PageHero from '../components/layout/PageHero';

const PHONE = '+993 (12) 12-34-56';
const EMAIL = 'hello@hearthandhome.com';

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const channels = t('pages.contact.channels', { returnObjects: true }) as {
    title: string;
    desc: string;
    value: string;
  }[];

  const channelHref = (value: string) =>
    value.includes('@') ? `mailto:${value}` : `tel:${value.replace(/[^+\d]/g, '')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(t('pages.contact.successMsg'), 'success');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div>
      <PageHero
        eyebrow={t('pages.contact.eyebrow')}
        title={t('pages.contact.title')}
        subtitle={t('pages.contact.subtitle')}
      />

      <section className="py-14 lg:py-20">
        <div className="container-narrow grid gap-12 lg:grid-cols-5">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-3">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-stone-700">
                {t('pages.contact.formName')}
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-700">
                {t('pages.contact.formEmail')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-stone-700">
                {t('pages.contact.formMessage')}
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input resize-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="btn btn-primary btn-lg">
                <Send className="h-4 w-4" />
                {t('pages.contact.formSubmit')}
              </button>
              <span className="text-sm text-stone-500">{t('pages.contact.responseNote')}</span>
            </div>
          </form>

          {/* Info */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-stone-100 p-7">
              <h2 className="mb-6 font-heading text-xl font-semibold text-stone-900">
                {t('pages.contact.infoTitle')}
              </h2>
              <ul className="space-y-5 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                  <div>
                    <p className="font-medium text-stone-900">{t('pages.contact.addressLabel')}</p>
                    <p className="text-stone-600">{t('pages.contact.addressValue')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                  <div>
                    <p className="font-medium text-stone-900">{t('pages.contact.phoneLabel')}</p>
                    <a href={`tel:${PHONE.replace(/[^+\d]/g, '')}`} className="text-stone-600 hover:text-primary-600">
                      {PHONE}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                  <div>
                    <p className="font-medium text-stone-900">{t('pages.contact.emailLabel')}</p>
                    <a href={`mailto:${EMAIL}`} className="text-stone-600 hover:text-primary-600">
                      {EMAIL}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                  <div>
                    <p className="font-medium text-stone-900">{t('pages.contact.hoursLabel')}</p>
                    <p className="text-stone-600">{t('pages.contact.hoursValue')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="bg-stone-100 py-14 lg:py-20">
        <div className="container-narrow">
          <h2 className="section-title mb-10 text-center">{t('pages.contact.channelsTitle')}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {channels.map((c) => (
              <div key={c.title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <h3 className="mb-1 font-heading text-lg font-semibold text-stone-900">{c.title}</h3>
                <p className="mb-3 text-sm text-stone-600">{c.desc}</p>
                <a href={channelHref(c.value)} className="font-medium text-primary-600 hover:text-primary-700">
                  {c.value}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
