'use client';

import { useLanguage } from './LanguageToggle';
import Link from 'next/link';

interface FooterLink {
  href: string;
  label: { vi: string; en: string };
  dataVi?: string;
  dataEn?: string;
}

const footerLinks: FooterLink[] = [
  { href: '/story', label: { vi: 'Câu chuyện', en: 'Story' }, dataVi: 'Câu chuyện', dataEn: 'Story' },
  { href: '/products', label: { vi: 'Sản phẩm', en: 'Products' }, dataVi: 'Sản phẩm', dataEn: 'Products' },
  { href: '#courses', label: { vi: 'Tư vấn', en: 'Services' }, dataVi: 'Tư vấn', dataEn: 'Services' },
  { href: '/blog', label: { vi: 'Blog', en: 'Blog' } },
  { href: '#contact', label: { vi: 'Liên hệ', en: 'Contact' }, dataVi: 'Liên hệ', dataEn: 'Contact' },
];

export default function Footer() {
  const currentLang = useLanguage();

  return (
    <footer className="bg-[#083121] border-t border-[#fcc56c]/20 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand - Playfair Display */}
          <Link
            href="/"
            className="text-2xl font-bold text-[#fcc56c] hover:text-white transition-colors"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Bonucakes
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-6 text-[#fcc56c] text-sm">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors"
                data-vi={link.dataVi}
                data-en={link.dataEn}
              >
                {link.label[currentLang]}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60 text-sm">
          <p>&copy; 2026 Bonucakes</p>
        </div>
      </div>
    </footer>
  );
}
