import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import LeadMagnetSection from "@/components/LeadMagnetSection";
import CalculatorsSection from "@/components/CalculatorsSection";
import CoursePreview from "@/components/CoursePreview";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import CoachingSection from "@/components/CoachingSection";
import PricingSection from "@/components/PricingSection";
import SocialSection from "@/components/SocialSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <LeadMagnetSection />
        <CalculatorsSection />
        <CoursePreview />
        <CaseStudiesSection />
        <CoachingSection />
        <PricingSection />
        <SocialSection />
      </main>
    </div>
  );
};

export default Index;
