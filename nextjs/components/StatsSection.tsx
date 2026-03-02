'use client';

import { useLanguage } from './LanguageToggle';

interface Stat {
  value: string;
  label: { vi: string; en: string };
}

// Stats data from content.json
const stats: Stat[] = [
  {
    value: '10+',
    label: { vi: 'Năm kinh nghiệm', en: 'Years of experience' },
  },
  {
    value: '5+',
    label: { vi: 'Nhà hàng đã mở', en: 'Restaurants opened' },
  },
  {
    value: '500+',
    label: { vi: 'Giờ tư vấn', en: 'Consulting hours' },
  },
  {
    value: '50+',
    label: { vi: 'Khách hàng', en: 'Clients served' },
  },
  {
    value: '1',
    label: { vi: 'Bằng Le Cordon Bleu', en: 'Le Cordon Bleu degree' },
  },
  {
    value: 'UK',
    label: { vi: 'Tại Wales, Anh', en: 'Based in Wales' },
  },
];

export default function StatsSection() {
  const currentLang = useLanguage();

  return (
    <section className="bg-warmwhite py-12 border-b border-espresso/10 fade-in">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="fade-in">
              <p className="text-3xl md:text-4xl font-bold text-terracotta">{stat.value}</p>
              <p className="text-coffee text-sm">{stat.label[currentLang]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
