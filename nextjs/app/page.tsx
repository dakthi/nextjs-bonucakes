import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import MentorSection from '@/components/MentorSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import BlogHighlights from '@/components/BlogHighlights';
import FAQ from '@/components/FAQ';
import CoursesSection from '@/components/CoursesSection';
import CTASection from '@/components/CTASection';
import FadeInObserver from '@/components/FadeInObserver';

export default function Home() {
  return (
    <>
      <FadeInObserver />
      <Hero />
      <StatsSection />
      <MentorSection />
      <FeaturedProducts />
      <BlogHighlights />
      <FAQ />
      <CoursesSection />
      <CTASection />
    </>
  );
}
