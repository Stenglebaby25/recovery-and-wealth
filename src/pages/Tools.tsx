import Navigation from "@/components/Navigation";
import CalculatorsSection from "@/components/CalculatorsSection";
import ResourceLibrary from "@/components/premium/ResourceLibrary";
import FinancialImpactSection from "@/components/FinancialImpactSection";
import OpportunityCostVisualizer from "@/components/OpportunityCostVisualizer";
import QuickDailyCheckIn from "@/components/QuickDailyCheckIn";

const Tools = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Quick Daily Check-in - Free Tool */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <QuickDailyCheckIn />
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <ResourceLibrary />
        </div>
        <div className="container mx-auto px-4 py-12">
          <OpportunityCostVisualizer />
        </div>
        <FinancialImpactSection />
        <CalculatorsSection />
      </main>
    </div>
  );
};

export default Tools;