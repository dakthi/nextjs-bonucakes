'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeInObserver from '@/components/FadeInObserver';
import { useLanguage } from '@/components/LanguageToggle';

export default function CulinaryConsultationPage() {
  const currentLang = useLanguage();

  useEffect(() => {
    // Smooth scroll for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const content = {
    vi: {
      sectionLabel: 'Dịch vụ',
      heading: 'Các gói tư vấn',
      subheading: 'Chọn gói phù hợp với nhu cầu của bạn',
      mindsetTitle: 'Không chỉ là công thức: tư duy vận hành F&B',
      mindsetPara1: 'Khi bạn đến với Bo, bạn không chỉ học công thức. Bạn còn được hướng dẫn tư duy làm nghề trong ngành F&B để triển khai bền vững – dù vận hành nhà hàng hay bán online. Bên cạnh kỹ năng nấu ngon, bạn cần: hiểu khách hàng và xay dung tep khach ahng trung thanh; quản lý và tạo động lực cho nhân sự; quản trị hàng hóa/nguyên liệu và kiểm soát chi phí; thiết lập SOP, checklist chất lượng; và để mỗi món "nói" đúng câu chuyện thương hiệu của bạn. Đó là nền tảng giúp bạn phát triển lâu dài.',
      mindsetPara2: 'Không có mô hình nào đảm bảo 100% thành công ngay lập tức. Bo cũng đã từng vấp ngã và học lại. Nhưng bạn không phải đi một mình: khi gặp lỗi, Bo ở cạnh để hỗ trợ kịp thời, tìm nguyên nhân, sửa ngay nước đi sai, giúp bạn giảm thiểu sai lầm, tiết kiệm thời gian và tối ưu chi phí trên chặng đường triển khai.',
      guaranteeHeading: 'Cam kết chất lượng 100%',
      guaranteeText: 'Nếu bạn làm theo công thức mà không thành công, Bo sẽ hoàn lại 100% tiền. Không cần lý do. Đó là cam kết của Bo với chất lượng dịch vụ.',
      guarantee1Title: 'Bảo đảm ngon',
      guarantee1Text: 'Không ngon hoàn tiền',
      guarantee2Title: 'Hỗ trợ liên tục',
      guarantee2Text: 'Video call khi cần',
      guarantee3Title: 'Kinh nghiệm 10+ năm',
      guarantee3Text: 'Đã test hàng trăm lần',
      faqLabel: 'FAQ',
      faqHeading: 'Câu hỏi thường gặp',
      ctaHeading: 'Sẵn sàng bắt đầu?',
      ctaText: 'Liên hệ ngay để được tư vấn miễn phí. Bo sẽ trả lời tất cả câu hỏi của bạn và tìm hiểu xem dịch vụ nào phù hợp nhất.',
      ctaButton: 'Nhắn tin qua Facebook',
      ctaHomeButton: 'Quay về trang chủ',
      ctaDisclaimer: '*Số lượng học viên có hạn để đảm bảo chất lượng dịch vụ',
    },
    en: {
      sectionLabel: 'Services',
      heading: 'Consultation Packages',
      subheading: 'Choose the package that fits your needs',
      mindsetTitle: 'Not just recipes: F&B operational mindset',
      mindsetPara1: 'When you work with Bo, you don\'t just learn recipes. You\'re also guided in developing a professional mindset for the F&B industry to build sustainably – whether running a restaurant or selling online. Beyond cooking skills, you need: understanding customers and building loyal customer base; managing and motivating staff; managing inventory/ingredients and controlling costs; establishing SOPs and quality checklists; and ensuring each dish tells your brand story. That\'s the foundation for long-term growth.',
      mindsetPara2: 'No model guarantees 100% immediate success. Bo has also fallen and learned. But you don\'t walk alone: when you encounter issues, Bo is there to provide timely support, identify root causes, correct mistakes immediately, helping you minimize errors, save time and optimize costs along your implementation journey.',
      guaranteeHeading: '100% Quality Guarantee',
      guaranteeText: 'If you follow the recipe and it doesn\'t work, Bo will refund 100% of your money. No questions asked. That\'s Bo\'s commitment to service quality.',
      guarantee1Title: 'Taste Guaranteed',
      guarantee1Text: 'Full refund if not delicious',
      guarantee2Title: 'Continuous Support',
      guarantee2Text: 'Video calls when needed',
      guarantee3Title: '10+ Years Experience',
      guarantee3Text: 'Tested hundreds of times',
      faqLabel: 'FAQ',
      faqHeading: 'Frequently Asked Questions',
      ctaHeading: 'Ready to start?',
      ctaText: 'Contact now for free consultation. Bo will answer all your questions and find out which service suits you best.',
      ctaButton: 'Message on Facebook',
      ctaHomeButton: 'Back to Home',
      ctaDisclaimer: '*Limited student capacity to ensure service quality',
    }
  };

  const t = content[currentLang];

  return (
    <div className="min-h-screen bg-cream">
      <FadeInObserver />
      <Navbar />

      <main>
        {/* Services Section */}
        <section id="services" className="pt-24 md:pt-28 pb-16 md:pb-24 bg-cream">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-terracotta uppercase tracking-widest text-sm mb-4 font-medium">
                {t.sectionLabel}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-espresso mb-4">
                {t.heading}
              </h2>
              <p className="text-coffee max-w-2xl mx-auto">
                {t.subheading}
              </p>
            </div>

            {/* Mindset note */}
            <div className="bg-warmwhite border border-espresso/10 p-5 md:p-6 max-w-5xl mx-auto mb-8">
              <h3 className="text-xl font-bold text-espresso mb-2">
                {t.mindsetTitle}
              </h3>
              <p className="text-coffee">
                {t.mindsetPara1}
              </p>
              <p className="text-coffee mt-3">
                {t.mindsetPara2.split('**').map((part, i) => {
                  if (i % 2 === 1) return <strong key={i}>{part}</strong>;
                  return part.split('*').map((subpart, j) => {
                    if (j % 2 === 1) return <em key={`${i}-${j}`}>{subpart}</em>;
                    return subpart;
                  });
                })}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Signature Dish */}
              <div className="bg-espresso text-warmwhite p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-gold text-espresso px-3 py-1 text-sm font-bold">
                  {currentLang === 'vi' ? 'ĐẶC TRƯNG' : 'FEATURED'}
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {currentLang === 'vi' ? 'Bông lan trứng muối' : 'Salted Egg Sponge Cake'}
                </h3>
                <p className="text-cream/80 mb-6">
                  {currentLang === 'vi'
                    ? 'Công thức nổi tiếng được duy trì suốt 10+ năm với chất lượng ổn định. Tan trong miệng, để qua đêm vẫn mềm mịn không xẹp.'
                    : 'Famous recipe maintained for 10+ years with consistent quality. Melts in your mouth, stays soft and fluffy overnight.'}
                </p>
                <ul className="space-y-3 mb-8 text-cream/90">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {currentLang === 'vi' ? 'Công thức được test hàng trăm lần' : 'Recipe tested hundreds of times'}
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {currentLang === 'vi' ? 'Nâng cấp với nguyên liệu 5 sao từ Pháp' : 'Upgraded with 5-star ingredients from France'}
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {currentLang === 'vi' ? 'Chất lượng nhất quán suốt 10+ năm' : 'Consistent quality for 10+ years'}
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gold mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {currentLang === 'vi' ? 'Hỗ trợ video call nếu cần' : 'Video call support if needed'}
                  </li>
                </ul>
                <div className="border-t border-cream/20 pt-6">
                  <p className="text-3xl font-bold text-gold mb-2">
                    {currentLang === 'vi' ? 'Liên hệ' : 'Contact'}
                  </p>
                  <p className="text-cream/60 text-sm mb-6">
                    {currentLang === 'vi' ? 'Tư vấn giá và gói dịch vụ' : 'Pricing and package consultation'}
                  </p>
                  <Link href="/landing/salted-egg-sponge-cake" className="block w-full text-center bg-gold text-espresso px-8 py-4 font-semibold hover:bg-gold/90 transition-colors">
                    {currentLang === 'vi' ? 'Chi tiết' : 'Details'}
                  </Link>
                </div>
              </div>

              {/* Vietnamese Food Mastery */}
              <div className="bg-warmwhite border-2 border-espresso/20 p-8">
                <h3 className="text-2xl font-bold text-espresso mb-4">
                  {currentLang === 'vi' ? 'Chương trình Mastery Món Việt' : 'Vietnamese Food Mastery Program'}
                </h3>
                <p className="text-coffee mb-6">
                  {currentLang === 'vi'
                    ? 'Học làm chủ các món đặc trưng Việt Nam từ A đến Z. Mỗi món đều có combo set đầy đủ để bạn bán đỉnh ngay.'
                    : 'Master authentic Vietnamese dishes from A to Z. Each dish comes with a complete combo set for immediate sales success.'}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-terracotta mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <strong>{currentLang === 'vi' ? 'Bánh mì:' : 'Bánh mì:'}</strong> {currentLang === 'vi' ? 'Pate, thịt nguội, chả - combo set đầy đủ' : 'Pate, cold cuts, cha - complete combo set'}
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-terracotta mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <strong>{currentLang === 'vi' ? 'Phở:' : 'Phở:'}</strong> {currentLang === 'vi' ? 'Nước dùng chuẩn chỉnh, bí quyết gia truyền' : 'Authentic broth, family secrets'}
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-terracotta mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <strong>{currentLang === 'vi' ? 'Các món Việt truyền thống:' : 'Traditional Vietnamese dishes:'}</strong> {currentLang === 'vi' ? 'Chuẩn vị, công thức ổn định, dễ chuẩn hóa để training nhân viên và không phụ thuộc vào đầu bếp, không sợ mất nghề' : 'Authentic taste, stable recipes, easy to standardize for staff training without depending on chef'}
                    </div>
                  </li>
                </ul>
                <div className="border-t border-espresso/10 pt-6">
                  <p className="text-2xl font-bold text-espresso mb-2">
                    {currentLang === 'vi' ? 'Liên hệ' : 'Contact'}
                  </p>
                  <p className="text-coffee/60 text-sm mb-6">
                    {currentLang === 'vi' ? 'Tùy chỉnh theo nhu cầu' : 'Customized to your needs'}
                  </p>
                  <Link href="/landing/vietnamese-food-mastery" className="block w-full text-center border-2 border-espresso text-espresso px-8 py-4 font-semibold hover:bg-espresso/5 transition-colors">
                    {currentLang === 'vi' ? 'Chi tiết' : 'Details'}
                  </Link>
                </div>
              </div>

              {/* Korean Street Food Model */}
              <div className="bg-warmwhite border-2 border-espresso/20 p-8">
                <h3 className="text-2xl font-bold text-espresso mb-4">
                  {currentLang === 'vi' ? 'Mô hình Korean Street Food (dễ vận hành)' : 'Korean Street Food Model (Easy to Operate)'}
                </h3>
                <p className="text-coffee mb-6">
                  {currentLang === 'vi'
                    ? 'Set up nhanh, dễ vận hành, phù hợp mở nhỏ gọn hoặc mở rộng dần theo nhu cầu.'
                    : 'Quick setup, easy to operate, suitable for compact start or gradual expansion as needed.'}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-terracotta mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <strong>{currentLang === 'vi' ? 'Menu mẫu:' : 'Sample menu:'}</strong> {currentLang === 'vi' ? 'Corndog, Bibimbap, Kimbap, Ramen, Gà chiên' : 'Corndog, Bibimbap, Kimbap, Ramen, Fried Chicken'}
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-terracotta mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {currentLang === 'vi' ? 'Công thức ổn định, dễ chuẩn hóa, tối ưu chi phí' : 'Stable recipes, easy to standardize, cost-optimized'}
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-terracotta mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {currentLang === 'vi' ? 'Quy trình vận hành gọn, phù hợp nhân sự mỏng' : 'Streamlined operations, suitable for lean staffing'}
                  </li>
                </ul>
                <div className="border-t border-espresso/10 pt-6">
                  <p className="text-2xl font-bold text-espresso mb-2">
                    {currentLang === 'vi' ? 'Liên hệ' : 'Contact'}
                  </p>
                  <p className="text-coffee/60 text-sm mb-6">
                    {currentLang === 'vi' ? 'Tư vấn mô hình theo địa điểm' : 'Location-based model consultation'}
                  </p>
                  <Link href="/landing/korean-street-food" className="block w-full text-center border-2 border-espresso text-espresso px-8 py-4 font-semibold hover:bg-espresso/5 transition-colors">
                    {currentLang === 'vi' ? 'Chi tiết' : 'Details'}
                  </Link>
                </div>
              </div>

              {/* Custom Recipe Consultation */}
              <div className="bg-warmwhite border-2 border-espresso/20 p-8 md:col-span-2">
                <h3 className="text-2xl font-bold text-espresso mb-4">
                  {currentLang === 'vi' ? 'Tư vấn công thức tùy chỉnh 1-1' : 'Custom 1-on-1 Recipe Consultation'}
                </h3>
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  {/* Row 1, Col 1: Intro */}
                  <div>
                    <p className="text-coffee mb-4">
                      {currentLang === 'vi'
                        ? 'Bạn có món riêng muốn hoàn thiện? Bo sẽ giúp bạn tối ưu công thức cho nguyên liệu tại địa phương.'
                        : 'Have a specific dish you want to perfect? Bo will help you optimize the recipe for local ingredients.'}
                    </p>
                  </div>
                  {/* Row 1, Col 2: Contact/Price */}
                  <div className="md:pl-6 md:border-l md:border-espresso/10">
                    <p className="text-3xl font-bold text-espresso mb-2">
                      {currentLang === 'vi' ? 'Liên hệ' : 'Contact'}
                    </p>
                    <p className="text-coffee/60 text-sm">
                      {currentLang === 'vi' ? 'Giá tùy chỉnh theo nhu cầu' : 'Custom pricing based on needs'}
                    </p>
                  </div>
                  {/* Row 2, Col 1: Features list */}
                  <div>
                    <ul className="space-y-2 text-coffee">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-terracotta mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {currentLang === 'vi' ? 'Test và điều chỉnh công thức' : 'Recipe testing and adjustment'}
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-terracotta mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {currentLang === 'vi' ? 'Phù hợp với nguyên liệu toàn cầu' : 'Adapted for global ingredients'}
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-terracotta mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {currentLang === 'vi' ? 'Video hướng dẫn chi tiết' : 'Detailed video instructions'}
                      </li>
                    </ul>
                  </div>
                  {/* Row 2, Col 2: CTA button */}
                  <div className="md:pl-6 md:border-l md:border-espresso/10">
                    <Link href="/landing/premium-recipe-consultation" className="inline-block bg-terracotta text-white px-8 py-3 font-semibold hover:bg-terracotta/90 transition-colors">
                      {currentLang === 'vi' ? 'Chi tiết' : 'Details'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantee Section */}
        <section className="py-16 md:py-24 bg-espresso text-warmwhite">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-espresso" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t.guaranteeHeading}
            </h2>
            <p className="text-xl text-cream/80 mb-8 max-w-2xl mx-auto">
              {t.guaranteeText}
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-cream/10 p-6 rounded">
                <p className="text-gold font-bold mb-2">{t.guarantee1Title}</p>
                <p className="text-cream/70 text-sm">{t.guarantee1Text}</p>
              </div>
              <div className="bg-cream/10 p-6 rounded">
                <p className="text-gold font-bold mb-2">{t.guarantee2Title}</p>
                <p className="text-cream/70 text-sm">{t.guarantee2Text}</p>
              </div>
              <div className="bg-cream/10 p-6 rounded">
                <p className="text-gold font-bold mb-2">{t.guarantee3Title}</p>
                <p className="text-cream/70 text-sm">{t.guarantee3Text}</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-cream">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-terracotta uppercase tracking-widest text-sm mb-4 font-medium">
                {t.faqLabel}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-espresso">
                {t.faqHeading}
              </h2>
            </div>

            <div className="space-y-4">
              <details className="bg-warmwhite border border-espresso/10 group">
                <summary className="p-5 cursor-pointer flex justify-between items-center font-semibold text-espresso hover:bg-cream/50 transition-colors">
                  <span>{currentLang === 'vi' ? 'Chi phí dịch vụ như thế nào?' : 'What are the service costs?'}</span>
                  <span className="text-terracotta transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-5 text-coffee">
                  <p className="mb-3">
                    {currentLang === 'vi'
                      ? 'Đây không chỉ là một công thức. Đây là kết quả của:'
                      : 'This is not just a recipe. This is the result of:'}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{currentLang === 'vi' ? '10+ năm kinh nghiệm trong ngành F&B' : '10+ years of experience in F&B industry'}</li>
                    <li>{currentLang === 'vi' ? 'Hàng trăm lần test và điều chỉnh công thức' : 'Hundreds of recipe tests and adjustments'}</li>
                    <li>{currentLang === 'vi' ? 'Đào tạo tại Le Cordon Bleu và làm việc tại khách sạn 5 sao' : 'Trained at Le Cordon Bleu and worked at 5-star hotels'}</li>
                    <li>{currentLang === 'vi' ? 'Công thức được tối ưu riêng cho nguyên liệu địa phương của bạn' : 'Recipes optimized specifically for your local ingredients'}</li>
                    <li>{currentLang === 'vi' ? 'Hỗ trợ video call đến khi bạn thành công' : 'Video call support until you succeed'}</li>
                  </ul>
                  <p className="mt-3">
                    {currentLang === 'vi'
                      ? 'Chi phí sẽ phụ thuộc vào món bạn chọn và mức độ tùy chỉnh. Liên hệ trực tiếp để được báo giá chi tiết. Với công thức này, bạn có thể kinh doanh suốt đời và thu hồi vốn nhanh chóng.'
                      : 'Cost depends on the dish you choose and customization level. Contact directly for detailed pricing. With this recipe, you can run your business for life and recover investment quickly.'}
                  </p>
                </div>
              </details>

              <details className="bg-warmwhite border border-espresso/10 group">
                <summary className="p-5 cursor-pointer flex justify-between items-center font-semibold text-espresso hover:bg-cream/50 transition-colors">
                  <span>{currentLang === 'vi' ? 'Nếu Bo ở xa (Mỹ, Úc, Châu Âu) thì sao?' : 'What if Bo is far away (US, Australia, Europe)?'}</span>
                  <span className="text-terracotta transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-5 text-coffee">
                  {currentLang === 'vi'
                    ? 'Không vấn đề gì! Bo đã làm việc với khách hàng từ Na Uy, Pháp, Mỹ, và nhiều nơi khác. Quy trình của Bo được thiết kế để phù hợp với nguyên liệu ở bất kỳ đâu. Bạn chỉ cần chụp ảnh nguyên liệu tại siêu thị gần nhà và gửi cho Bo.'
                    : 'No problem at all! Bo has worked with clients from Norway, France, USA, and many other places. Bo\'s process is designed to adapt to ingredients anywhere. You just need to take photos of ingredients at your local supermarket and send them to Bo.'}
                </div>
              </details>

              <details className="bg-warmwhite border border-espresso/10 group">
                <summary className="p-5 cursor-pointer flex justify-between items-center font-semibold text-espresso hover:bg-cream/50 transition-colors">
                  <span>{currentLang === 'vi' ? 'Cam kết "không ngon hoàn tiền" có thật không?' : 'Is the "not delicious, full refund" guarantee real?'}</span>
                  <span className="text-terracotta transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-5 text-coffee">
                  {currentLang === 'vi'
                    ? '100% thật. Bo tự tin vào chất lượng công thức của mình. Nếu bạn làm theo đúng hướng dẫn mà không thành công, Bo sẽ hoàn lại toàn bộ tiền. Không cần lý do. Tuy nhiên trong hơn 10 năm, Bo chưa từng phải hoàn tiền vì công thức của Bo đã được test kỹ lưỡng.'
                    : '100% real. Bo is confident in the quality of the recipes. If you follow the instructions correctly and don\'t succeed, Bo will refund all your money. No questions asked. However, in over 10 years, Bo has never had to issue a refund because the recipes have been thoroughly tested.'}
                </div>
              </details>

              <details className="bg-warmwhite border border-espresso/10 group">
                <summary className="p-5 cursor-pointer flex justify-between items-center font-semibold text-espresso hover:bg-cream/50 transition-colors">
                  <span>{currentLang === 'vi' ? 'Bo có thể học nhiều món cùng lúc không?' : 'Can I learn multiple dishes at once?'}</span>
                  <span className="text-terracotta transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-5 text-coffee">
                  {currentLang === 'vi'
                    ? 'Có thể! Nếu bạn muốn học combo set (ví dụ: full set bánh mì với pate, thịt nguội, chả), Bo sẽ có giá ưu đãi. Liên hệ trực tiếp để Bo tư vấn gói phù hợp nhất với mục tiêu kinh doanh của bạn.'
                    : 'Absolutely! If you want to learn combo sets (e.g., full bánh mì set with pate, cold cuts, cha), Bo will offer special pricing. Contact directly so Bo can recommend the package that best fits your business goals.'}
                </div>
              </details>

              <details className="bg-warmwhite border border-espresso/10 group">
                <summary className="p-5 cursor-pointer flex justify-between items-center font-semibold text-espresso hover:bg-cream/50 transition-colors">
                  <span>{currentLang === 'vi' ? 'Có giới hạn số lượng học viên không?' : 'Is there a limit on student capacity?'}</span>
                  <span className="text-terracotta transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-5 text-coffee">
                  {currentLang === 'vi'
                    ? 'Có. Bo chỉ nhận số lượng học viên giới hạn mỗi năm để đảm bảo chất lượng. Mỗi học viên đều được Bo chăm sóc cá nhân hóa từ đầu đến cuối. Nếu bạn quan tâm, liên hệ sớm để được tư vấn chi tiết.'
                    : 'Yes. Bo only accepts a limited number of students each year to ensure quality. Each student receives personalized attention from start to finish. If interested, contact early for detailed consultation.'}
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-16 md:py-24 bg-espresso text-warmwhite">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t.ctaHeading}
            </h2>
            <p className="text-xl text-cream/80 mb-8 max-w-2xl mx-auto">
              {t.ctaText}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.facebook.com/profile.php?id=100009102362568"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-terracotta text-white px-8 py-4 font-semibold text-lg hover:bg-terracotta/90 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>{t.ctaButton}</span>
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-3 border-2 border-gold text-gold px-8 py-4 font-semibold text-lg hover:bg-gold/10 transition-colors"
              >
                <span>{t.ctaHomeButton}</span>
              </Link>
            </div>
            <p className="text-cream/60 text-sm mt-8">
              {t.ctaDisclaimer}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
