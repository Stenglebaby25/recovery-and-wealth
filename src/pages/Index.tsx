import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import LeadMagnetSection from "@/components/LeadMagnetSection";
import CalculatorsSection from "@/components/CalculatorsSection";
import LearningHub from "@/components/LearningHub";
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
        <LearningHub />
        <CaseStudiesSection />
        <CoachingSection />
        <PricingSection />
        <SocialSection />
      </main>
    </div>
  );
};

export default Index;
