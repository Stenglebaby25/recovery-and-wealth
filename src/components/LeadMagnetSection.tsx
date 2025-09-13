import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Download, Mail } from "lucide-react";
import { useState } from "react";

const LeadMagnetSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with email service
    console.log("Email submitted:", email);
    setEmail("");
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Enter your email to download
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Download Free Guide
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    No spam. Unsubscribe anytime. Your privacy is protected.
                  </p>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetSection;