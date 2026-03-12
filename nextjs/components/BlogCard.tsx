'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from './LanguageToggle';

export interface BlogPost {
  slug: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  image?: string;
  date: string;
  status: 'published' | 'draft';
  author?: string;
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const currentLang = useLanguage();

  const title = currentLang === 'en' && post.titleEn ? post.titleEn : post.title;
  const excerpt = currentLang === 'en' && post.excerptEn ? post.excerptEn : post.excerpt;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (featured) {
    return (
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {post.image ? (
          <div className="bg-white border-2 border-[#083121]/10 p-3">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <Image
                src={post.image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#083121]/10 to-[#fcc56c]/10 h-96" />
        )}
        <div>
          <div className="text-xs uppercase tracking-wider text-[#fcc56c] font-bold mb-2">
            {currentLang === 'vi' ? 'BÀI VIẾT CHÍNH' : 'FEATURED POST'}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#083121] mb-4 leading-tight">
            <Link
              href={`/blog/${post.slug}`}
              className="hover:text-[#fcc56c] transition-colors"
            >
              {title}
            </Link>
          </h2>
          {excerpt && (
            <p className="text-[#4a5c52] text-lg mb-4 leading-relaxed">
              {excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-[#4a5c52]/70">
            <time>{formatDate(post.date)}</time>
            <span>•</span>
            <Link
              href={`/blog/${post.slug}`}
              className="text-[#fcc56c] font-medium hover:underline"
            >
              {currentLang === 'vi' ? 'Đọc tiếp' : 'Read more'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="border-b border-[#083121]/10 pb-8 hover:border-[#fcc56c]/30 transition-colors">
      <Link href={`/blog/${post.slug}`} className="block group">
        {post.image && (
          <div className="mb-4 bg-white border border-[#083121]/5 p-2">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <Image
                src={post.image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        )}
        <time className="text-xs text-[#4a5c52]/60 uppercase tracking-wider">
          {formatDate(post.date)}
        </time>
        <h2 className="text-xl font-bold font-serif text-[#083121] mt-2 mb-3 leading-tight group-hover:text-[#fcc56c] transition-colors">
          {title}
        </h2>
        {excerpt && (
          <p className="text-[#4a5c52] text-sm leading-relaxed line-clamp-3 mb-3">
            {excerpt}
          </p>
        )}
        <span className="text-[#fcc56c] text-sm font-medium group-hover:underline">
          {currentLang === 'vi' ? 'Đọc tiếp' : 'Read more'}
        </span>
      </Link>
    </article>
  );
}
