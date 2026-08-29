import { IS_DEV } from './const';
import i18n from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import I18NextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(I18NextHttpBackend)
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    defaultNS: 'common',
    debug: IS_DEV,

    interpolation: {
      escapeValue: false,
    },

    keySeparator: '.',
    nsSeparator: ':',

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    react: { useSuspense: true },
  });

export default i18n;
