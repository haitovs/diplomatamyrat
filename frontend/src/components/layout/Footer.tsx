import { Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: t('categories.kitchen'), slug: 'kitchen' },
    { name: t('categories.living'), slug: 'living' },
    { name: t('categories.bathroom'), slug: 'bathroom' },
    { name: t('categories.storage'), slug: 'storage' },
    { name: t('categories.laundry'), slug: 'laundry' },
    { name: t('categories.outdoor'), slug: 'outdoor' },
  ];

  const company = [
    { name: t('footer.aboutUs'), href: '/about' },
    { name: t('footer.sustainability'), href: '/sustainability' },
    { name: t('footer.journal'), href: '/journal' },
    { name: t('footer.careers'), href: '/careers' },
  ];

  const support = [
    { name: t('footer.helpCenter'), href: '/support' },
    { name: t('footer.shippingInfo'), href: '/shipping' },
    { name: t('footer.returns'), href: '/returns' },
    { name: t('footer.contactUs'), href: '/contact' },
  ];

  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 space-y-5 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-11 h-11 object-contain" />
              <h3 className="text-2xl font-heading font-semibold text-white">
                Hearth & Home
              </h3>
            </Link>
            <div className="space-y-3">
              <a
                href="mailto:hello@hearthandhome.com"
                className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span className="text-sm">hello@hearthandhome.com</span>
              </a>
              <a
                href="tel:+99312123456"
                className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span className="text-sm">+993 (12) 12-34-56</span>
              </a>
              <div className="flex items-center gap-2 text-stone-400">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-sm">{t('footer.address')}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-5 sm:mb-6">{t('footer.shop')}</h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link 
                    to={`/category/${cat.slug}`}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-6">{t('footer.company')}</h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.href}>
                  <Link 
                    to={item.href}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-6">{t('nav.support')}</h4>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item.href}>
                  <Link 
                    to={item.href}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
            <p className="text-stone-500 text-sm order-2 md:order-1">
              {t('common.copyrightYear', { year: currentYear })}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm order-1 md:order-2">
              <Link to="/privacy" className="text-stone-500 hover:text-white transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms" className="text-stone-500 hover:text-white transition-colors">
                {t('footer.terms')}
              </Link>
              <Link to="/admin" className="text-stone-500 hover:text-white transition-colors">
                {t('footer.adminPanel')}
              </Link>
            </div>
            <p className="text-stone-500 text-sm flex items-center gap-1 order-3">
              {t('footer.madeWithLove')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
