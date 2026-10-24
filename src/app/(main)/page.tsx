import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import TrendingSection from '@/components/home/TrendingSection';
import StatesSection from '@/components/home/StatesSection';
import IndiaMapSection from '@/components/home/IndiaMapSection';
import ToursSection from '@/components/home/ToursSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import GuidesSection from '@/components/home/GuidesSection';
import AgencySection from '@/components/home/AgencySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterCta from '@/components/home/NewsletterCta';

// Each section is its own client component, so state changes (slideshow, filters)
// only re-render the section that owns them instead of the whole page.
export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      <HeroSection />
      {/* Lead with what we sell and why to book with us; destination guides follow. */}
      <ToursSection />
      <FeaturesSection />
      <TestimonialsSection />
      <AgencySection />
      <CategoriesSection />
      <TrendingSection />
      <IndiaMapSection />
      <StatesSection />
      <GuidesSection />
      <NewsletterCta />
    </div>
  );
}
