import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Calculator, BookOpen, Users, Trophy, Download, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useLeadCapture } from "@/hooks/useLeadCapture";
import { useState } from "react";

const MarketingHomepage = () => {
  const { captureLead, isSubmitting } = useLeadCapture();
  const [email, setEmail] = useState('');
  const [hasDownloadedGuide, setHasDownloadedGuide] = useState(false);
  
  const stats = [
    { number: "2,500+", label: "Lives Transformed" },
    { number: "89%", label: "Success Rate" },
    { number: "$2.3M", label: "Saved by Members" },
    { number: "24/7", label: "Community Support" }
  ];
  return (
    <>
      <HeroSection />
      
      {/* Newsletter Section - Subtle dedicated section */}
      <section className="py-10 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Stay Connected</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Weekly insights on recovery, financial wellness, and building a life you're proud of.
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </section>
      
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

                {!hasDownloadedGuide ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input 
                        type="email" 
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        size="lg" 
                        className="group"
                        onClick={async () => {
                          if (email) {
                            const result = await captureLead({
                              email,
                              leadType: 'guide_download',
                              metadata: { guide_type: 'recovery_wealth' }
                            });
                            if (result.success) {
                              setHasDownloadedGuide(true);
                              setEmail('');
                            }
                          }
                        }}
                        disabled={!email || isSubmitting}
                      >
                        <Download className="w-5 h-5 mr-2" />
                        {isSubmitting ? 'Sending...' : 'Download Free Guide'}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get instant access to our comprehensive recovery & wealth guide
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-primary/10 rounded-lg">
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      Check Your Email!
                    </h3>
                    <p className="text-muted-foreground">
                      Your guide is on its way. Don't forget to check your spam folder.
                    </p>
                  </div>
                )}
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
          
          <div className="mt-6 max-w-md mx-auto mb-6">
            <Input 
              type="email" 
              placeholder="Enter your email to get started"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="group"
              onClick={async () => {
                if (email) {
                  await captureLead({
                    email,
                    leadType: 'community_join'
                  });
                  setEmail('');
                }
              }}
              disabled={!email || isSubmitting}
            >
              Join Our Community
              <Users className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary group"
              onClick={async () => {
                if (email) {
                  await captureLead({
                    email,
                    leadType: 'newsletter_signup'
                  });
                  setEmail('');
                }
              }}
              disabled={!email || isSubmitting}
            >
              Newsletter Signup
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default MarketingHomepage;