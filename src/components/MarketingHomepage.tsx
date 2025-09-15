import HeroSection from "@/components/HeroSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Calculator, BookOpen, Users, Trophy, Download, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useLeadCapture } from "@/hooks/useLeadCapture";
import { useState } from "react";

const MarketingHomepage = () => {
  const { captureLead, isSubmitting } = useLeadCapture();
  const [email, setEmail] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  
  const handleGuideDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    const result = await captureLead(email, 'guide_download', '/', { guide_name: 'Recovery & Wealth Building Guide' });
    if (result.success) {
      setEmail('');
    }
  };

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    
    const result = await captureLead(newsletterEmail, 'newsletter_signup', '/');
    if (result.success) {
      setNewsletterEmail('');
    }
  };

  const handleCoachingInterest = async () => {
    const result = await captureLead('interested@coaching.com', 'coaching_interest', '/', { action: 'button_click' });
  };

  const handleCommunityJoin = async () => {
    const result = await captureLead('interested@community.com', 'community_join', '/', { action: 'button_click' });
  };

  const stats = [
    { number: "2,500+", label: "Lives Transformed" },
    { number: "89%", label: "Success Rate" },
    { number: "$2.3M", label: "Saved by Members" },
    { number: "24/7", label: "Community Support" }
  ];

  const quickLinks = [
    {
      title: "Free Calculators",
      description: "Try our debt payoff and savings calculators",
      icon: Calculator,
      href: "/tools",
      badge: "Free"
    },
    {
      title: "Learning Hub", 
      description: "Access sample lessons and resources",
      icon: BookOpen,
      href: "#learning-hub",
      badge: "Preview"
    },
    {
      title: "Success Stories",
      description: "Read inspiring transformation stories",
      icon: Trophy,
      href: "/success-stories",
      badge: "Motivation"
    }
  ];

  return (
    <>
      <HeroSection />
      
      {/* Stats Section */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Real Results from Real People
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands who have transformed their relationship with money in recovery
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our tools and resources designed specifically for your recovery journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover-scale border-border/50 hover:border-primary/20 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <link.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CardTitle className="text-xl">{link.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">{link.badge}</Badge>
                  </div>
                  <CardDescription className="text-base">
                    {link.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 text-center">
                  {link.href.startsWith('#') ? (
                    <Button variant="outline" className="w-full group">
                      Explore Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Link to={link.href}>
                      <Button variant="outline" className="w-full group">
                        Explore Now
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Magnet Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Free Recovery & Wealth Building Guide
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Download our comprehensive guide to building financial stability in recovery. 
                  Learn the exact steps that have helped thousands transform their money mindset.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">5 Essential Financial Habits for Recovery</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">Emergency Fund Building Strategies</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">Debt Elimination Roadmap</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">Mindfulness Money Exercises</span>
                  </div>
                </div>

                <form onSubmit={handleGuideDownload} className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isSubmitting} className="group">
                      <Download className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Sending...' : 'Get Guide'}
                    </Button>
                  </div>
                </form>
              </div>
              
              <div className="text-center">
                <div className="bg-white p-8 rounded-lg shadow-lg inline-block">
                  <div className="w-32 h-40 bg-gradient-primary rounded-lg mb-4 mx-auto flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white" />
                  </div>
                  <p className="font-semibold text-foreground">Recovery & Wealth Guide</p>
                  <p className="text-sm text-muted-foreground">42 pages of actionable insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Content Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What's Inside Our Premium Programs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get a glimpse of the comprehensive support and resources available to our members
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50">
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Interactive Courses</CardTitle>
                <CardDescription>
                  Step-by-step video lessons with workbooks and exercises
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>1-on-1 Coaching</CardTitle>
                <CardDescription>
                  Personal guidance from certified financial coaches in recovery
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Calculator className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Advanced Tools</CardTitle>
                <CardDescription>
                  Premium calculators, trackers, and planning resources
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/pricing">
              <Button size="lg" className="group">
                View All Programs
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join our community of people in recovery who are building wealth and financial stability
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="group" onClick={handleCommunityJoin} disabled={isSubmitting}>
              Join Our Community
              <Users className="w-5 h-5 ml-2" />
            </Button>
            <form onSubmit={handleNewsletterSignup} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="min-w-[200px] border-white text-white placeholder:text-white/70 bg-white/10"
              />
              <Button 
                type="submit" 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary group"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default MarketingHomepage;