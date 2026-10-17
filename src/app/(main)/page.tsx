import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import TrendingSection from '@/components/home/TrendingSection';
import StatesSection from '@/components/home/StatesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import GuidesSection from '@/components/home/GuidesSection';
import BudgetSection from '@/components/home/BudgetSection';
import AgencySection from '@/components/home/AgencySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterCta from '@/components/home/NewsletterCta';

// Each section is its own client component, so state changes (slideshow, filters)
// only re-render the section that owns them instead of the whole page.
export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      <HeroSection />
      <CategoriesSection />
      <TrendingSection />
      <StatesSection />
      <FeaturesSection />
      <BudgetSection />
      <AgencySection />
      <GuidesSection />
      <TestimonialsSection />
      <NewsletterCta />
    </div>
  );
}
