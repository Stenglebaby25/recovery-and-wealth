import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, TrendingUp, Heart, Shield } from "lucide-react";
import transformationImage from "@/assets/transformation-mindset.png";

const CaseStudiesSection = () => {
  const caseStudies = [
    {
      name: "Sarah M.",
      title: "2 Years in Recovery",
      challenge: "Overwhelming debt and financial chaos after addiction",
      outcome: "Built $5,000 emergency fund and eliminated $15,000 in debt",
      quote: "The Sober Money Mindset changed everything. I went from financial chaos to having a plan. For the first time in years, I sleep peacefully knowing my finances support my recovery.",
      metrics: ["$5,000 Emergency Fund", "Debt-Free", "Credit Score: 720"],
      icon: Shield,
      color: "text-primary"
    },
    {
      name: "Michael T.",
      title: "18 Months Clean",
      challenge: "No savings, living paycheck to paycheck, financial anxiety",
      outcome: "Established budgeting system and started investing in recovery",
      quote: "Learning to budget was like learning the steps - it gave me structure. Now I invest in therapy, coaching, and my family's future. Money isn't scary anymore.",
      metrics: ["50% Expense Reduction", "Monthly Savings Plan", "Recovery Investments"],
      icon: TrendingUp,
      color: "text-accent"
    },
    {
      name: "Jennifer L.",
      title: "5 Years Sober",
      challenge: "Fear of money management, shame around past financial decisions",
      outcome: "Became financially confident, helping others in recovery",
      quote: "I thought I was 'bad with money' forever. Recovery taught me that financial wellness is part of my overall health. Now I mentor others and run my own business.",
      metrics: ["Business Owner", "Mentor", "Financial Confidence"],
      icon: Heart,
      color: "text-secondary"
    }
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Full section background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${transformationImage})` }}
      />
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with solid background for better readability */}
        <div className="text-center mb-12 bg-card/95 backdrop-blur-sm rounded-xl p-8 shadow-medium border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Recovery Success Stories
          </h2>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            Real people, real transformation. See how the Sober Money Mindset has changed lives in lasting recovery.
          </p>
        </div>

        {/* Cards section */}
        <div className="relative py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {caseStudies.map((study, index) => (
              <Card key={index} className="shadow-medium bg-card/95 backdrop-blur-sm hover:shadow-glow transition-all duration-300 border border-white/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full`}>
                        <study.icon className={`w-6 h-6 ${study.color}`} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {study.title}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{study.name}</CardTitle>
                    <CardDescription className="text-sm">
                      <span className="font-medium text-destructive">Challenge:</span> {study.challenge}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-primary mb-2">Outcome:</p>
                      <p className="text-sm text-muted-foreground">{study.outcome}</p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg relative">
                      <Quote className="w-4 h-4 text-primary/60 absolute top-2 left-2" />
                      <p className="text-sm italic text-foreground pl-6">
                        "{study.quote}"
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-foreground">Key Achievements:</p>
                      <div className="flex flex-wrap gap-1">
                        {study.metrics.map((metric, metricIndex) => (
                          <Badge key={metricIndex} variant="secondary" className="text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-card/95 backdrop-blur-sm rounded-xl p-8 shadow-medium max-w-2xl mx-auto relative z-10 border border-white/10">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Your Story Could Be Next
            </h3>
            <p className="text-muted-foreground mb-6">
              Every recovery journey is unique, but financial wellness is a common foundation for lasting success. 
              Let us help you build your Sober Money Mindset and write your own success story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="outline" className="px-4 py-2">
                Support Networks
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                Impulse Control
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                Long-term Thinking
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                Professional Guidance
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;