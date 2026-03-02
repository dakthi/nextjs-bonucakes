'use client';

import { useLanguage } from './LanguageToggle';
import { useEffect, useState } from 'react';

interface Settings {
  facebook: string;
}

interface CTAData {
  tagline: { vi: string; en: string };
  title: { vi: string; en: string };
  description: { vi: string; en: string };
  buttonText: { vi: string; en: string };
}

export default function CTASection() {
  const currentLang = useLanguage();
  const [ctaData, setCTAData] = useState<CTAData | null>(null);
  const [facebookUrl, setFacebookUrl] = useState<string>('');

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/content.json');
        const data = await res.json();
        setCTAData(data.cta);
        setFacebookUrl(data.settings.facebook);
      } catch (error) {
        console.error('Error loading content:', error);
      }
    }
    loadContent();
  }, []);

  if (!ctaData) return null;

  return (
    <section id="contact" className="py-16 md:py-24 bg-espresso text-warmwhite fade-in">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p
          className="text-gold uppercase tracking-widest text-sm mb-4 font-medium"
          data-vi="Bắt đầu ngay"
          data-en="Get started"
        >
          {ctaData.tagline[currentLang]}
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold mb-6"
          data-vi="Sẵn sàng chuyển đổi hành trình F&B của bạn?"
          data-en="Ready to transform your F&B journey?"
        >
          {ctaData.title[currentLang]}
        </h2>
        <p
          className="text-xl text-cream/80 mb-8 max-w-2xl mx-auto"
          data-vi="Liên hệ với mình để thảo luận về nơi bạn đang ở, nơi bạn muốn đến, và cách chúng ta cùng đến đó."
          data-en="Contact me to discuss where you are, where you want to go, and how we'll get there together."
        >
          {ctaData.description[currentLang]}
        </p>
        <a
          id="cta-link"
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-terracotta text-white px-8 py-4 font-semibold text-lg hover:bg-terracotta/90 transition-colors transition-transform hover:-translate-y-0.5"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span
            data-vi="Nhắn tin cho Uyên"
            data-en="Message Uyen on Facebook"
          >
            {ctaData.buttonText[currentLang]}
          </span>
        </a>
      </div>
    </section>
  );
}
