'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageToggle';

interface FAQItem {
  question: { vi: string; en: string };
  answer: { vi: string; en: string };
}

// FAQ data from content.json - exactly matching the HTML
const faqItems: FAQItem[] = [
  {
    question: {
      vi: 'Tư vấn công thức có phù hợp với nguyên liệu tại địa phương tôi không?',
      en: 'Will the recipe consultation work with my local ingredients?',
    },
    answer: {
      vi: 'Có. Bạn chụp ảnh nguyên liệu có sẵn tại địa phương và gửi cho mình. Mình sẽ điều chỉnh công thức cho phù hợp với nguyên liệu đó. Cam kết làm một phát ăn ngay, hoặc hoàn tiền.',
      en: 'Yes. You send photos of your local ingredients. I\'ll adjust the recipe to work with what you have. Success on first try guaranteed, or money back.',
    },
  },
  {
    question: {
      vi: 'Tại sao nên chọn tư vấn từ Uyên thay vì học từ YouTube?',
      en: 'Why choose Uyên\'s consultation instead of learning from YouTube?',
    },
    answer: {
      vi: 'YouTube cho kiến thức chung. Tư vấn từ mình cho công thức cụ thể đã được test và điều chỉnh cho chính nguyên liệu của bạn. Mình có 10+ năm kinh nghiệm thực chiến, từ thất bại đến Best Bánh Mì in Manchester. Mình biết những sai lầm phải tránh.',
      en: 'YouTube gives general knowledge. My consultation gives you specific, tested recipes adjusted for YOUR ingredients. I have 10+ years real experience, from failures to Best Bánh Mì in Manchester. I know what mistakes to avoid.',
    },
  },
  {
    question: {
      vi: 'Tôi chưa có kinh nghiệm F&B, có thể học được không?',
      en: 'I have no F&B experience, can I still learn?',
    },
    answer: {
      vi: 'Được. Chương trình Mastery được thiết kế để bạn làm chủ món từ đầu, kể cả khi chưa có kinh nghiệm. Công thức đơn giản, rõ ràng, và mình sẽ hướng dẫn chi tiết từng bước.',
      en: 'Yes. The Mastery programs are designed for you to master dishes from scratch, even with no experience. Recipes are simple, clear, and I guide you step by step.',
    },
  },
  {
    question: {
      vi: 'Làm sao biết công thức có phù hợp với thị trường UK không?',
      en: 'How do I know the recipes work for the UK market?',
    },
    answer: {
      vi: 'Mình đã vận hành F&B tại London, Manchester, và Wales suốt 10+ năm. Công thức đã được test với nguyên liệu UK, khẩu vị địa phương, và yêu cầu về Food Safety. Wow Banh Mi được bình chọn Best Bánh Mì in Manchester chính là minh chứng.',
      en: 'I\'ve run F&B in London, Manchester, and Wales for 10+ years. Recipes are tested with UK ingredients, local taste preferences, and Food Safety requirements. Wow Banh Mi being voted Best Bánh Mì in Manchester is proof.',
    },
  },
  {
    question: {
      vi: 'Sau khi học xong, tôi có được hỗ trợ thêm không?',
      en: 'Do I get ongoing support after the program?',
    },
    answer: {
      vi: 'Có. Bạn có thể liên hệ mình nếu gặp vấn đề khi thực hành công thức. Mình cam kết hỗ trợ đến khi bạn làm được món ngon và ổn định.',
      en: 'Yes. You can contact me if you face issues when practicing the recipes. I\'m committed to supporting you until you can make consistently good dishes.',
    },
  },
];

export default function FAQ() {
  const currentLang = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-light fade-in">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-secondary uppercase tracking-widest text-sm mb-4 font-medium">
            FAQ
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-primary"
            data-vi="Câu hỏi thường gặp"
            data-en="Frequently asked questions"
          >
            {currentLang === 'vi' ? 'Câu hỏi thường gặp' : 'Frequently asked questions'}
          </h2>
        </div>

        {/* FAQ Grid - 2 columns on desktop, matches HTML layout */}
        <div className="grid md:grid-cols-2 gap-4">
          {faqItems.map((item, index) => (
            <details
              key={index}
              className="bg-light border border-primary/10 group"
              open={openIndex === index}
              onClick={(e) => {
                e.preventDefault();
                toggleFAQ(index);
              }}
            >
              <summary className="p-5 cursor-pointer flex justify-between items-center font-semibold text-primary hover:bg-light/50 transition-colors list-none">
                <span>{item.question[currentLang]}</span>
                <span
                  className={`text-secondary transition-transform ${
                    openIndex === index ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-muted">{item.answer[currentLang]}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
