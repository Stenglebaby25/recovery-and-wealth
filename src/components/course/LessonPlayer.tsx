import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Clock, 
  Target,
  Download,
  Bookmark,
  PenTool
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Lesson {
  id: string;
  course_id: string;
  lesson_number: number;
  title: string;
  description: string;
  content_type: string;
  video_url?: string;
  video_duration?: number;
  presentation_slides?: any;
  text_content?: string;
  interactive_elements?: any;
  quiz_questions?: any;
  estimated_duration: number;
  learning_objectives: string[];
  resources?: any;
}

interface LessonProgress {
  status: string;
  progress_percentage: number;
  time_spent: number;
  video_progress: number;
  notes: string;
  quiz_score?: number;
  started_at?: string;
  completed_at?: string;
}

interface LessonPlayerProps {
  lessonId: string;
  onComplete?: () => void;
  onBack?: () => void;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({ lessonId, onComplete, onBack }) => {
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress>({
    status: 'not_started',
    progress_percentage: 0,
    time_spent: 0,
    video_progress: 0,
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userNotes, setUserNotes] = useState('');

  useEffect(() => {
    if (lessonId) {
      fetchLesson();
      if (user) {
        fetchProgress();
      }
    }
  }, [lessonId, user]);

  const fetchLesson = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      setLesson(data);
    } catch (error) {
      console.error('Error fetching lesson:', error);
      toast.error('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (data) {
        setProgress(data);
        setUserNotes(data.notes || '');
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const updateProgress = async (updates: Partial<LessonProgress>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          course_id: lesson?.course_id,
          ...progress,
          ...updates,
          last_accessed: new Date().toISOString()
        });

      if (error) throw error;
      setProgress(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const markAsStarted = () => {
    if (progress.status === 'not_started') {
      updateProgress({
        status: 'in_progress',
        started_at: new Date().toISOString()
      });
    }
  };

  const saveNotes = async () => {
    await updateProgress({ notes: userNotes });
    toast.success('Notes saved!');
  };

  const markAsComplete = async () => {
    await updateProgress({
      status: 'completed',
      progress_percentage: 100,
      completed_at: new Date().toISOString()
    });
    toast.success('Lesson completed!');
    onComplete?.();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Lesson not found</h2>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={onBack} className="mb-4">
              ← Back to Course
            </Button>
            <Badge variant={progress.status === 'completed' ? 'default' : 'secondary'}>
              {progress.status === 'completed' ? 'Completed' : progress.status === 'in_progress' ? 'In Progress' : 'Not Started'}
            </Badge>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">
            Lesson {lesson.lesson_number}: {lesson.title}
          </h1>
          <p className="text-muted-foreground mb-4">{lesson.description}</p>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{progress.progress_percentage}%</span>
            </div>
            <Progress value={progress.progress_percentage} className="w-full" />
          </div>

          {/* Lesson Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{lesson.estimated_duration} min</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Objectives</p>
                  <p className="font-semibold">{lesson.learning_objectives?.length || 0}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-semibold capitalize">{lesson.content_type}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" onClick={markAsStarted}>Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="video" disabled={!lesson.video_url}>Video</TabsTrigger>
            <TabsTrigger value="slides" disabled={!lesson.presentation_slides?.length}>Slides</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Learning Objectives</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lesson.learning_objectives && lesson.learning_objectives.length > 0 ? (
                  <ul className="space-y-2">
                    {lesson.learning_objectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No learning objectives defined.</p>
                )}
                
                {lesson.resources && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Resources</span>
                    </h4>
                    <div className="space-y-2">
                      {/* Add resource downloads here */}
                      <p className="text-sm text-muted-foreground">
                        Additional resources will be available here.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Lesson Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lesson.text_content ? (
                  <div className="prose max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: lesson.text_content }} />
                  </div>
                ) : (
                  <p className="text-muted-foreground">No text content available.</p>
                )}
                
                {lesson.interactive_elements && (
                  <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-4">Interactive Exercise</h4>
                    <p className="text-muted-foreground">
                      Interactive elements will be rendered here based on the lesson configuration.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Video Lesson</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lesson.video_url ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Video player will be integrated here</p>
                        <p className="text-sm text-muted-foreground mt-2">{lesson.video_url}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Duration: {Math.floor((lesson.video_duration || 0) / 60)}:{String((lesson.video_duration || 0) % 60).padStart(2, '0')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Progress: {Math.floor((progress.video_progress / (lesson.video_duration || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No video content available for this lesson.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="slides" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Presentation Slides</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lesson.presentation_slides && lesson.presentation_slides.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Slide {currentSlide + 1} of {lesson.presentation_slides.length}
                      </span>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                          disabled={currentSlide === 0}
                        >
                          Previous
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentSlide(Math.min(lesson.presentation_slides!.length - 1, currentSlide + 1))}
                          disabled={currentSlide === lesson.presentation_slides.length - 1}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Slide content will be displayed here</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No presentation slides available for this lesson.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PenTool className="w-5 h-5" />
                  <span>Your Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Take notes while you learn..."
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    rows={8}
                  />
                  <Button onClick={saveNotes}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onBack}>
            Back to Course
          </Button>
          <div className="space-x-2">
            {progress.status !== 'completed' && (
              <Button onClick={markAsComplete}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;