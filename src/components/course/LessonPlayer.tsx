import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  CheckCircle2,
  Circle,
  Clock, 
  Target,
  Download,
  Bookmark,
  PenTool,
  Video,
  Presentation,
  GripVertical,
  Lightbulb
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
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [dragItems, setDragItems] = useState<Record<string, string[]>>({});
  const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>({});

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
    toast.success('🎉 Lesson completed! Great work on your financial recovery journey!');
    onComplete?.();
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleDragDrop = (item: string, category: string) => {
    setDragItems(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), item]
    }));
  };

  const handleChecklistToggle = (itemKey: string) => {
    setChecklistItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
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
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" onClick={markAsStarted} className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="video" disabled={!lesson.video_url} className="flex items-center gap-1">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Video</span>
            </TabsTrigger>
            <TabsTrigger value="slides" disabled={!lesson.presentation_slides?.length} className="flex items-center gap-1">
              <Presentation className="h-4 w-4" />
              <span className="hidden sm:inline">Slides</span>
            </TabsTrigger>
            <TabsTrigger value="interactive" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Activities</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" disabled={!lesson.quiz_questions?.length} className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-1">
              <PenTool className="h-4 w-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
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
                    <p className="text-lg leading-relaxed">{lesson.text_content}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No text content available.</p>
                )}
              </CardContent>
            </Card>

            {/* Presentation Slides in Content Tab */}
            {lesson.presentation_slides && lesson.presentation_slides.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Lesson Slides</h3>
                {lesson.presentation_slides.map((slide: any, index: number) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="outline" className="text-xs">
                          Slide {index + 1}
                        </Badge>
                        <Badge variant={slide.type === 'intro' ? 'default' : slide.type === 'concept' ? 'secondary' : 'outline'}>
                          {slide.type}
                        </Badge>
                      </div>
                      <h4 className="text-xl font-semibold mb-3">{slide.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{slide.content}</p>
                      {slide.interactive && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Interactive Element</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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

          {/* Enhanced Interactive Elements */}
          <TabsContent value="interactive" className="mt-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Interactive Activities</h3>
              
              {/* Drag and Drop Activity */}
              {lesson.interactive_elements?.dragDrop && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{lesson.interactive_elements.dragDrop.title}</CardTitle>
                    <p className="text-muted-foreground">{lesson.interactive_elements.dragDrop.instruction}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Items to drag */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Items to Sort:</h4>
                        {lesson.interactive_elements.dragDrop.items.map((item: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-3 bg-background border rounded-lg cursor-move hover:bg-muted/50 transition-colors"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Drop zones */}
                      <div className="space-y-4">
                        {lesson.interactive_elements.dragDrop.categories.map((category: string, index: number) => (
                          <div key={index} className="border-2 border-dashed border-muted rounded-lg p-4 min-h-[100px]">
                            <h4 className="font-medium mb-2">{category}</h4>
                            <div className="space-y-1">
                              {(dragItems[category] || []).map((item: string, itemIndex: number) => (
                                <div key={itemIndex} className="p-2 bg-primary/10 rounded text-sm">
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Assessment Checklist */}
              {lesson.interactive_elements?.assessment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{lesson.interactive_elements.assessment.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {lesson.interactive_elements.assessment.categories.map((category: any, categoryIndex: number) => (
                      <div key={categoryIndex} className="mb-6">
                        <h4 className="font-medium mb-3">{category.name}</h4>
                        <div className="space-y-2">
                          {category.items.map((item: string, itemIndex: number) => (
                            <div key={itemIndex} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${categoryIndex}-${itemIndex}`}
                                checked={checklistItems[`${categoryIndex}-${itemIndex}`] || false}
                                onCheckedChange={() => handleChecklistToggle(`${categoryIndex}-${itemIndex}`)}
                              />
                              <label
                                htmlFor={`${categoryIndex}-${itemIndex}`}
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {item}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Priority Matrix */}
              {lesson.interactive_elements?.priorityMatrix && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{lesson.interactive_elements.priorityMatrix.title}</CardTitle>
                    <p className="text-muted-foreground">{lesson.interactive_elements.priorityMatrix.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {lesson.interactive_elements.priorityMatrix.quadrants.map((quadrant: string, index: number) => (
                        <div key={index} className="border-2 border-dashed border-muted rounded-lg p-4 min-h-[120px]">
                          <h4 className="font-medium text-sm mb-2">{quadrant}</h4>
                          <div className="text-xs text-muted-foreground">
                            Drag your financial priorities here
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Habit Builder */}
              {lesson.interactive_elements?.habitBuilder && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{lesson.interactive_elements.habitBuilder.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {lesson.interactive_elements.habitBuilder.habits.map((habit: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                          <Checkbox
                            id={`habit-${index}`}
                            checked={checklistItems[`habit-${index}`] || false}
                            onCheckedChange={() => handleChecklistToggle(`habit-${index}`)}
                          />
                          <div className="flex-1">
                            <label htmlFor={`habit-${index}`} className="font-medium">
                              {habit.name}
                            </label>
                            <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">{habit.frequency}</Badge>
                              <Badge variant="outline" className="text-xs">{habit.category}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Scenario Planning */}
              {lesson.interactive_elements?.scenarioPlanning && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{lesson.interactive_elements.scenarioPlanning.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="font-medium">Common Scenarios:</h4>
                      <div className="grid gap-3">
                        {lesson.interactive_elements.scenarioPlanning.scenarios.map((scenario: string, index: number) => (
                          <div key={index} className="p-3 bg-muted/30 rounded-lg">
                            <p className="font-medium text-sm">{scenario}</p>
                          </div>
                        ))}
                      </div>
                      
                      <h4 className="font-medium mt-6">Response Steps:</h4>
                      <div className="space-y-2">
                        {lesson.interactive_elements.scenarioPlanning.responseSteps.map((step: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs w-6 h-6 rounded-full p-0 flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <span className="text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reflection Questions */}
              {lesson.interactive_elements?.reflection && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Self-Reflection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {lesson.interactive_elements.reflection.questions.map((question: string, index: number) => (
                        <div key={index} className="space-y-2">
                          <label className="text-sm font-medium">{question}</label>
                          <Textarea
                            placeholder="Write your thoughts here..."
                            className="min-h-[80px]"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {!lesson.interactive_elements && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No interactive activities available for this lesson.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Enhanced Quiz */}
          <TabsContent value="quiz" className="mt-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Knowledge Check</h3>
              {lesson.quiz_questions && lesson.quiz_questions.length > 0 ? (
                lesson.quiz_questions.map((question: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-base">Question {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{question.question}</p>
                      <div className="space-y-2">
                        {question.options?.map((option: string, optionIndex: number) => {
                          const isSelected = quizAnswers[index] === optionIndex;
                          const isCorrect = question.correct === optionIndex;
                          const hasAnswered = index in quizAnswers;
                          
                          let variant: "outline" | "default" | "destructive" | "secondary" = "outline";
                          if (hasAnswered && isSelected) {
                            variant = isCorrect ? "default" : "destructive";
                          } else if (hasAnswered && isCorrect) {
                            variant = "secondary";
                          }
                          
                          return (
                            <Button
                              key={optionIndex}
                              variant={variant}
                              className="w-full justify-start text-left h-auto p-3"
                              onClick={() => handleQuizAnswer(index, optionIndex)}
                              disabled={hasAnswered}
                            >
                              <div className="flex items-center gap-2">
                                {hasAnswered && isSelected && (
                                  isCorrect ? 
                                  <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                                  <Circle className="h-4 w-4 text-red-600" />
                                )}
                                {hasAnswered && !isSelected && isCorrect && (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                )}
                                <span>{option}</span>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                      {quizAnswers[index] !== undefined && question.explanation && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm"><strong>Explanation:</strong> {question.explanation}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No quiz available for this lesson.</p>
                  </CardContent>
                </Card>
              )}
            </div>
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
              <Button onClick={markAsComplete} className="bg-gradient-to-r from-primary to-primary/80">
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