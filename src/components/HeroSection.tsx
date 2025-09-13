import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Recovery &{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Wealth
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Financial literacy education designed specifically for people in recovery. 
            Build the money skills that support lasting sobriety.
          </p>
          
          {/* Recovery Gap Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 shadow-soft">
              <div className="text-2xl font-bold text-primary">27%</div>
              <div className="text-sm text-muted-foreground">cite financial issues as major relapse reason</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 shadow-soft">
              <div className="text-2xl font-bold text-secondary">63%</div>
              <div className="text-sm text-muted-foreground">of Americans live paycheck-to-paycheck</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 shadow-soft">
              <div className="text-2xl font-bold text-accent">40-60%</div>
              <div className="text-sm text-muted-foreground">relapse rate in first year of recovery</div>
            </div>
          </div>
          
          {/* Recovery Gap Explanation */}
          <div className="bg-card/30 backdrop-blur-sm rounded-lg p-6 mb-10 max-w-3xl mx-auto border border-primary/20">
            <h3 className="text-lg font-semibold text-foreground mb-2">The Recovery Gap</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Traditional treatment programs overlook critical life skills like financial literacy, leaving a dangerous gap 
              that contributes to relapse. We bridge that gap with practical money skills that support lasting recovery.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Start Your Financial Recovery
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              For Treatment Centers
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 text-sm text-muted-foreground">
            <p>Created by people in recovery, for people in recovery</p>
            <p className="mt-2">Compatible with 12-Step and SMART Recovery programs</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;