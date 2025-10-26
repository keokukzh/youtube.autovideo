import { HeroSection } from '@/components/landing/hero/HeroSection';
import { FeaturesGrid } from '@/components/landing/features/FeaturesGrid';
import { PricingSection } from '@/components/landing/pricing/PricingSection';
import TestimonialsSection from '@/components/landing/testimonials/TestimonialsSection';
import FAQSection from '@/components/landing/faq/FAQSection';
import CTASection from '@/components/landing/hero/CTASection';
import Footer from '@/components/landing/footer/Footer';
import { LandingNav } from '@/components/landing/navigation/LandingNav';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
