import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-heading font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-heading font-semibold text-stone-900 mb-4">
          {t('notFound.title')}
        </h2>
        <p className="text-stone-600 mb-8 max-w-md mx-auto">
          {t('notFound.description')}
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          <Home className="w-5 h-5" />
          {t('common.backToHome')}
        </Link>
      </div>
    </div>
  );
}
