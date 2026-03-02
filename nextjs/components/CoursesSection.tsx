'use client';

import { useLanguage } from './LanguageToggle';
import Link from 'next/link';

interface Course {
  id: string;
  slug: string;
  title: { vi: string; en: string };
  description: { vi: string; en: string };
  level: { vi: string; en: string };
  duration: { vi: string; en: string };
  price: string;
}

// Courses data from content.json
const courses: Course[] = [
  {
    id: 'premium-recipe-consultation',
    slug: 'premium-recipe-consultation',
    title: {
      vi: 'Tư vấn công thức độc quyền 1-1',
      en: 'Premium 1-1 Recipe Consultation',
    },
    description: {
      vi: 'Nhận công thức đã được test và tối ưu hóa cho nguyên liệu tại địa phương của bạn. Chụp ảnh nguyên liệu , Nhận công thức chuẩn chỉnh , Làm một phát ăn ngay. Cam kết hoàn tiền nếu không thành công.',
      en: 'Receive tested and optimized recipes for your local ingredients. Send ingredient photos , Get precise formula , Success on first try. Money-back guarantee.',
    },
    level: { vi: 'Signature', en: 'Signature' },
    duration: { vi: 'Trọn gói', en: 'Full package' },
    price: 'Liên hệ',
  },
  {
    id: 'vietnamese-food-mastery',
    slug: 'vietnamese-food-mastery',
    title: {
      vi: 'Chương trình Mastery Món Việt',
      en: 'Vietnamese Food Mastery Program',
    },
    description: {
      vi: 'Học làm chủ các món đặc trưng Việt Nam: Bánh mì (pate, thịt nguội, chả), Phở, và các món Việt truyền thống. Công thức được điều chỉnh cho bất kỳ địa điểm nào trên thế giới. Bao ngon, không ngon hoàn tiền.',
      en: 'Master signature Vietnamese dishes: Banh Mi (pate, cold cuts, cha), Pho, and traditional Vietnamese dishes. Recipes adapted for anywhere in the world. Quality guaranteed or money back.',
    },
    level: { vi: 'Signature', en: 'Signature' },
    duration: { vi: 'Theo nhu cầu', en: 'Customized' },
    price: 'Liên hệ',
  },
  {
    id: 'milk-tea-program',
    slug: 'milk-tea-program',
    title: {
      vi: 'Chương trình Trà sữa độc quyền',
      en: 'Milk Tea Signature Program',
    },
    description: {
      vi: 'Thiết kế menu trà sữa độc bản cho quán bạn: nền công thức vững, syrup/topping chuẩn, mix‑flavor tạo vị riêng. Kinh nghiệm thực chiến từ Trung Quốc, Thượng Hải, Đài Loan và chuỗi Nhật.',
      en: 'Design a unique milk tea menu for your shop: solid base recipes, proper syrups/toppings, and signature flavor design. Hands‑on experience from China (Shanghai), Taiwan, and Japanese chains.',
    },
    level: { vi: 'Signature', en: 'Signature' },
    duration: { vi: 'Theo nhu cầu', en: 'Customized' },
    price: 'Liên hệ',
  },
  {
    id: 'salted-egg-sponge-cake',
    slug: 'salted-egg-sponge-cake',
    title: {
      vi: 'Bông lan trứng muối - Công thức đặc trưng',
      en: 'Salted Egg Sponge Cake - Signature Recipe',
    },
    description: {
      vi: 'Công thức nổi tiếng được duy trì suốt 10+ năm với chất lượng ổn định. Tan trong miệng, để qua đêm vẫn mềm mịn không xẹp. Tự nghiên cứu và hoàn thiện qua hàng trăm lần thử nghiệm, sau đó nâng cấp với nguyên liệu 5 sao từ khách sạn Pháp.',
      en: 'Famous recipe maintained for 10+ years with consistent quality. Melts in mouth, stays soft overnight. Self-developed and perfected through hundreds of tests, upgraded with 5-star ingredients from French hotels.',
    },
    level: { vi: 'Signature', en: 'Signature' },
    duration: { vi: 'Công thức trọn đời', en: 'Lifetime formula' },
    price: 'Liên hệ',
  },
];

