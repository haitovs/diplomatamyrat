import { Heart, Mail, MapPin, Phone } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <h3 className="text-2xl font-heading font-semibold text-white">
                Hearth & Home
              </h3>
            </Link>
            <p className="text-stone-400 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="mailto:hello@hearthandhome.com" 
                className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@hearthandhome.com</span>
              </a>
            </div>
            <div className="flex items-center gap-2 text-stone-400">
              <Phone className="w-4 h-4" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Portland, Oregon</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-6">{t('footer.shop')}</h4>
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-stone-500 text-sm">
              © {currentYear} Hearth & Home. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-stone-500 hover:text-white transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms" className="text-stone-500 hover:text-white transition-colors">
                {t('footer.terms')}
              </Link>
              <Link to="/admin" className="text-stone-500 hover:text-white transition-colors">
                Admin Panel
              </Link>
            </div>
            <p className="text-stone-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for your home
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
