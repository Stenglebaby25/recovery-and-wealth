import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock, Clock, Users, Target, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  description: string;
  week_number: number;
  subject: string;
  content_type: string;
  video_url?: string;
  content?: string;
  order_index: number;
}

interface UserProgress {
  course_id: string;
  completed: boolean;
  progress_percentage: number;
}

const LearningHub = () => {
  const { user, isPremium } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

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

  const fetchUserProgress = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id);
    
    if (!error && data) {
      setUserProgress(data);
    }
  };

  const getProgressForCourse = (courseId: string) => {
    return userProgress.find(p => p.course_id === courseId);
  };

  const completedCourses = userProgress.filter(p => p.completed).length;
  const progressPercentage = courses.length > 0 ? (completedCourses / courses.length) * 100 : 0;

  const handleStartLesson = async (course: Course) => {
    if (!user) {
      // Redirect to auth if not logged in
      window.location.href = '/auth';
      return;
    }

    if (course.content_type === 'premium' && !isPremium) {
      // Show upgrade prompt
      alert('This lesson requires a premium subscription. Please upgrade to access this content.');
      return;
    }

    // Create or update progress
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        course_id: course.id,
        progress_percentage: 10, // Started
      });

    if (!error) {
      fetchUserProgress();
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading Learning Hub...</p>
      </div>
    );
  }

  return (
    <section id="learning-hub" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Learning Hub
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Master your financial recovery with our proven 8-week program. 
              Build the money skills that support lasting sobriety.
            </p>
          </div>

          {/* Premium Upgrade Banner */}
          {user && !isPremium && (
            <div className="bg-gradient-hero rounded-xl p-6 mb-12 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Unlock Your Financial Recovery Journey</h3>
              <p className="mb-4 opacity-90">
                Get full access to all 8 weeks of course content, video lessons, and progress tracking.
              </p>
              <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90">
                Upgrade to Premium
              </Button>
            </div>
          )}

          {/* Progress Overview - Only show if logged in */}
          {user && (
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
                    {completedCourses} of {courses.length} lessons completed
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
                    <Clock className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Flexible Learning</h3>
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
          )}

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => {
              const progress = getProgressForCourse(course.id);
              const isLocked = course.content_type === 'premium' && !isPremium;
              const isCompleted = progress?.completed || false;
              
              return (
                <Card 
                  key={course.id} 
                  className={`transition-all duration-300 hover:shadow-medium ${
                    isCompleted ? 'bg-success/5 border-success/20' : 
                    isLocked ? 'bg-muted/50' : 'hover:bg-card/80'
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">
                          Week {course.week_number}: {course.title}
                        </CardTitle>
                        {course.content_type === 'premium' && (
                          <Badge variant={isPremium ? "secondary" : "outline"}>
                            {isPremium ? "Premium" : "Premium"}
                          </Badge>
                        )}
                      </div>
                      {isCompleted && (
                        <CheckCircle className="w-6 h-6 text-success" />
                      )}
                      {isLocked && (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{course.subject}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{course.description}</p>
                    
                    {progress && progress.progress_percentage > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{progress.progress_percentage}%</span>
                        </div>
                        <Progress value={progress.progress_percentage} className="w-full h-2" />
                      </div>
                    )}
                    
                    <Button 
                      variant={isCompleted ? "success" : isLocked ? "outline" : "default"} 
                      size="sm"
                      className="w-full"
                      onClick={() => handleStartLesson(course)}
                      disabled={isLocked && !user}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          {user ? 'Upgrade to Access' : 'Login to Access'}
                        </>
                      ) : isCompleted ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Review Lesson
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Lesson
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA */}
          {!user && (
            <div className="text-center mt-12">
              <Button variant="hero" size="lg" className="px-8 py-4" onClick={() => window.location.href = '/auth'}>
                Start Your Learning Journey
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LearningHub;