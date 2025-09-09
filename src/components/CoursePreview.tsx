import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Users, Target } from "lucide-react";

const CoursePreview = () => {
  const weeks = [
    {
      week: 1,
      title: "Financial Recovery Foundations",
      description: "Understanding money triggers and building healthy financial habits in recovery",
      completed: true,
    },
    {
      week: 2,
      title: "Budgeting in Early Recovery",
      description: "Creating realistic budgets when income is limited or irregular",
      completed: true,
    },
    {
      week: 3,
      title: "Emergency Fund Basics",
      description: "Building financial security one dollar at a time",
      completed: false,
    },
    {
      week: 4,
      title: "Banking & Credit Recovery",
      description: "Rebuilding credit and establishing banking relationships",
      completed: false,
    },
    {
      week: 5,
      title: "Housing & Transportation",
      description: "Making smart decisions about major expenses in recovery",
      completed: false,
    },
    {
      week: 6,
      title: "Employment & Income",
      description: "Maximizing earning potential while maintaining recovery focus",
      completed: false,
    },
    {
      week: 7,
      title: "Insurance & Healthcare",
      description: "Protecting your health and financial wellbeing",
      completed: false,
    },
    {
      week: 8,
      title: "Long-term Financial Planning",
      description: "Setting financial goals that support lasting recovery",
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