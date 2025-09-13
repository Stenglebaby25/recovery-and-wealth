import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Building, Users } from "lucide-react";

const PricingSection = () => {
  const individualPlans = [
    {
      name: "Freemium",
      price: "Free",
      period: "forever",
      description: "Try our basic tools and see the difference",
      features: [
        "Week 1 course access",
        "Basic budgeting worksheet",
        "Community forum access",
        "Mobile app access"
      ],
      cta: "Start Free",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Monthly",
      price: "$4.99",
      period: "per month",
      description: "Full access plus 2 coaching sessions included",
      features: [
        "Complete 8-week course",
        "All worksheets & tools",
        "Mighty Networks community access",
        "2 coaching sessions included",
        "Progress tracking",
        "Mobile app access"
      ],
      cta: "Get Started",
      variant: "default" as const,
      popular: false,
    },
    {
      name: "Annual",
      price: "$99",
      period: "per year",
      description: "Save over 60% with 2 coaching sessions included",
      features: [
        "Everything in Monthly",
        "Save $60+ annually", 
        "2 coaching sessions included",
        "Priority community access",
        "Advanced goal tracking",
        "Certificate of completion"
      ],
      cta: "Save Big",
      variant: "secondary" as const,
      popular: false,
    },
    {
      name: "Lifetime",
      price: "$65",
      period: "one-time",
      description: "Most popular! Lifetime access with 1 coaching session",
      features: [
        "Everything in Annual",
        "Lifetime access forever",
        "All future course updates",
        "1 coaching session included",
        "Alumni network access",
        "Additional coaching at $150/hour"
      ],
      cta: "Get Lifetime Access",
      variant: "accent" as const,
      popular: true,
    },
  ];

  const businessPlans = [
    {
      name: "Starter",
      price: "$250",
      period: "per month",
      description: "Perfect for facilities with 20-40 clients",
      features: [
        "Up to 50 client accounts",
        "Admin dashboard",
        "Progress reporting",
        "Group coaching sessions",
        "Basic customization"
      ],
      cta: "Contact Sales",
      icon: Building,
    },
    {
      name: "Innovator",
      price: "$500",
      period: "per month",
      description: "Most popular for facilities with 40-100 clients",
      features: [
        "Up to 150 client accounts",
        "Advanced analytics",
        "Custom branding",
        "Dedicated coach assignments",
        "Integration support"
      ],
      cta: "Contact Sales",
      icon: Users,
      popular: true,
    },
    {
      name: "Pioneer",
      price: "$1,250",
      period: "per month",
      description: "For large facilities with 100+ clients",
      features: [
        "Unlimited client accounts",
        "White-label solution",
        "API access",
        "Dedicated account manager",
        "Custom integrations"
      ],
      cta: "Contact Sales",
      icon: Star,
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Individual Plans */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Start Your Financial Recovery
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that fits your recovery journey. All plans include access to our supportive community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {individualPlans.map((plan) => (
              <Card 
                key={plan.name}
                className={`relative transition-all duration-300 hover:shadow-medium ${
                  plan.popular ? 'ring-2 ring-primary shadow-glow' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.variant} className="w-full">
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Business Plans */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              For Treatment Centers
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Integrate financial literacy into your treatment programs. Help your clients build lasting recovery through financial wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {businessPlans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative transition-all duration-300 hover:shadow-medium ${
                  plan.popular ? 'ring-2 ring-primary shadow-glow' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="pb-4 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 mx-auto">
                    <plan.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="default" className="w-full">
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trendsetter CTA */}
          <div className="mt-16 text-center bg-gradient-card rounded-xl p-8 shadow-medium">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Trendsetter - Enterprise & White-Label Solutions
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              For large treatment networks like Recovery Centers of America with thousands of patients. 
              Get fully customized solutions with dedicated account management.
            </p>
            <Button variant="hero" size="lg">
              Discuss Trendsetter Needs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;