export default function CoursesSection() {
  const currentLang = useLanguage();

  return (
    <section id="courses" className="py-16 md:py-24 bg-warmwhite fade-in">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p
            className="text-terracotta uppercase tracking-widest text-sm mb-4 font-medium"
            data-vi="Dịch vụ & Khóa học"
            data-en="Services & Courses"
          >
            {currentLang === 'vi' ? 'Dịch vụ & Khóa học' : 'Services & Courses'}
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-espresso mb-4"
            data-vi="Dịch vụ tư vấn & Đào tạo F&B"
            data-en="F&B Consulting & Training Services"
          >
            {currentLang === 'vi' ? 'Dịch vụ tư vấn & Đào tạo F&B' : 'F&B Consulting & Training Services'}
          </h2>
          <p
            className="text-coffee max-w-2xl mx-auto"
            data-vi="Tư vấn công thức ẩm thực độc quyền 1-1. Cam kết thành công ngay lần đầu hoặc hoàn tiền."
            data-en="Premium 1-1 culinary recipe consultation. Success on first try or money back guarantee."
          >
            {currentLang === 'vi'
              ? 'Tư vấn công thức ẩm thực độc quyền 1-1. Cam kết thành công ngay lần đầu hoặc hoàn tiền.'
              : 'Premium 1-1 culinary recipe consultation. Success on first try or money back guarantee.'}
          </p>
        </div>

        {/* Courses Grid - Mobile: Cards, Desktop: Table */}
        <div>
          {/* Mobile: Stacked Cards */}
          <div className="md:hidden space-y-4">
            {courses.map((course) => {
              const getLinkPath = (slug: string) => {
                if (slug === 'salted-egg-sponge-cake') return '/landing/salted-egg-sponge-cake';
                if (slug === 'vietnamese-food-mastery') return '/landing/vietnamese-food-mastery';
                if (slug === 'premium-recipe-consultation') return '/landing/premium-recipe-consultation';
                if (slug === 'milk-tea-program') return '/landing/milk-tea-program';
                return `/course/${slug}`;
              };

              return (
                <div
                  key={course.slug}
                  className="bg-cream border border-espresso/10 p-6 hover-lift flex flex-col"
                >
                  <div>
                    <div className="flex gap-3 mb-3 text-xs text-coffee">
                      <span>{course.level[currentLang]}</span>
                      <span>·</span>
                      <span>{course.duration[currentLang]}</span>
                    </div>
                    <h3 className="text-lg font-bold text-espresso mb-2">
                      {course.title[currentLang]}
                    </h3>
                    <p className="text-coffee text-sm">{course.description[currentLang]}</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center pt-4 border-t border-espresso/10">
                    <span className="text-espresso font-semibold">{course.price}</span>
                    <Link
                      href={getLinkPath(course.slug)}
                      className="text-sm text-coffee hover:text-terracotta transition-colors"
                      data-vi="Chi tiết"
                      data-en="Details"
                    >
                      {currentLang === 'vi' ? 'Chi tiết' : 'Details'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: Table */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left bg-cream">
                  <th className="p-3 border border-espresso/10 w-64">
                    {currentLang === 'vi' ? 'Dịch vụ/Khóa học' : 'Service/Course'}
                  </th>
                  <th className="p-3 border border-espresso/10">
                    {currentLang === 'vi' ? 'Mô tả' : 'Description'}
                  </th>
                  <th className="p-3 border border-espresso/10 w-32"></th>
                </tr>
              </thead>
              <tbody className="text-coffee">
                {courses.map((course, index) => {
                  const getLinkPath = (slug: string) => {
                    if (slug === 'salted-egg-sponge-cake') return '/landing/salted-egg-sponge-cake';
                    if (slug === 'vietnamese-food-mastery') return '/landing/vietnamese-food-mastery';
                    if (slug === 'premium-recipe-consultation') return '/landing/premium-recipe-consultation';
                    if (slug === 'milk-tea-program') return '/landing/milk-tea-program';
                    return `/course/${slug}`;
                  };

                  return (
                    <tr key={course.slug} className={index % 2 ? 'bg-warmwhite/50' : ''}>
                      <td className="p-3 border border-espresso/10 font-semibold text-espresso align-top">
                        {course.title[currentLang]}
                      </td>
                      <td className="p-3 border border-espresso/10 text-sm leading-relaxed align-top">
                        {course.description[currentLang]}
                      </td>
                      <td className="p-3 border border-espresso/10 align-top">
                        <Link
                          href={getLinkPath(course.slug)}
                          className="text-sm text-terracotta hover:underline"
                          data-vi="Chi tiết"
                          data-en="Details"
                        >
                          {currentLang === 'vi' ? 'Chi tiết' : 'Details'}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            href="#contact"
            className="inline-block bg-terracotta text-white px-8 py-4 font-semibold hover:bg-terracotta/90 transition-colors"
            data-vi="Đăng ký tư vấn khóa học"
            data-en="Register for course consultation"
          >
            {currentLang === 'vi' ? 'Đăng ký tư vấn khóa học' : 'Register for course consultation'}
          </Link>
        </div>
      </div>
    </section>
  );
}
