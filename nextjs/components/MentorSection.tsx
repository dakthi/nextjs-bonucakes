'use client';

import { useLanguage } from './LanguageToggle';
import Link from 'next/link';
import Image from 'next/image';

interface MentorContent {
  tagline: { vi: string; en: string };
  greeting: { vi: string; en: string };
  name: string;
  bio1: { vi: string; en: string };
  bio2: { vi: string; en: string };
  ctaButton: { vi: string; en: string };
}

const mentorContent: MentorContent = {
  tagline: {
    vi: 'Mở quán nhỏ tại UK – Tránh những sai lầm đắt giá',
    en: 'No shortcuts. Just real guidance for small F&B businesses.',
  },
  greeting: {
    vi: 'Chào bạn,<br>mình là',
    en: "Hello,<br>I'm",
  },
  name: 'Nguyễn Ngọc Minh Uyên',
  bio1: {
    vi: 'Mình đã từng bắt đầu mà không biết mình đang thiếu điều gì.\nMình đã từng trả giá vì những sai lầm rất nhỏ nhưng rất đắt.\nMình đã đi qua hành trình hơn 10 năm trong ngành F&B, từ phụ bếp đến chủ nhà hàng. Mình đã trải qua niềm vui của những đêm đông khách và nỗi đau của việc đóng cửa nhà hàng.\n\nVì vậy, mình không hứa hẹn những con đường nhanh hay kết quả hào nhoáng.\nỞ đây để giúp bạn bắt đầu đúng thứ tự, tránh những bước mù mờ,\nvà xây một mô hình F&B nhỏ có thể sống được trong đời thực.',
    en: 'I once started without knowing what I was missing.\nI\'ve paid for very small mistakes and the cost was never small.\n\nI\'ve spent over ten years in the F&B industry, moving from a kitchen porter to a restaurant owner. I\'ve experienced the joy of fully booked nights, and the pain of shutting down a restaurant.\n\nThat\'s why I don\'t promise shortcuts or glamorous outcomes.\nI\'m here to help you start in the right order, avoid unnecessary confusion,\nand build a small F&B model that can actually survive in the real world.',
  },
  bio2: {
    vi: 'Hiện tại, mình đang trực tiếp điều hành nhà hàng Memoire Saigon tại Wales.\n\nMình không tự hào vì những con số, mà vì những gì mình đã học được sau từng va vấp. Có những bài học chỉ đến khi bạn thật sự trả giá, thật sự ngã, rồi tự mình đứng dậy và đi tiếp.\n\nNhững trải nghiệm đó định hình cách mình làm nghề hôm nay chậm hơn, chắc hơn, và thực tế hơn.\n',
    en: 'At present, I\'m directly involved in running Memoire Saigon restaurant in Wales.\n\nWhat matters most to me isn\'t the numbers, but the lessons earned through experience. Some lessons only come through setbacks when you fall, take responsibility for the outcome, and find your way forward with clarity and resilience.',
  },
  ctaButton: {
    vi: 'Tìm hiểu thêm về mình',
    en: 'More about me',
  },
};

const badges = ['Le Cordon Bleu', 'F&B business mentor'];

export default function MentorSection() {
  const currentLang = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-light">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <p className="text-secondary uppercase tracking-widest text-sm mb-4 font-medium">
              {mentorContent.tagline[currentLang]}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              <span
                dangerouslySetInnerHTML={{
                  __html: mentorContent.greeting[currentLang],
                }}
              />{' '}
              <span className="text-secondary">{mentorContent.name}</span>
            </h2>
            <p
              className="text-muted mb-4"
              dangerouslySetInnerHTML={{ __html: mentorContent.bio1[currentLang] }}
            />
            <p
              className="text-muted"
              dangerouslySetInnerHTML={{ __html: mentorContent.bio2[currentLang] }}
            />

            {/* Badges */}
            <div className="flex gap-4 mt-6 flex-wrap">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className="bg-primary text-light px-4 py-2 text-sm"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <Link
                href="/story"
                className="inline-block bg-secondary text-primary px-6 py-3 font-semibold hover:bg-secondary/90 transition-colors"
              >
                {mentorContent.ctaButton[currentLang]}
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <Image
                src="https://thielts.chartedconsultants.com/bonu/profile.webp"
                alt="Uyen Nguyen"
                fill
                className="rounded-full border-4 border-secondary/30 shadow-2xl object-cover"
                sizes="(max-width: 768px) 256px, 320px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
