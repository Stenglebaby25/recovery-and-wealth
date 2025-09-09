import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CoursePreview from "@/components/CoursePreview";
import CoachingSection from "@/components/CoachingSection";
import PricingSection from "@/components/PricingSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <CoursePreview />
        <CoachingSection />
        <PricingSection />
      </main>
    </div>
  );
};

export default Index;
