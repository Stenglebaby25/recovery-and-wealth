import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  Users, 
  Target, 
  Play, 
  BookOpen, 
  GraduationCap, 
  Brain,
  Star,
  ArrowRight,
  Sparkles,
  Shield,
  Heart
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Course {
  id: string;
  title: string;
  description: string;
  week_number: number;
  subject: string;
  content_type: string;
  learning_pathway?: string;
}

const LearningHubPreview = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('order_index');
    
    if (!error && data) {
      setCourses(data);
    }
    setLoading(false);
  };

  const foundationCourses = courses.filter(c => c.learning_pathway === 'foundation' || !c.learning_pathway);
  const advancedCourses = courses.filter(c => c.learning_pathway === 'advanced');

  const benefits = [
    { icon: Brain, text: "Recovery-focused financial education" },
    { icon: Target, text: "Self-paced learning modules" },
    { icon: Users, text: "Community support included" },
    { icon: Shield, text: "Evidence-based strategies" },
  ];

  const testimonials = [
    {
      quote: "Finally, financial advice that understands recovery. This changed how I think about money.",
      author: "Mark R.",
      detail: "2 years sober"
    },
    {
      quote: "The HALT lessons helped me stop impulse spending. Worth every penny.",
      author: "Jennifer S.",
      detail: "18 months sober"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 px-4 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                14-Day Free Trial
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Financial Education Built for{" "}
                <span className="text-primary">Recovery</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Build lasting financial habits with courses designed specifically for people in recovery. 
                From foundation skills to advanced wealth building—at your own pace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={() => window.location.href = '/auth'}
                  className="px-8"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = '/auth'}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Strip */}
        <section className="py-8 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center justify-center gap-2 text-center">
                  <benefit.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Preview Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Preview Our Learning Approach</h2>
                <p className="text-muted-foreground">See how we combine recovery principles with practical financial education</p>
              </div>
              <Card className="overflow-hidden shadow-lg">
                <div className="relative aspect-video">
                  <iframe 
                    width="100%" 
                    height="100%"
                    src="https://www.youtube.com/embed/SbcUpkSrht0?si=SWmiWE7O7Pfd5_Gs&autoplay=0&controls=1&rel=0" 
                    title="Budgeting Basics for Recovery"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
                <CardContent className="p-6 text-center bg-card">
                  <p className="text-muted-foreground mb-4">
                    This is just a preview. Get full access to all lessons, worksheets, and interactive exercises with your free trial.
                  </p>
                  <Button variant="default" onClick={() => window.location.href = '/auth'}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Learning Free
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* H.A.L.T. Featured Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                  <div className="p-4 bg-primary/20 rounded-full">
                    <Brain className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">H.A.L.T. Recovery Lessons</h3>
                    <p className="text-muted-foreground">
                      Master the four emotional triggers that lead to poor financial decisions in recovery.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-red-600 font-bold text-lg">H</span>
                    </div>
                    <p className="text-sm font-medium">Hungry</p>
                    <p className="text-xs text-muted-foreground">Scarcity spending</p>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-orange-600 font-bold text-lg">A</span>
                    </div>
                    <p className="text-sm font-medium">Angry</p>
                    <p className="text-xs text-muted-foreground">Revenge spending</p>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 font-bold text-lg">L</span>
                    </div>
                    <p className="text-sm font-medium">Lonely</p>
                    <p className="text-xs text-muted-foreground">Comfort spending</p>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-purple-600 font-bold text-lg">T</span>
                    </div>
                    <p className="text-sm font-medium">Tired</p>
                    <p className="text-xs text-muted-foreground">Impulse spending</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    variant="default" 
                    size="lg"
                    onClick={() => window.location.href = '/halt-lessons'}
                    className="px-8"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Preview H.A.L.T. Lessons
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Course Preview Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Complete Learning Curriculum
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  From foundation skills for early recovery to advanced wealth-building strategies. 
                  All courses unlock with your free trial.
                </p>
              </div>

              {/* Learning Path Tabs */}
              <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Foundation Path */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Foundation Recovery</h3>
                      <p className="text-sm text-muted-foreground">{foundationCourses.length} lessons</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {foundationCourses.slice(0, 4).map((course) => (
                      <Card key={course.id} className="bg-card/50 hover:bg-card transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Week {course.week_number}: {course.title}</p>
                            <p className="text-xs text-muted-foreground">{course.subject}</p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-muted-foreground/30" />
                        </CardContent>
                      </Card>
                    ))}
                    {foundationCourses.length > 4 && (
                      <p className="text-sm text-muted-foreground text-center pt-2">
                        + {foundationCourses.length - 4} more foundation lessons
                      </p>
                    )}
                  </div>
                </div>

                {/* Advanced Path */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Advanced Recovery</h3>
                      <p className="text-sm text-muted-foreground">{advancedCourses.length} lessons</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {advancedCourses.slice(0, 4).map((course) => (
                      <Card key={course.id} className="bg-card/50 hover:bg-card transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Week {course.week_number}: {course.title}</p>
                            <p className="text-xs text-muted-foreground">{course.subject}</p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-muted-foreground/30" />
                        </CardContent>
                      </Card>
                    ))}
                    {advancedCourses.length > 4 && (
                      <p className="text-sm text-muted-foreground text-center pt-2">
                        + {advancedCourses.length - 4} more advanced lessons
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={() => window.location.href = '/auth'}
                  className="px-8"
                >
                  Unlock All Courses Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  14-day free trial • No credit card required to start
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">What Others Are Saying</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-card">
                    <CardContent className="p-6">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-foreground mb-4 italic">"{testimonial.quote}"</p>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-primary" />
                        <span className="font-medium">{testimonial.author}</span>
                        <span className="text-muted-foreground text-sm">• {testimonial.detail}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of people in recovery who are building healthy money habits. 
              Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => window.location.href = '/auth'}
                className="bg-white text-primary hover:bg-white/90 border-white px-8"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                onClick={() => window.location.href = '/pricing'}
                className="text-white hover:bg-white/10"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LearningHubPreview;
