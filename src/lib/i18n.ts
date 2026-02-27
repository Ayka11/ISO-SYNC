import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '@/locales/en/common.json';
import trCommon from '@/locales/tr/common.json';
import ruCommon from '@/locales/ru/common.json';
import esCommon from '@/locales/es/common.json';
import deCommon from '@/locales/de/common.json';
import azCommon from '@/locales/az/common.json';

const supported = ['en', 'tr', 'ru', 'es', 'de', 'az'];

const resources = {
  en: { common: enCommon },
  tr: { common: trCommon },
  ru: { common: ruCommon },
  es: { common: esCommon },
  de: { common: deCommon },
  az: { common: azCommon },
};

function detectInitialLang() {
  try {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const first = parts[0];
    if (first && supported.includes(first)) return first;
  } catch {}
  const saved = localStorage.getItem('i18nextLng');
  if (saved && supported.includes(saved)) return saved;
  const nav = (navigator.languages || [navigator.language || 'en']).map((l: string) => l.split('-')[0]);
  const pick = nav.find((n: string) => supported.includes(n));
  return pick || 'en';
}

const initialLng = detectInitialLang();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLng,
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    supportedLngs: supported,
    react: { useSuspense: false },
  });

try {
  const html = document.documentElement;
  html.lang = initialLng;
  const rtl = ['ar', 'he', 'fa', 'ur'];
  html.dir = rtl.includes(initialLng) ? 'rtl' : 'ltr';
} catch {}

export default i18n;
