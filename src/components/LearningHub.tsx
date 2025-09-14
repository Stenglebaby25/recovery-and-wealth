import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock, Clock, Users, Target, Play, BookOpen, GraduationCap } from 'lucide-react';
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
  learning_pathway?: string;
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
  const [activeTab, setActiveTab] = useState<'foundation' | 'advanced'>('foundation');

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

  const foundationCourses = courses.filter(c => c.learning_pathway === 'foundation' || !c.learning_pathway);
  const advancedCourses = courses.filter(c => c.learning_pathway === 'advanced');
  
  const completedFoundation = userProgress.filter(p => {
    const course = courses.find(c => c.id === p.course_id);
    return p.completed && (course?.learning_pathway === 'foundation' || !course?.learning_pathway);
  }).length;
  
  const completedAdvanced = userProgress.filter(p => {
    const course = courses.find(c => c.id === p.course_id);
    return p.completed && course?.learning_pathway === 'advanced';
  }).length;
  
  const completedCourses = userProgress.filter(p => p.completed).length;
  const progressPercentage = courses.length > 0 ? (completedCourses / courses.length) * 100 : 0;
  
  const canAccessAdvanced = completedFoundation >= foundationCourses.length * 0.8; // 80% foundation completion

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
              Recovery Learning Hub
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Build financial skills that support lasting recovery. From foundation concepts for early sobriety 
              to advanced strategies for those in outpatient programs and sober living.
            </p>

            {/* Featured Budgeting Video */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-medium border border-primary/20">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Featured Lesson: Budgeting Basics for Recovery
                </h3>
                <div className="relative rounded-lg overflow-hidden shadow-medium">
                  <iframe 
                    width="100%" 
                    height="400" 
                    src="https://www.youtube.com/embed/SbcUpkSrht0?si=SWmiWE7O7Pfd5_Gs&autoplay=0&controls=1&rel=0" 
                    title="Budgeting Basics for Recovery"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    className="w-full"
                  ></iframe>
                </div>
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  A quick overview of essential budgeting skills designed specifically for people in recovery
                </p>
              </div>
            </div>
          </div>

          {/* Premium Upgrade Banner */}
          {user && !isPremium && (
            <div className="bg-gradient-hero rounded-xl p-6 mb-12 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Unlock Your Complete Recovery Learning Path</h3>
              <p className="mb-4 opacity-90">
                Access advanced modules designed for outpatient programs, plus foundation courses, progress tracking, and recovery-focused financial tools.
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

          {/* Learning Path Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-card rounded-lg p-1 inline-flex shadow-medium">
              <button
                onClick={() => setActiveTab('foundation')}
                className={`px-6 py-3 rounded-md font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'foundation'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Foundation Recovery
                <Badge variant="secondary" className="ml-2">{foundationCourses.length}</Badge>
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`px-6 py-3 rounded-md font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'advanced'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                disabled={!canAccessAdvanced && !isPremium}
              >
                <GraduationCap className="w-4 h-4" />
                Advanced Recovery
                <Badge variant="secondary" className="ml-2">{advancedCourses.length}</Badge>
                {!canAccessAdvanced && !isPremium && <Lock className="w-3 h-3 ml-1" />}
              </button>
            </div>
          </div>

          {/* Pathway Description */}
          <div className="text-center mb-8">
            {activeTab === 'foundation' ? (
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-2">Foundation Recovery Learning</h3>
                <p className="text-muted-foreground">
                  Essential financial skills for early recovery. Perfect for those who have completed detox and residential treatment, 
                  now building a foundation for long-term financial sobriety.
                </p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-2">Advanced Recovery Learning</h3>
                <p className="text-muted-foreground">
                  Advanced strategies for those in outpatient programs (PHP/IOP) and sober living. 
                  Self-directed learning for people with a clear head and solid recovery foundation.
                </p>
                {!canAccessAdvanced && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Complete 80% of foundation courses to unlock advanced learning modules.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(activeTab === 'foundation' ? foundationCourses : advancedCourses).map((course) => {
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