'use client';

import { useLanguage } from './LanguageToggle';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  date: string;
  status: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogHighlights() {
  const currentLang = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogPosts() {
      try {
        const res = await fetch('/posts.json');
        const allPosts = await res.json();
        const published = allPosts
          .filter((p: BlogPost) => p.status === 'published')
          .sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);

        setPosts(published);
      } catch (e) {
        console.error('Error loading blog posts:', e);
      } finally {
        setLoading(false);
      }
    }

    loadBlogPosts();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-espresso fade-in">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-gold uppercase tracking-widest text-sm mb-4 font-medium" data-en="From the Blog" data-vi="Từ Blog">
            {currentLang === 'vi' ? 'Từ Blog' : 'From the Blog'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-warmwhite mb-4" data-en="Latest Articles" data-vi="Bài viết mới nhất">
            {currentLang === 'vi' ? 'Bài viết mới nhất' : 'Latest Articles'}
          </h2>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 text-center text-cream/60">Đang tải...</div>
          ) : posts.length === 0 ? (
            <div className="col-span-3 text-center text-cream/60">Chưa có bài viết nào.</div>
          ) : (
            posts.map((post) => (
              <article
                key={post.slug}
                className="bg-cream/10 rounded-lg overflow-hidden hover:bg-cream/20 transition-colors hover-lift"
              >
                {post.image ? (
                  <Link href={`/blog/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-40 object-cover"
                    />
                  </Link>
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-terracotta/30 to-gold/30"></div>
                )}
                <div className="p-5">
                  <time className="text-sm text-cream/50">
                    {formatDate(post.date)}
                  </time>
                  <h3 className="text-lg font-bold text-warmwhite mt-1 mb-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-gold transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-cream/70 text-sm line-clamp-2">{post.excerpt}</p>
                </div>
              </article>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-block border border-gold/50 text-gold px-8 py-3 font-semibold hover:bg-gold/10 transition-colors"
            data-en="View all articles"
            data-vi="Xem tất cả bài viết"
          >
            {currentLang === 'vi' ? 'Xem tất cả bài viết' : 'View all articles'}
          </Link>
        </div>
      </div>
    </section>
  );
}
