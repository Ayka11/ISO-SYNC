import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SUPPORTED = [
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ru', label: 'Русский' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'az', label: 'Azərbaycanca' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  function updateHtmlLangDir(lng: string) {
    const html = document.documentElement;
    html.lang = lng;
    const rtlLangs = ['ar', 'he', 'fa', 'ur'];
    html.dir = rtlLangs.includes(lng) ? 'rtl' : 'ltr';
    if (rtlLangs.includes(lng)) html.classList.add('rtl'); else html.classList.remove('rtl');
  }

  function changeLanguage(lng: string) {
    localStorage.setItem('i18nextLng', lng);
    i18n.changeLanguage(lng);
    updateHtmlLangDir(lng);
    setOpen(false);
  }

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!(e.target instanceof Node)) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const active = SUPPORTED.find(s => s.code === i18n.language) || SUPPORTED[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 text-gray-300 hover:bg-white/10"
        title="Change language"
      >
        <span className="text-sm font-medium">{active.label}</span>
        <span className="text-lg leading-none">☰</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-[#0b0b14] border border-white/10 rounded-lg shadow-2xl z-50">
          {SUPPORTED.map(s => (
            <button
              key={s.code}
              onClick={() => changeLanguage(s.code)}
              className={`w-full text-left px-3 py-2 text-sm ${i18n.language === s.code ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-white/5'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
