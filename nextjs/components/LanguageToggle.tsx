'use client';

import { useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const [currentLang, setCurrentLang] = useState<Language>('vi');

  useEffect(() => {
    // Load language from localStorage
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang) {
      setCurrentLang(savedLang);
      document.documentElement.lang = savedLang;
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }));
  };

  return (
    <div className={`flex bg-espresso border border-gold/30 rounded-full p-1 ${className}`}>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`lang-btn px-3 py-1 rounded-full text-sm transition-all duration-200 ease-in-out ${
          currentLang === 'en'
            ? 'bg-terracotta text-white'
            : 'text-cream/80 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('vi')}
        className={`lang-btn px-3 py-1 rounded-full text-sm transition-all duration-200 ease-in-out ${
          currentLang === 'vi'
            ? 'bg-terracotta text-white'
            : 'text-cream/80 hover:text-white'
        }`}
      >
        VI
      </button>
    </div>
  );
}

// Hook to use language in other components
export function useLanguage() {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('lang') as Language) || 'vi';
    }
    return 'vi';
  });

  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = (e: CustomEvent<{ language: Language }>) => {
      setCurrentLang(e.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []); // Empty dependency array to run only once

  return currentLang;
}
