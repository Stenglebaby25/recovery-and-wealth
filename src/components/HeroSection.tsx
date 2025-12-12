import { Button } from "@/components/ui/button";
import { Heart, Calculator, Clock, ArrowRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/serenity-meditation.jpg";
import recoveryWealthLogo from "@/assets/recovery-wealth-logo-bold.png";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image - reduced opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Stronger Neutral Overlay */}
      <div 
        className="absolute inset-0 bg-background/40"
      />
      
      {/* Warm Vignette Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, hsla(40, 30%, 92%, 0.4) 60%, hsla(40, 25%, 88%, 0.6) 100%)'
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* 1. Recovery & Wealth Logo */}
          <div className="mb-6 flex justify-center">
            <img 
              src={recoveryWealthLogo} 
              alt="Recovery & Wealth" 
              className="h-24 md:h-32 w-auto object-contain"
            />
          </div>
          
          {/* 2. Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight animate-fade-in text-foreground">
            Your Journey to Financial{" "}
            <span className="text-primary">Recovery</span>
            <span className="text-muted-foreground"> & </span>
            <span className="text-secondary">Wealth</span>
          </h1>
          
          {/* 3. Intro Text */}
          <p 
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed font-medium text-foreground/90 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-soft"
          >
            Build wealth, recover financially, and create lasting change with our comprehensive learning platform. 
            Start your transformation today.
          </p>
          
          {/* 4. Recovery Gap Statistics - Enhanced & Prominent */}
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-sm rounded-2xl p-8 mb-8 max-w-3xl mx-auto border border-primary/20 shadow-medium">
            <h3 className="text-xl font-bold text-foreground mb-6">The Recovery Gap: Why Financial Literacy Matters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background/60 rounded-xl p-5 shadow-soft border border-border/50">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">27%</div>
                <div className="text-sm text-foreground font-medium">cite financial issues as major relapse reason</div>
              </div>
              <div className="bg-background/60 rounded-xl p-5 shadow-soft border border-border/50">
                <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">63%</div>
                <div className="text-sm text-foreground font-medium">of Americans live paycheck-to-paycheck</div>
              </div>
              <div className="bg-background/60 rounded-xl p-5 shadow-soft border border-border/50">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">40-60%</div>
                <div className="text-sm text-foreground font-medium">relapse rate in first year of recovery</div>
              </div>
            </div>
            <p className="text-foreground/80 text-sm mt-6 max-w-2xl mx-auto">
              Traditional treatment programs overlook critical life skills like financial literacy, leaving a dangerous gap 
              that contributes to relapse. We bridge that gap.
            </p>
          </div>
          
          {/* 5. Free Tools Section */}
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
          
          {/* 6. CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in mb-8">
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
          
          {/* 7. Testimonial */}
          <div className="bg-background/70 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-2xl mx-auto border border-border/50 shadow-soft">
            <Quote className="h-8 w-8 text-primary/40 mx-auto mb-3" />
            <p className="text-foreground/90 italic text-lg leading-relaxed mb-4">
              "I never realized how much my financial stress was affecting my recovery. This program gave me the tools to take control of my money and my life."
            </p>
            <div className="text-sm text-muted-foreground font-medium">
              — Michael R., 18 months sober
            </div>
          </div>
          
          {/* 8. Newsletter Signup */}
          <div className="max-w-md mx-auto mb-8">
            <NewsletterSignup />
          </div>
          
          {/* 9. Trust Indicators */}
          <div className="bg-primary/10 backdrop-blur-sm rounded-lg py-4 px-6 inline-block border border-primary/20">
            <p className="text-sm font-medium text-foreground">Created by people in recovery, for people in recovery</p>
            <p className="mt-1 text-sm text-foreground/80">Compatible with 12-Step and SMART Recovery programs</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;