import Navigation from "@/components/Navigation";
import CalculatorsSection from "@/components/CalculatorsSection";

const Tools = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <CalculatorsSection />
      </main>
    </div>
  );
};

export default Tools;