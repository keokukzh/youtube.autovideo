import { HeroSection } from '@/components/landing/hero/HeroSection';
import { FeaturesGrid } from '@/components/landing/features/FeaturesGrid';
import { LandingNav } from '@/components/landing/navigation/LandingNav';
import { Suspense, lazy } from 'react';

// Lazy load heavy landing page sections for better performance
const PricingSection = lazy(() => 
  import('@/components/landing/pricing/PricingSection').then((module) => ({
    default: module.PricingSection,
  }))
);

const TestimonialsSection = lazy(() => 
  import('@/components/landing/testimonials/TestimonialsSection').then((module) => ({
    default: module.default,
  }))
);

const FAQSection = lazy(() => 
  import('@/components/landing/faq/FAQSection').then((module) => ({
    default: module.default,
  }))
);

const CTASection = lazy(() => 
  import('@/components/landing/hero/CTASection').then((module) => ({
    default: module.default,
  }))
);

const Footer = lazy(() => 
  import('@/components/landing/footer/Footer').then((module) => ({
    default: module.default,
  }))
);

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
          <PricingSection />
        </Suspense>
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
          <FAQSection />
        </Suspense>
        <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100" />}>
          <CTASection />
        </Suspense>
      </main>
      <Suspense fallback={<div className="h-32 animate-pulse bg-gray-100" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
