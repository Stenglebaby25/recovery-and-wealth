import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Video, Users, Calendar } from "lucide-react";

const CoachingSection = () => {
  const coachingTypes = [
    {
      icon: Users,
      title: "Group Coaching",
      description: "Weekly group sessions with other people in recovery",
      features: ["Peer support", "Shared experiences", "Cost-effective"],
      price: "Included",
      cta: "Join Next Session",
      variant: "secondary" as const,
    },
    {
      icon: Video,
      title: "1-on-1 Coaching",
      description: "Personal financial coaching tailored to your recovery journey",
      features: ["Personalized advice", "Flexible scheduling", "Private sessions"],
      price: "$150/hour",
      cta: "Book Session",
      variant: "default" as const,
    },
    {
      icon: MessageSquare,
      title: "Community Support",
      description: "24/7 access to our recovery-focused financial community",
      features: ["Ask questions anytime", "Share victories", "Get motivation"],
      price: "Always Free",
      cta: "Join Community",
      variant: "accent" as const,
    },
  ];

  const coaches = [
    {
      name: "Sarah M.",
      credentials: "CFP, 8 years recovery",
      specialty: "Budgeting & Debt Recovery",
      bio: "Specializes in helping people rebuild credit and manage debt in early recovery.",
      initials: "SM",
    },
    {
      name: "Mike R.",
      credentials: "CPA, 12 years recovery",
      specialty: "Employment & Income",
      bio: "Expert in career development and maximizing income while maintaining recovery focus.",
      initials: "MR",
    },
    {
      name: "Jessica L.",
      credentials: "Financial Coach, 6 years recovery",
      specialty: "Emergency Planning",
      bio: "Helps clients build emergency funds and financial security from ground zero.",
      initials: "JL",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Coaching & Community Support
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get guidance from financial professionals who understand recovery. 
              Connect with others on the same journey for ongoing motivation and support.
            </p>
          </div>

          {/* Coaching Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {coachingTypes.map((type) => (
              <Card key={type.title} className="transition-all duration-300 hover:shadow-medium">
                <CardHeader className="pb-4 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 mx-auto">
                    <type.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {type.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold text-foreground">{type.price}</span>
                  </div>
                  <Button variant={type.variant} className="w-full">
                    {type.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Meet Our Coaches */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center text-foreground mb-12">
              Meet Our Recovery-Focused Coaches
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coaches.map((coach) => (
                <Card key={coach.name} className="transition-all duration-300 hover:shadow-medium">
                  <CardHeader className="pb-4 text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                        {coach.initials}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{coach.name}</CardTitle>
                    <p className="text-sm text-primary font-medium">{coach.credentials}</p>
                    <p className="text-sm text-muted-foreground">{coach.specialty}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {coach.bio}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Book with {coach.name.split(' ')[0]}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-card rounded-xl p-8 shadow-medium">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Join a Supportive Community
              </h3>
              <p className="text-muted-foreground">
                Connect with others who understand your journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">1,200+</div>
                <div className="text-sm text-muted-foreground">Community Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">85%</div>
                <div className="text-sm text-muted-foreground">Complete the Program</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">$2,500</div>
                <div className="text-sm text-muted-foreground">Average Emergency Fund Built</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Community Support</div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button variant="hero" size="lg">
                <MessageSquare className="w-5 h-5 mr-2" />
                Join the Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoachingSection;