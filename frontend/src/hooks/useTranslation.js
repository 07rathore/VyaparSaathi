import { useLanguage } from '../contexts/LanguageContext';
import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi.json';

const translations = {
  en: enTranslations,
  hi: hiTranslations,
};

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to English if translation missing
        let fallbackValue = translations.en;
        for (const fk of keys) {
          fallbackValue = fallbackValue?.[fk];
        }
        return fallbackValue || key;
      }
    }

    // Replace parameters if any
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    return value || key;
  };

  return { t, language };
};

