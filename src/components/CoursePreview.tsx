import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Users, Target } from "lucide-react";

const CoursePreview = () => {
  const weeks = [
    {
      week: 1,
      title: "Understanding the Link Between Addiction and Financial Instability",
      subject: "Financial Recovery Foundations",
      description: "Explore how addiction and financial struggles are deeply intertwined. Learn to identify financial triggers that may lead to relapse and understand the psychological aspects of addiction that contribute to financial difficulties. Build awareness of the importance of financial recovery as a crucial component of lasting sobriety.",
      completed: true,
    },
    {
      week: 2,
      title: "Creating a Recovery-Centered Budget",
      subject: "Essential Skills for Financial Stability in Recovery",
      description: "Master the fundamentals of creating a personalized budgeting plan that supports your recovery journey. Learn to establish clear financial goals aligned with your recovery goals, address financial needs while supporting overall well-being, and develop essential tracking systems using recovery-specific tools and terminology.",
      completed: true,
    },
    {
      week: 3,
      title: "Building Your Financial Safety Net",
      subject: "Emergency Funds & Automated Savings",
      description: "Learn why emergency funds are critical in recovery and how to build them step-by-step. Celebrate milestones from your first $100 to 6 months of expenses. Discover automated savings tools like Acorns and Stash that round up purchases and teach basic investing while building your safety net.",
      completed: false,
    },
    {
      week: 4,
      title: "Understanding Debt and Credit",
      subject: "Empowering Financial Recovery Through Credit Management",
      description: "Master debt reduction strategies including budgeting for debt repayment, negotiation techniques, and debt consolidation. Learn to build and maintain healthy credit scores, understand credit reports, and use credit products responsibly. Develop personalized debt reduction plans that support your recovery journey.",
      completed: false,
    },
    {
      week: 5,
      title: "Planning for the Future",
      subject: "Long-Term Financial Planning & Celebrating Success",
      description: "Setting SMART financial goals and breaking them into manageable steps. Learn retirement savings basics including 401(k)s and IRAs. Master the art of celebrating financial milestones to maintain motivation and build positive money habits throughout your recovery journey.",
      completed: false,
    },
    {
      week: 6,
      title: "Career & Income Growth",
      subject: "Employment Strategies & Unemployment Management",
      description: "Master essential job search skills including resume writing, networking, and online job boards. Learn to navigate employment opportunities and build unemployment prevention strategies. Understand the importance of continuing education, career planning, and developing financial plans to manage unemployment periods without risking recovery.",
      completed: false,
    },
    {
      week: 7,
      title: "Mind Over Money",
      subject: "Psychology of Spending",
      description: "Recognizing impulsive spending behaviors, building positive financial habits, and using positive reinforcement for small wins.",
      completed: false,
    },
    {
      week: 8,
      title: "Building a Support System",
      subject: "Coaching and Community",
      description: "The role of financial coaching and supportive community in maintaining financial wellness. Creating your personalized financial recovery plan.",
      completed: false,
    },
  ];

  const completedWeeks = weeks.filter(week => week.completed).length;
  const progressPercentage = (completedWeeks / weeks.length) * 100;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              8-Week Financial Recovery Course
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A structured, self-paced program designed specifically for people in recovery. 
              Learn at your own pace with ongoing community support.
            </p>
          </div>

          {/* Progress Overview */}
          <div className="bg-card rounded-xl p-8 shadow-medium mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
                <div className="mb-4">
                  <Progress value={progressPercentage} className="w-full" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {completedWeeks} of 8 weeks completed
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Flexible Timing</h3>
                <p className="text-2xl font-bold text-secondary mb-2">Self-Paced</p>
                <p className="text-sm text-muted-foreground">
                  Learn when it works for your recovery schedule
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Community Support</h3>
                <p className="text-2xl font-bold text-accent mb-2">24/7</p>
                <p className="text-sm text-muted-foreground">
                  Connect with others on the same journey
                </p>
              </div>
            </div>
          </div>

          {/* Course Weeks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weeks.map((week) => (
              <Card 
                key={week.week} 
                className={`transition-all duration-300 hover:shadow-medium ${
                  week.completed ? 'bg-success/5 border-success/20' : 'hover:bg-card/80'
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Week {week.week}: {week.title}
                    </CardTitle>
                    {week.completed && (
                      <CheckCircle className="w-6 h-6 text-success" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{week.description}</p>
                  <Button 
                    variant={week.completed ? "success" : "default"} 
                    size="sm"
                    className="w-full"
                  >
                    {week.completed ? "Review Lesson" : "Start Lesson"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button variant="hero" size="lg" className="px-8 py-4">
              Continue Your Journey
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursePreview;