import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

const Navbar = () => {
  const { logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">{t('app.name')}</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/dashboard')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('navbar.dashboard')}
              </Link>
              <Link
                to="/actions"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/actions')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('navbar.todaysActions')}
              </Link>
              <Link
                to="/compliance"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/compliance')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('navbar.compliance')}
              </Link>
              <Link
                to="/copilot"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/copilot')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('navbar.aiCopilot')}
              </Link>
              <Link
                to="/history"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/history')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('navbar.history')}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-2"
              title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            >
              <span className="text-base">{language === 'en' ? '🇮🇳' : '🇬🇧'}</span>
              <span className="hidden sm:inline">{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;








