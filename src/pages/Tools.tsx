import Navigation from "@/components/Navigation";
import CalculatorsSection from "@/components/CalculatorsSection";
import ResourceLibrary from "@/components/premium/ResourceLibrary";

const Tools = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-20">
          <ResourceLibrary />
        </div>
        <CalculatorsSection />
      </main>
    </div>
  );
};

export default Tools;