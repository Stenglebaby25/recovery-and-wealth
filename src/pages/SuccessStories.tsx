import Navigation from "@/components/Navigation";
import CaseStudiesSection from "@/components/CaseStudiesSection";

const SuccessStories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <CaseStudiesSection />
      </main>
    </div>
  );
};

export default SuccessStories;