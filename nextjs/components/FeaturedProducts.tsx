'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageToggle';
import Link from 'next/link';
import Image from 'next/image';

interface ProductPrice {
  amount: number;
  currency: string;
  displayPrice: string;
  displayPriceVi?: string;
  unit?: { en: string; vi: string };
}

interface Product {
  id: string;
  slug: string;
  name: { vi: string; en: string };
  shortDescription: { vi: string; en: string };
  images: string[];
  price: ProductPrice;
  available: boolean;
  featured: boolean;
  sortOrder: number;
}

export default function FeaturedProducts() {
  const currentLang = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch('/products.json');
        const data = await res.json();

        // Filter for available and featured products, then sort by sortOrder
        const featured = (data.products || [])
          .filter((p: Product) => p.available && p.featured)
          .sort((a: Product, b: Product) => (a.sortOrder || 999) - (b.sortOrder || 999))
          .slice(0, 8);

        setProducts(featured);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const formatPrice = (product: Product) => {
    if (product.price?.displayPrice) {
      return product.price.displayPrice;
    }
    const amount = Number(product.price?.amount || 0);
    const currency = product.price?.currency || 'GBP';
    return amount > 0 ? (currency === 'GBP' ? `£${amount}` : `${amount.toLocaleString()}₫`) : '';
  };

  return (
    <section className="py-16 md:py-24 bg-espresso text-warmwhite fade-in">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p
            className="text-gold uppercase tracking-widest text-sm mb-4 font-medium"
            data-vi="Sản phẩm"
            data-en="Products"
          >
            Sản phẩm
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            data-vi="Bếp Bà Bo"
            data-en="Bếp Bà Bo"
          >
            Bếp Bà Bo
          </h2>
          <p
            className="text-lg text-cream/80 max-w-2xl mx-auto"
            data-vi="Đồ ăn Việt Nam tự làm với công thức truyền thống. Chất lượng tươi ngon, đóng gói cẩn thận, giao hàng nhanh chóng."
            data-en="Homemade Vietnamese food with traditional recipes. Fresh quality, carefully packaged, fast delivery."
          >
            Đồ ăn Việt Nam tự làm với công thức truyền thống. Chất lượng tươi ngon, đóng gói cẩn thận, giao hàng nhanh chóng.
          </p>
        </div>

        {/* Products Carousel/Grid */}
        <div className="relative">
          <div
            id="featured-products-track"
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible md:snap-none"
          >
            {loading ? (
              <div className="col-span-full text-center text-cream/60">Loading products...</div>
            ) : products.length > 0 ? (
              products.map((product) => {
                const image = (product.images && product.images[0]) || '/placeholder-product.webp';
                const name = product.name?.[currentLang] || product.name?.vi || '';
                const desc = product.shortDescription?.[currentLang] || product.shortDescription?.vi || '';
                const priceText = formatPrice(product);

                return (
                  <article
                    key={product.slug}
                    className="snap-start flex-none w-72 md:w-auto bg-white text-espresso border border-espresso/10 hover-lift"
                  >
                    <Link href={`/banh-mi/product?slug=${product.slug}`} className="block">
                      <div className="relative w-full h-44 bg-cream">
                        <Image
                          src={image}
                          alt={name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 288px, (max-width: 1024px) 33vw, 25vw"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = '/placeholder-product.webp';
                          }}
                        />
                      </div>
                    </Link>
                    <div className="p-4 flex flex-col h-48">
                      <h3 className="font-bold text-lg line-clamp-2 mb-1">
                        <Link
                          href={`/banh-mi/product?slug=${product.slug}`}
                          className="hover:text-terracotta transition-colors"
                        >
                          {name}
                        </Link>
                      </h3>
                      <p className="text-coffee/80 text-sm line-clamp-2 mb-3">
                        {desc}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-semibold text-terracotta">{priceText}</span>
                        <Link
                          href={`/banh-mi/product?slug=${product.slug}`}
                          className="text-sm text-terracotta hover:underline"
                          data-vi="Chi tiết"
                          data-en="View details"
                        >
                          {currentLang === 'vi' ? 'Chi tiết' : 'View details'}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full text-center text-cream/60">No featured products available</div>
            )}
          </div>
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-8">
          <Link
            href="/products"
            className="bg-gold text-espresso px-8 py-4 font-semibold hover:bg-gold/90 transition-colors inline-block"
            data-vi="Toàn bộ sản phẩm"
            data-en="All Products"
          >
            {currentLang === 'vi' ? 'Toàn bộ sản phẩm' : 'All Products'}
          </Link>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
