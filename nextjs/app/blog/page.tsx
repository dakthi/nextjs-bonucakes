'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BlogCard, { BlogPost } from '@/components/BlogCard';
import { useLanguage } from '@/components/LanguageToggle';
import Link from 'next/link';

// Mock blog posts data
const mockPosts: BlogPost[] = [
  {
    slug: 'why-most-fb-businesses-fail',
    title: 'Tại sao 80% doanh nghiệp F&B thất bại trong 5 năm đầu',
    titleEn: 'Why 80% of F&B Businesses Fail Within 5 Years',
    excerpt: 'Bài học từ 10 năm kinh doanh: Những sai lầm phổ biến khiến nhà hàng thất bại và cách tránh chúng.',
    excerptEn: 'Lessons from 10 years in business: Common mistakes that cause restaurant failures and how to avoid them.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60',
    date: '2026-02-15',
    status: 'published',
    author: 'Uyen Nguyen'
  },
  {
    slug: 'building-authentic-brand',
    title: 'Xây dựng thương hiệu F&B từ chính mình',
    titleEn: 'Building an Authentic F&B Brand',
    excerpt: 'Tại sao "bản sắc" quan trọng hơn "marketing", và làm thế nào để khách hàng nhớ đến bạn.',
    excerptEn: 'Why "authenticity" matters more than "marketing", and how to make customers remember you.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60',
    date: '2026-02-10',
    status: 'published',
    author: 'Uyen Nguyen'
  },
  {
    slug: 'from-failure-to-best-banh-mi',
    title: 'Từ thất bại đến Best Bánh Mì Manchester',
    titleEn: 'From Failure to Best Bánh Mì in Manchester',
    excerpt: 'Câu chuyện phía sau giải thưởng và những gì tôi đã học được từ những lần vấp ngã.',
    excerptEn: 'The story behind the award and what I learned from falling down.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60',
    date: '2026-02-05',
    status: 'published',
    author: 'Uyen Nguyen'
  },
  {
    slug: 'the-art-of-menu-design',
    title: 'Nghệ thuật thiết kế menu: Hơn cả món ăn',
    titleEn: 'The Art of Menu Design: More Than Just Food',
    excerpt: 'Menu là câu chuyện bạn kể về nhà hàng. Cách thiết kế menu để tăng doanh thu và trải nghiệm khách hàng.',
    excerptEn: 'Your menu tells your restaurant\'s story. How to design a menu that boosts revenue and customer experience.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60',
    date: '2026-01-28',
    status: 'published',
    author: 'Uyen Nguyen'
  },
  {
    slug: 'staff-retention-secrets',
    title: 'Bí quyết giữ chân nhân viên trong ngành F&B',
    titleEn: 'Staff Retention Secrets in F&B Industry',
    excerpt: 'Vấn đề lớn nhất không phải là tìm nhân viên, mà là giữ họ lại. Những điều tôi làm để team gắn bó 5+ năm.',
    excerptEn: 'The biggest problem isn\'t finding staff, it\'s keeping them. What I did to retain team members for 5+ years.',
    image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&auto=format&fit=crop&q=60',
    date: '2026-01-20',
    status: 'published',
    author: 'Uyen Nguyen'
  },
  {
    slug: 'food-cost-management',
    title: 'Quản lý chi phí thực phẩm: Từ lý thuyết đến thực tế',
    titleEn: 'Food Cost Management: From Theory to Practice',
    excerpt: 'Làm sao để giảm lãng phí 30% mà vẫn giữ chất lượng món ăn. Kinh nghiệm thực tế từ nhà hàng.',
    excerptEn: 'How to reduce waste by 30% while maintaining food quality. Real-world experience from the restaurant.',
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&auto=format&fit=crop&q=60',
    date: '2026-01-15',
    status: 'published',
    author: 'Uyen Nguyen'
  },
  {
    slug: 'customer-service-mindset',
    title: 'Phục vụ khách hàng: Nghệ thuật hay kỹ thuật?',
    titleEn: 'Customer Service: Art or Technique?',
    excerpt: 'Tại sao training không đủ? Làm thế nào để tạo ra team phục vụ từ trái tim, không phải từ sổ tay.',
    excerptEn: 'Why training isn\'t enough? How to create a team that serves from the heart, not from a manual.',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=60',
    date: '2026-01-08',
    status: 'published',
    author: 'Uyen Nguyen'
  },
  {
    slug: 'seasonal-menu-strategy',
    title: 'Chiến lược menu theo mùa: Tại sao quan trọng',
    titleEn: 'Seasonal Menu Strategy: Why It Matters',
    excerpt: 'Thay đổi menu theo mùa không chỉ về nguyên liệu tươi, mà còn về câu chuyện và kết nối với khách hàng.',
    excerptEn: 'Changing menu by season isn\'t just about fresh ingredients, it\'s about storytelling and customer connection.',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&auto=format&fit=crop&q=60',
    date: '2026-01-01',
    status: 'published',
    author: 'Uyen Nguyen'
  },
  {
    slug: 'digital-transformation-restaurant',
    title: 'Chuyển đổi số cho nhà hàng nhỏ',
    titleEn: 'Digital Transformation for Small Restaurants',
    excerpt: 'Không cần đầu tư lớn. Những công cụ đơn giản giúp nhà hàng nhỏ cạnh tranh với chuỗi lớn.',
    excerptEn: 'No large investment needed. Simple tools that help small restaurants compete with big chains.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    date: '2025-12-20',
    status: 'published',
    author: 'Uyen Nguyen'
  }
];

const POSTS_PER_PAGE = 12;

// Component that uses search params - must be wrapped in Suspense
function BlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const currentLang = useLanguage();
  const searchParams = useSearchParams();

  useEffect(() => {
    // In production, this would fetch from an API or CMS
    // For now, we use mock data
    const page = parseInt(searchParams.get('page') || '1');
    setCurrentPage(page);

    // Simulate loading
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 300);
  }, [searchParams]);

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const pagePosts = posts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

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
