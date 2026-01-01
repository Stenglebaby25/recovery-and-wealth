import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, Users, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Story
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Born on a loading dock. Built for recovery. Designed to transform lives.
            </p>
          </div>
        </section>

        {/* Origin Story */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                    From Wall Street to a Loading Dock
                  </h2>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Our founder spent 20 years on Wall Street, specializing in asset management, private equity, and investment products for institutional and high-net-worth clients. He built a career as a product specialist in ETFs, mutual funds, SMAs, and alternative funds—navigating the complex machinery of financial markets with expertise and precision.
                  </p>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    But it was on a loading dock during a night shift in sober living—struggling to make ends meet in early recovery—that the true calling emerged. Surrounded by others in recovery facing the same financial devastation, one question became impossible to ignore:
                  </p>
                  
                  <blockquote className="border-l-4 border-primary pl-6 my-8 italic text-foreground/90 text-xl">
                    "How can I use what I know to help people rebuild their financial lives, not just their sobriety?"
                  </blockquote>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    That question became Recovery & Wealth—a newsletter, an app, a coaching program, and a movement. We left Wall Street behind to dedicate ourselves to helping individuals in recovery address the financial chaos that addiction creates.
                  </p>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    Our approach combines decades of financial expertise with lived experience in recovery, providing practical tools that treatment centers don't teach but clients desperately need.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8 md:p-12 text-center">
                <Target className="w-12 h-12 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Our Philosophy
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Recovery is about more than abstinence. It's about cleaning up every side of the street—including your financial house—and building a prosperous, purposeful life.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values Grid */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              What We Believe
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card/80 border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Lived Experience Matters
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    We understand the financial wreckage of addiction because we've lived it. That experience shapes everything we build.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Financial Recovery is Recovery
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Your bank account is part of your wellness. Ignoring financial health puts your entire recovery at risk.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Everyone Deserves Access
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Wall Street-level financial wisdom shouldn't be reserved for the wealthy. We make it accessible for everyone in recovery.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground mb-8">
              Whether you're in early recovery or years into your journey, we're here to help you build the financial foundation you deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button variant="hero" size="lg">
                  Explore Programs
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/coaching">
                <Button variant="outline" size="lg">
                  Book a Coaching Call
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
