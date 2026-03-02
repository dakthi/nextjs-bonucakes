import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import MentorSection from '@/components/MentorSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import BlogHighlights from '@/components/BlogHighlights';
import FAQ from '@/components/FAQ';
import CoursesSection from '@/components/CoursesSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import FadeInObserver from '@/components/FadeInObserver';

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <FadeInObserver />
      <Navbar />

      <main>
        <Hero />
        <StatsSection />
        <MentorSection />
        <FeaturedProducts />
        <BlogHighlights />
        <FAQ />
        <CoursesSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
