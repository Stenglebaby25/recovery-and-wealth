import Navigation from "@/components/Navigation";
import PricingSection from "@/components/PricingSection";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <PricingSection />
      </main>
    </div>
  );
};

export default Pricing;