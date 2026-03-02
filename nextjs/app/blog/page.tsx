'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BlogCard, { BlogPost } from '@/components/BlogCard';
import { useLanguage } from '@/components/LanguageToggle';
import Link from 'next/link';

const POSTS_PER_PAGE = 12;

// Component that uses search params - must be wrapped in Suspense
function BlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const currentLang = useLanguage();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const page = parseInt(searchParams.get('page') || '1');
        setCurrentPage(page);

        const response = await fetch(`/api/posts?page=${page}&limit=${POSTS_PER_PAGE}`);

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();

        // Map API response to BlogPost interface
        const mappedPosts: BlogPost[] = data.posts.map((post: any) => ({
          slug: post.slug,
          title: post.titleVi,
          titleEn: post.titleEn,
          excerpt: post.excerptVi || '',
          excerptEn: post.excerptEn || '',
          image: post.image,
          date: post.publishedAt || post.createdAt,
          status: 'published' as const,
          author: post.author || 'Uyen Nguyen',
        }));

        setPosts(mappedPosts);
        setTotalPages(data.pagination.totalPages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts');
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchParams]);

  const pagePosts = posts;
  const featuredPost = currentPage === 1 && pagePosts.length > 0 ? pagePosts[0] : null;
  const gridPosts = currentPage === 1 ? pagePosts.slice(1) : pagePosts;

  return (
    <>
      <Navbar />

      {/* Header */}
      <header className="bg-warmwhite py-24 md:py-28 border-b border-espresso/10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold font-serif text-espresso mb-4">
            Blog
          </h1>
          <p className="text-coffee max-w-2xl">
            {currentLang === 'vi'
              ? 'Chia sẻ kinh nghiệm, góc nhìn và hành trình trong ngành F&B'
              : 'Sharing experiences, insights and journey in F&B industry'}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-12 text-coffee">
            {currentLang === 'vi' ? 'Đang tải...' : 'Loading...'}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-terracotta mb-4 text-lg">{error}</div>
            <p className="text-coffee">
              {currentLang === 'vi'
                ? 'Vui lòng thử lại sau hoặc liên hệ với chúng tôi.'
                : 'Please try again later or contact us.'}
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-coffee">
            {currentLang === 'vi' ? 'Chưa có bài viết nào.' : 'No posts yet.'}
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-12 pb-12 border-b-2 border-espresso/20">
                <BlogCard post={featuredPost} featured />
              </div>
            )}

            {/* 3 Column Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {gridPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/blog?page=${currentPage - 1}`}
                    className="px-4 py-2 rounded-lg bg-white text-coffee border border-coffee/20 hover:bg-terracotta hover:text-white transition-colors"
                  >
                    {currentLang === 'vi' ? '← Trước' : '← Previous'}
                  </Link>
                )}

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Link
                      key={page}
                      href={`/blog?page=${page}`}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === currentPage
                          ? 'bg-terracotta text-white font-medium'
                          : 'bg-white text-coffee border border-coffee/20 hover:bg-terracotta hover:text-white'
                      }`}
                    >
                      {page}
                    </Link>
                  );
                })}

                {currentPage < totalPages && (
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    className="px-4 py-2 rounded-lg bg-white text-coffee border border-coffee/20 hover:bg-terracotta hover:text-white transition-colors"
                  >
                    {currentLang === 'vi' ? 'Tiếp →' : 'Next →'}
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-espresso border-t border-gold/20 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-2xl font-bold text-gold font-serif">
                Bonu F&B
              </span>
            </div>
            <div className="flex gap-6 text-cream/60 text-sm">
              <Link href="/" className="hover:text-white transition-colors">
                {currentLang === 'vi' ? 'Trang chủ' : 'Home'}
              </Link>
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
            </div>
          </div>
          <div className="border-t border-cream/10 mt-8 pt-8 text-center text-cream/40 text-sm">
            <p>&copy; 2026 Uyen Nguyen - F&B Business Design</p>
          </div>
        </div>
      </footer>
    </>
  );
}

// Main page component with Suspense boundary
export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-espresso">Loading...</div>
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}
