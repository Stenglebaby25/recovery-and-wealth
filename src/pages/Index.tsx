import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import LeadMagnetSection from "@/components/LeadMagnetSection";
import CalculatorsSection from "@/components/CalculatorsSection";
import LearningHub from "@/components/LearningHub";
import Dashboard from "@/components/Dashboard";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import CoachingSection from "@/components/CoachingSection";
import PricingSection from "@/components/PricingSection";
import SocialSection from "@/components/SocialSection";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <LeadMagnetSection />
        <CalculatorsSection />
        {user ? (
          <Dashboard />
        ) : (
          <LearningHub />
        )}
        <CaseStudiesSection />
        <CoachingSection />
        <PricingSection />
        <SocialSection />
      </main>
    </div>
  );
};

export default Index;
