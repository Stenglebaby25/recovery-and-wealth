import { Button } from "@/components/ui/button";
import { Heart, Calculator, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import serenityImage from "@/assets/serenity-meditation.jpg";
import recoveryWealthLogo from "@/assets/recovery-wealth-logo-bold.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35"
        style={{ backgroundImage: `url(${serenityImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-80" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Recovery & Wealth Logo */}
          <div className="mb-6 flex justify-center">
            <img 
              src={recoveryWealthLogo} 
              alt="Recovery & Wealth" 
              className="h-24 md:h-32 w-auto object-contain"
            />
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight animate-fade-in text-foreground">
            Your Journey to Financial{" "}
            <span className="text-primary">Recovery</span>
            <span className="text-muted-foreground"> & </span>
            <span className="text-secondary">Wealth</span>
          </h1>
          
          {/* New Intro Text */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Build wealth, recover financially, and create lasting change with our comprehensive learning platform. 
            Start your transformation today.
          </p>
          
          {/* Free Tools Section - Right below intro */}
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-2xl mx-auto border border-border shadow-soft">
            <h3 className="text-lg font-semibold text-foreground mb-4">Free Tools to Get Started</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link 
                to="/recovery-tools" 
                className="flex flex-col items-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group"
              >
                <Heart className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground">HALT Check-In</span>
                <span className="text-xs text-muted-foreground">Crisis prevention tool</span>
              </Link>
              <Link 
                to="/tools" 
                className="flex flex-col items-center p-4 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors group"
              >
                <Calculator className="h-8 w-8 text-secondary mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground">Financial Calculators</span>
                <span className="text-xs text-muted-foreground">Budget & savings tools</span>
              </Link>
              <Link 
                to="/recovery-tools" 
                className="flex flex-col items-center p-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors group"
              >
                <Clock className="h-8 w-8 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground">48-Hour Pause Timer</span>
                <span className="text-xs text-muted-foreground">Decision support</span>
              </Link>
            </div>
            <Link 
              to="/tools" 
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mt-4 font-medium"
            >
              View all free tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {/* Recovery Gap Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto animate-fade-in">
            <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 shadow-soft border border-border/50 hover:shadow-medium transition-shadow">
              <div className="text-3xl font-bold text-primary">27%</div>
              <div className="text-sm text-muted-foreground font-medium">cite financial issues as major relapse reason</div>
            </div>
            <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 shadow-soft border border-border/50 hover:shadow-medium transition-shadow">
              <div className="text-3xl font-bold text-secondary">63%</div>
              <div className="text-sm text-muted-foreground font-medium">of Americans live paycheck-to-paycheck</div>
            </div>
            <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 shadow-soft border border-border/50 hover:shadow-medium transition-shadow">
              <div className="text-3xl font-bold text-accent">40-60%</div>
              <div className="text-sm text-muted-foreground font-medium">relapse rate in first year of recovery</div>
            </div>
          </div>
          
          {/* Introduction Video */}
          <div className="mb-8 max-w-xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <h4 className="text-sm font-medium text-foreground mb-3 text-center">See Why This Matters</h4>
              <div className="relative rounded-lg overflow-hidden">
                <iframe 
                  width="100%" 
                  height="200" 
                  src="https://www.youtube.com/embed/kB1NTdSIB48?si=Y_Vy7xdD7QvoPd15&autoplay=0&controls=1&rel=0" 
                  title="Financial Struggles in Early Recovery"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  className="w-full h-32 sm:h-48 md:h-[200px]"
                ></iframe>
              </div>
            </div>
          </div>
          
          {/* Recovery Gap Explanation */}
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 mb-10 max-w-3xl mx-auto border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-2">The Recovery Gap</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Traditional treatment programs overlook critical life skills like financial literacy, leaving a dangerous gap 
              that contributes to relapse. We bridge that gap with practical money skills that support lasting recovery.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              variant="default" 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={() => window.location.href = '/pricing'}
            >
              Start Your Financial Recovery
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={() => {
                const businessSection = document.querySelector('[data-section="business-plans"]');
                if (businessSection) {
                  businessSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/pricing#business';
                }
              }}
            >
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