import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Download, Mail } from "lucide-react";
import { useState } from "react";

const LeadMagnetSection = () => {
  const [email, setEmail] = useState("");
  const [hasAccess, setHasAccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: Integrate with email service
      console.log("Email submitted:", email);
      setHasAccess(true);
      // Redirect to newsletter signup
      window.open("https://recoveryandwealth.beehiiv.com/", "_blank");
    }
  };

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Start Your Financial Recovery Journey Today
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Download our comprehensive guide and begin building your Sober Money Mindset
            </p>
          </div>

          <Card className="shadow-glow bg-card/95 backdrop-blur">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4 mx-auto">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">
                FREE Recovery & Wealth Guide
              </CardTitle>
              <CardDescription className="text-lg">
                A complete e-book covering financial literacy fundamentals for recovery. 
                Learn the Sober Money Mindset principles that support long-term success.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">What You'll Learn:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Building financial stability as part of your recovery journey
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Overcoming money shame and developing healthy financial habits
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Creating support systems for financial accountability
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Practical tools for budgeting, saving, and debt management
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      Long-term wealth building for sustained recovery
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  {!hasAccess ? (
                    // Email capture form
                    <div className="bg-gradient-card rounded-lg p-6 border border-primary/20">
                      <div className="text-center mb-6">
                        <div className="w-24 h-32 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Get Instant Access
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Enter your email to unlock the complete guide and join our recovery community
                        </p>
                      </div>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" size="lg">
                          <Download className="w-4 h-4 mr-2" />
                          Get Free Guide & Join Newsletter
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                          By subscribing, you'll get the guide plus weekly financial recovery tips. Unsubscribe anytime.
                        </p>
                      </form>
                    </div>
                  ) : (
                    // Show e-book after email capture
                    <div className="space-y-4">
                      <div className="bg-card/50 rounded-lg p-1 border">
                        <iframe 
                          allowFullScreen
                          src="https://designrr.page?id=216760&token=1866725815&h=5820" 
                          height="600" 
                          width="100%" 
                          className="rounded border-0"
                          title="Money Mindset Free Guide"
                        />
                      </div>
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <p className="text-sm text-foreground font-medium mb-2">
                          🎉 Welcome to the Recovery & Wealth community!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Check your email for your newsletter confirmation and additional resources.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetSection;