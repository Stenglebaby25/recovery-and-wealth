import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import LessonPlayer from '@/components/course/LessonPlayer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Clock, Play, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CourseWithLessons {
  id: string;
  title: string;
  description: string | null;
  week_number: number;
  lessons: {
    id: string;
    title: string;
    description: string | null;
    lesson_number: number;
    content_type: string;
    estimated_duration: number;
  }[];
}

const WeekLessons = () => {
  const { weekNumber } = useParams<{ weekNumber: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const week = parseInt(weekNumber || '1');

  useEffect(() => {
    fetchWeekContent();
  }, [week]);

  useEffect(() => {
    if (user) fetchProgress();
  }, [user, courses]);

  const fetchWeekContent = async () => {
    setLoading(true);
    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, description, week_number')
        .eq('week_number', week)
        .eq('learning_pathway', 'foundation');

      if (coursesError) throw coursesError;

      const coursesWithLessons: CourseWithLessons[] = [];
      for (const course of coursesData || []) {
        const { data: lessons } = await supabase
          .from('lessons')
          .select('id, title, description, lesson_number, content_type, estimated_duration')
          .eq('course_id', course.id)
          .eq('is_published', true)
          .order('lesson_number');

        coursesWithLessons.push({
          ...course,
          week_number: course.week_number || week,
          lessons: lessons || [],
        });
      }

      setCourses(coursesWithLessons);
    } catch (error) {
      console.error('Error fetching week content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    if (!user || courses.length === 0) return;
    const lessonIds = courses.flatMap(c => c.lessons.map(l => l.id));
    if (lessonIds.length === 0) return;

    const { data } = await supabase
      .from('user_lesson_progress')
      .select('lesson_id, status')
      .eq('user_id', user.id)
      .in('lesson_id', lessonIds)
      .eq('status', 'completed');

    if (data) {
      setCompletedLessons(new Set(data.map(d => d.lesson_id)));
    }
  };

  if (activeLessonId) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <LessonPlayer
            lessonId={activeLessonId}
            onBack={() => setActiveLessonId(null)}
            onComplete={() => {
              setCompletedLessons(prev => new Set([...prev, activeLessonId]));
              setActiveLessonId(null);
            }}
          />
        </main>
      </div>
    );
  }

  const weekTitles: Record<number, string> = {
    1: "Understanding the Link Between Addiction and Financial Instability",
    2: "Creating a Recovery-Centered Budget",
    3: "Building Your Financial Safety Net",
    4: "Understanding Debt and Credit",
    5: "Planning for the Future",
    6: "Career & Income Growth",
    7: "Mind Over Money",
    8: "Building a Support System & Sustaining Your Journey",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Button variant="outline" onClick={() => navigate('/course-content')} className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course Overview
            </Button>

            {/* Header */}
            <div className="mb-10">
              <Badge variant="outline" className="mb-3">Week {week} of 8</Badge>
              <h1 className="text-3xl font-bold mb-3">
                {weekTitles[week] || `Week ${week}`}
              </h1>
              <p className="text-muted-foreground">
                Select a lesson below to begin learning. Your progress is saved automatically.
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : courses.length === 0 || courses.every(c => c.lessons.length === 0) ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Lessons Coming Soon</h3>
                  <p className="text-muted-foreground mb-6">
                    The interactive lessons for Week {week} are being prepared. Check back soon!
                  </p>
                  <div className="flex gap-3 justify-center">
                    {week > 1 && (
                      <Button variant="outline" onClick={() => navigate(`/course/week/${week - 1}`)}>
                        ← Week {week - 1}
                      </Button>
                    )}
                    {week < 8 && (
                      <Button variant="outline" onClick={() => navigate(`/course/week/${week + 1}`)}>
                        Week {week + 1} →
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {courses.map(course => (
                  <div key={course.id}>
                    {courses.length > 1 && (
                      <h3 className="text-lg font-semibold mb-3">{course.title}</h3>
                    )}
                    <div className="space-y-3">
                      {course.lessons.map(lesson => {
                        const isCompleted = completedLessons.has(lesson.id);
                        return (
                          <Card
                            key={lesson.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${isCompleted ? 'border-primary/30 bg-primary/5' : ''}`}
                            onClick={() => setActiveLessonId(lesson.id)}
                          >
                            <CardContent className="flex items-center justify-between py-5 px-6">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                  {isCompleted ? (
                                    <CheckCircle className="w-5 h-5" />
                                  ) : (
                                    <span className="text-sm font-semibold">{lesson.lesson_number}</span>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold">{lesson.title}</h4>
                                  {lesson.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-1">{lesson.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  <span>{lesson.estimated_duration}min</span>
                                </div>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {lesson.content_type}
                                </Badge>
                                <Button size="sm" variant={isCompleted ? "outline" : "default"}>
                                  <Play className="w-4 h-4 mr-1" />
                                  {isCompleted ? 'Review' : 'Start'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Week navigation */}
                <div className="flex justify-between pt-6">
                  {week > 1 ? (
                    <Button variant="outline" onClick={() => navigate(`/course/week/${week - 1}`)}>
                      ← Week {week - 1}
                    </Button>
                  ) : <div />}
                  {week < 8 && (
                    <Button variant="outline" onClick={() => navigate(`/course/week/${week + 1}`)}>
                      Week {week + 1} →
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeekLessons;
