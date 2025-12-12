import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, Clock, AlertTriangle, Heart, Brain, Users, Bed, BookOpen, PenLine, Target, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface HALTLesson {
  id: string;
  letter: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  keyPoints: string[];
  financialTriggers: string[];
  preventionStrategies: string[];
  practicalExercise: {
    title: string;
    steps: string[];
  };
  quizQuestions: QuizQuestion[];
  reflectionPrompts: string[];
}

interface LessonProgress {
  lesson_id: string;
  completed_at: string | null;
  quiz_responses: any[];
  quiz_score: number | null;
  reflection_notes: string | null;
  self_assessment_rating: number | null;
  exercise_steps_completed: boolean[];
}

const haltLessons: HALTLesson[] = [
  {
    id: "hungry",
    letter: "H",
    title: "Hungry",
    subtitle: "Blood Sugar & Financial Decision-Making",
    icon: <Heart className="h-6 w-6 text-red-500" />,
    description: "When you're hungry, your blood sugar levels drop, leading to irritability, poor decision-making, and impaired cognitive function. This physiological state makes you more vulnerable to impulsive financial choices and emotional spending patterns.",
    keyPoints: [
      "Low blood sugar levels can impair your decision-making abilities, including financial decisions",
      "Stable blood sugar levels are essential for clear thinking and making sound choices",
      "Hunger affects mood and makes it difficult to concentrate on important matters",
      "Eating nutritious meals provides the energy needed for sound financial decisions",
      "Proper nutrition supports mental clarity and focus during financial planning"
    ],
    financialTriggers: [
      "Impulse buying expensive food when hungry instead of planned meals",
      "Making major financial decisions on an empty stomach",
      "Excessive use of food delivery apps when unprepared with groceries",
      "Shopping for groceries while hungry, leading to overspending on unnecessary items",
      "Stress eating during financial difficulties, creating additional expenses",
      "Poor meal planning leading to consistent overspending on food"
    ],
    preventionStrategies: [
      "Never make important financial decisions when hungry - establish this as a firm rule",
      "Keep healthy, affordable snacks readily available at home and work",
      "Plan meals and grocery shopping in advance with detailed lists",
      "Wait 30 minutes after eating before making any major financial choices",
      "Create a basic needs checklist before important financial decisions",
      "Maintain stable blood sugar through regular, nutritious meals and snacks",
      "Establish consistent meal times to prevent hunger-driven financial decisions"
    ],
    practicalExercise: {
      title: "Blood Sugar & Financial Decision Tracking",
      steps: [
        "Track your hunger levels throughout the day using a 1-10 scale for one week",
        "Note any financial decisions made at each hunger level and their outcomes",
        "Identify specific patterns between hunger and spending impulses",
        "Practice the 'HALT pause' - check if you're hungry before any purchase over $20",
        "Create a personal meal planning system that supports stable blood sugar",
        "Develop emergency snack strategies for unexpected hunger during important financial tasks"
      ]
    },
    quizQuestions: [
      {
        id: "h1",
        question: "What happens to your decision-making abilities when your blood sugar drops?",
        options: [
          "They improve due to increased focus",
          "They become impaired and more impulsive",
          "They remain unchanged",
          "They only affect physical activities"
        ],
        correctAnswer: 1,
        explanation: "Low blood sugar impairs cognitive function, leading to poor decision-making and increased impulsivity, especially with finances."
      },
      {
        id: "h2",
        question: "What is the recommended wait time after eating before making major financial decisions?",
        options: ["5 minutes", "15 minutes", "30 minutes", "1 hour"],
        correctAnswer: 2,
        explanation: "Waiting 30 minutes after eating allows your blood sugar to stabilize, giving you clearer thinking for important decisions."
      },
      {
        id: "h3",
        question: "Which is a common financial trigger related to hunger?",
        options: [
          "Carefully planning grocery lists",
          "Shopping for groceries while hungry",
          "Eating before shopping",
          "Cooking at home regularly"
        ],
        correctAnswer: 1,
        explanation: "Shopping while hungry leads to impulse purchases and overspending on unnecessary items."
      }
    ],
    reflectionPrompts: [
      "Think about the last time you made a financial decision while hungry. What happened?",
      "What patterns do you notice between your eating habits and spending behaviors?",
      "What healthy snacks could you keep available to prevent hunger-driven decisions?"
    ]
  },
  {
    id: "angry",
    letter: "A",
    title: "Angry",
    subtitle: "Managing Financial Decisions During Emotional Stress",
    icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
    description: "Anger can lead to impulsive behavior, such as overspending or gambling. Making financial decisions while angry can result in regret and financial difficulties. It's important to recognize the connection between anger and finances to avoid negative consequences.",
    keyPoints: [
      "Anger activates emotional centers and impairs rational decision-making processes",
      "Emotional spending often serves as an unhealthy coping mechanism during stress",
      "Anger can lead to revenge spending, gambling, or other impulsive financial behaviors",
      "Financial decisions made in anger often result in regret and long-term financial difficulties",
      "Recognizing the signs of anger helps prevent poor financial choices",
      "Calming down before financial decisions leads to clearer thinking and rational choices"
    ],
    financialTriggers: [
      "Revenge spending after arguments with partners, family, or colleagues",
      "Impulse purchases to feel better, regain control, or prove independence",
      "Making major financial decisions out of spite or to hurt others",
      "Online shopping binges during emotional distress or anger episodes",
      "Quitting jobs or making career changes in anger without proper planning",
      "Gambling or risky investments to cope with anger or frustration",
      "Overspending on luxury items when feeling undervalued or disrespected"
    ],
    preventionStrategies: [
      "Take time to calm down before making any financial decisions",
      "Implement a mandatory 24-hour cooling-off period for purchases over $50",
      "Use the 'STOP' technique: Stop, Take a breath, Observe your emotions, Proceed mindfully",
      "Engage in calming activities like deep breathing, meditation, or going for a walk",
      "Channel anger into physical activity before making financial choices",
      "Keep a list of free or low-cost anger management activities",
      "Remove access to payment methods from devices during emotional episodes",
      "Seek professional help for anger management strategies when needed"
    ],
    practicalExercise: {
      title: "Anger & Financial Decision Analysis",
      steps: [
        "Review your last 6 months of purchases and identify those made during anger or stress",
        "Calculate the total financial cost of anger-driven spending decisions",
        "Identify your personal anger triggers and their connection to spending patterns",
        "Create an 'Anger Emergency Kit' with healthy alternatives to spending",
        "Practice the 24-hour rule for all non-essential purchases when feeling angry",
        "Develop a personal anger management protocol before making financial decisions",
        "Track your emotional state before major financial choices for 30 days"
      ]
    },
    quizQuestions: [
      {
        id: "a1",
        question: "What is 'revenge spending'?",
        options: [
          "Buying items to get back at someone after an argument",
          "Spending money to celebrate a victory",
          "Saving money to prove a point",
          "Returning items for a refund"
        ],
        correctAnswer: 0,
        explanation: "Revenge spending is when you make purchases out of spite or to hurt someone after an argument, often leading to regret."
      },
      {
        id: "a2",
        question: "How long should you wait before making a non-essential purchase when angry?",
        options: ["1 hour", "6 hours", "24 hours", "1 week"],
        correctAnswer: 2,
        explanation: "A 24-hour cooling-off period allows your emotions to settle and helps you make more rational financial decisions."
      },
      {
        id: "a3",
        question: "What does STOP stand for in the anger management technique?",
        options: [
          "Stay, Think, Organize, Plan",
          "Stop, Take a breath, Observe, Proceed mindfully",
          "Sit, Talk, Open up, Pause",
          "Stand, Think, Observe, Purchase"
        ],
        correctAnswer: 1,
        explanation: "STOP helps you pause and assess your emotional state before making decisions: Stop, Take a breath, Observe your emotions, Proceed mindfully."
      }
    ],
    reflectionPrompts: [
      "Recall a time when anger led to a financial decision you regretted. What would you do differently?",
      "What are your personal anger triggers that affect your spending?",
      "What healthy outlets could replace spending when you're feeling angry?"
    ]
  },
  {
    id: "lonely",
    letter: "L",
    title: "Lonely",
    subtitle: "Building Financial Recovery Through Connection",
    icon: <Users className="h-6 w-6 text-blue-500" />,
    description: "Loneliness can lead to feelings of isolation and depression, making it difficult to stay sober and manage finances effectively. Connecting with others in recovery is essential to combat loneliness and build a strong support network for financial recovery.",
    keyPoints: [
      "Loneliness triggers the same neurological pain centers as physical injury",
      "Isolation can lead to relapse and financial setbacks in recovery",
      "Spending often serves as an unhealthy substitute for genuine social connection",
      "A strong support network provides emotional support during difficult financial times",
      "Social spending can lead to dangerous financial overextension beyond your means",
      "Building authentic relationships helps you stay accountable to financial recovery goals",
      "Community connections provide practical resources and financial guidance"
    ],
    financialTriggers: [
      "Overspending on social activities to maintain friendships or gain acceptance",
      "Retail therapy and impulse purchases to fill emotional voids",
      "Expensive hobbies, activities, or memberships seeking social connection",
      "Generosity far beyond financial means to gain approval or friendship",
      "Status purchases (clothes, gadgets, cars) to feel included or worthy",
      "Excessive dining out or entertainment spending to avoid being alone",
      "Paying for others' expenses to maintain relationships or avoid rejection"
    ],
    preventionStrategies: [
      "Attend recovery meetings to meet others who understand your journey",
      "Join support groups (online or in-person) to connect with people facing similar challenges",
      "Talk to a sponsor who can provide guidance and financial accountability",
      "Build a support network that doesn't revolve around spending money",
      "Find free or low-cost social activities and community events",
      "Practice self-compassion and mindfulness techniques to manage loneliness",
      "Set clear, non-negotiable boundaries around social spending",
      "Develop hobbies and interests that provide intrinsic satisfaction and community"
    ],
    practicalExercise: {
      title: "Recovery Connection & Financial Impact Assessment",
      steps: [
        "List your current social activities and calculate their monthly costs",
        "Identify free or low-cost alternatives for meaningful connection",
        "Track loneliness levels (1-10 scale) and spending patterns for two weeks",
        "Reach out to one person in your recovery network daily without spending money",
        "Create a 'loneliness emergency plan' with non-financial connection strategies",
        "Attend one new recovery meeting or support group this week",
        "Build a list of supportive relationships that prioritize sobriety over spending"
      ]
    },
    quizQuestions: [
      {
        id: "l1",
        question: "How does loneliness affect the brain?",
        options: [
          "It has no neurological impact",
          "It triggers the same pain centers as physical injury",
          "It improves focus and concentration",
          "It only affects emotional well-being"
        ],
        correctAnswer: 1,
        explanation: "Research shows loneliness activates the same brain regions as physical pain, making it a powerful driver of coping behaviors like spending."
      },
      {
        id: "l2",
        question: "What is 'retail therapy' in the context of loneliness?",
        options: [
          "Professional counseling about shopping habits",
          "Buying items to fill emotional voids or cope with isolation",
          "A healthy way to manage emotions",
          "Shopping with a therapist"
        ],
        correctAnswer: 1,
        explanation: "Retail therapy refers to impulse purchases made to temporarily relieve negative emotions like loneliness, often leading to financial problems."
      },
      {
        id: "l3",
        question: "Which is a healthy strategy to combat loneliness without overspending?",
        options: [
          "Buying gifts for friends to maintain relationships",
          "Joining expensive clubs to meet people",
          "Attending free recovery meetings and support groups",
          "Dining out frequently to avoid being alone"
        ],
        correctAnswer: 2,
        explanation: "Free recovery meetings provide genuine connection and support without financial burden."
      }
    ],
    reflectionPrompts: [
      "How has loneliness influenced your spending habits in the past?",
      "What free or low-cost activities bring you genuine connection and joy?",
      "Who in your life provides support without expectations of spending?"
    ]
  },
  {
    id: "tired",
    letter: "T",
    title: "Tired",
    subtitle: "Sleep & Financial Decision-Making",
    icon: <Bed className="h-6 w-6 text-purple-500" />,
    description: "When you're tired, your decision-making abilities are impaired, and you're more likely to make mistakes and poor financial decisions. Lack of sleep leads to decreased cognitive function, reduced attention span, slower reaction times, and increased susceptibility to poor financial choices.",
    keyPoints: [
      "Tiredness impairs decision-making abilities and leads to financial mistakes",
      "Lack of sleep decreases cognitive function, attention span, and reaction times",
      "Decision fatigue reduces willpower and self-control throughout the day",
      "Tired minds seek convenience regardless of cost, leading to overspending",
      "Sleep deprivation affects impulse control and increases risky financial behavior",
      "Exhaustion impairs long-term thinking and strategic financial planning",
      "Fatigue makes you more susceptible to marketing tactics and sales pressure",
      "Getting enough sleep is crucial for making sound financial decisions"
    ],
    financialTriggers: [
      "Convenience purchases when too tired to plan ahead or cook meals",
      "Expensive food delivery services instead of meal planning and preparation",
      "Impulse online shopping late at night when defenses are down",
      "Poor investment decisions made during periods of mental fatigue",
      "Agreeing to financial commitments or contracts without proper consideration",
      "Making major purchases while exhausted from work or stress",
      "Using credit cards for convenience when too tired to manage cash flow",
      "Avoiding financial planning tasks due to mental exhaustion"
    ],
    preventionStrategies: [
      "Establish a consistent sleep schedule by going to bed and waking up at the same time",
      "Never make important financial decisions when tired or sleep-deprived",
      "Create a relaxing bedtime routine to signal your body it's time to sleep",
      "Automate routine financial tasks to reduce daily decision fatigue",
      "Plan major purchases and financial activities for high-energy periods",
      "Create evening routines that don't involve access to financial accounts",
      "Use the 'morning test' - revisit all evening financial decisions the next day",
      "Limit screen time before bed to improve sleep quality and decision-making"
    ],
    practicalExercise: {
      title: "Sleep Quality & Financial Decision Tracking",
      steps: [
        "Track your sleep hours and quality alongside energy levels for two weeks",
        "Note any financial decisions made during low-energy or tired periods",
        "Identify your personal peak decision-making hours throughout the day",
        "Schedule important financial tasks and planning during high-energy periods",
        "Create automated systems for routine financial decisions to reduce fatigue",
        "Develop a pre-bedtime routine that removes access to spending apps and websites",
        "Practice the 'morning review' - evaluate all evening financial choices the next day"
      ]
    },
    quizQuestions: [
      {
        id: "t1",
        question: "What is 'decision fatigue'?",
        options: [
          "Being tired of making too many decisions",
          "Reduced willpower and self-control as the day progresses",
          "A medical condition requiring treatment",
          "Feeling sleepy after lunch"
        ],
        correctAnswer: 1,
        explanation: "Decision fatigue refers to the deteriorating quality of decisions after a long session of decision-making, reducing your willpower throughout the day."
      },
      {
        id: "t2",
        question: "Why is late-night online shopping particularly risky?",
        options: [
          "Better deals are available during the day",
          "Websites are slower at night",
          "Your defenses and impulse control are lowered when tired",
          "Credit cards don't work at night"
        ],
        correctAnswer: 2,
        explanation: "When tired, your impulse control is weakened, making you more susceptible to unnecessary purchases and marketing tactics."
      },
      {
        id: "t3",
        question: "What is the 'morning test' for financial decisions?",
        options: [
          "Making all purchases before noon",
          "Checking bank balances each morning",
          "Revisiting evening financial decisions the next day with fresh eyes",
          "Only shopping on weekday mornings"
        ],
        correctAnswer: 2,
        explanation: "The morning test means reviewing any financial decisions made when tired the next day to ensure they still seem wise with a rested mind."
      }
    ],
    reflectionPrompts: [
      "What time of day do you typically feel most clear-headed for financial decisions?",
      "Have you ever made a purchase late at night that you regretted? What happened?",
      "How could improving your sleep routine benefit your financial health?"
    ]
  }
];

const HALTLessons = () => {
  const [activeLesson, setActiveLesson] = useState("hungry");
  const [progressData, setProgressData] = useState<Record<string, LessonProgress>>({});
  const [currentReflection, setCurrentReflection] = useState("");
  const [selfAssessment, setSelfAssessment] = useState(5);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [exerciseSteps, setExerciseSteps] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const currentLesson = haltLessons.find(lesson => lesson.id === activeLesson)!;
  const currentProgress = progressData[activeLesson];

  // Load progress data
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('halt_lesson_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading progress:', error);
      } else if (data) {
        const progressMap: Record<string, LessonProgress> = {};
        data.forEach((item: any) => {
          progressMap[item.lesson_id] = {
            lesson_id: item.lesson_id,
            completed_at: item.completed_at,
            quiz_responses: item.quiz_responses || [],
            quiz_score: item.quiz_score,
            reflection_notes: item.reflection_notes,
            self_assessment_rating: item.self_assessment_rating,
            exercise_steps_completed: item.exercise_steps_completed || []
          };
        });
        setProgressData(progressMap);
      }
      setIsLoading(false);
    };

    loadProgress();
  }, [user]);

  // Update local state when lesson changes
  useEffect(() => {
    const progress = progressData[activeLesson];
    if (progress) {
      setCurrentReflection(progress.reflection_notes || "");
      setSelfAssessment(progress.self_assessment_rating || 5);
      setExerciseSteps(progress.exercise_steps_completed || new Array(currentLesson.practicalExercise.steps.length).fill(false));
      setQuizSubmitted(!!progress.quiz_score);
      if (progress.quiz_responses) {
        const answers: Record<string, number> = {};
        progress.quiz_responses.forEach((r: any) => {
          answers[r.questionId] = r.answer;
        });
        setQuizAnswers(answers);
      }
    } else {
      setCurrentReflection("");
      setSelfAssessment(5);
      setExerciseSteps(new Array(currentLesson.practicalExercise.steps.length).fill(false));
      setQuizAnswers({});
      setQuizSubmitted(false);
    }
  }, [activeLesson, progressData]);

  const saveProgress = async (updates: Partial<LessonProgress>) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your progress.",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('halt_lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: activeLesson,
        ...updates,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,lesson_id'
      });

    if (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Error saving",
        description: "Could not save your progress. Please try again.",
        variant: "destructive"
      });
    } else {
      setProgressData(prev => ({
        ...prev,
        [activeLesson]: {
          ...prev[activeLesson],
          lesson_id: activeLesson,
          ...updates
        } as LessonProgress
      }));
    }
  };

  const handleSaveReflection = async () => {
    await saveProgress({ reflection_notes: currentReflection });
    toast({
      title: "Reflection saved",
      description: "Your thoughts have been saved."
    });
  };

  const handleSaveSelfAssessment = async () => {
    await saveProgress({ self_assessment_rating: selfAssessment });
    toast({
      title: "Self-assessment saved",
      description: "Your rating has been recorded."
    });
  };

  const handleSubmitQuiz = async () => {
    const score = currentLesson.quizQuestions.reduce((acc, q) => {
      return acc + (quizAnswers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);

    const responses = Object.entries(quizAnswers).map(([questionId, answer]) => ({
      questionId,
      answer
    }));

    await saveProgress({ 
      quiz_score: score, 
      quiz_responses: responses 
    });
    
    setQuizSubmitted(true);
    toast({
      title: `Quiz Complete! ${score}/${currentLesson.quizQuestions.length}`,
      description: score === currentLesson.quizQuestions.length 
        ? "Perfect score! Great understanding!" 
        : "Review the explanations to deepen your understanding."
    });
  };

  const handleToggleExerciseStep = async (index: number) => {
    const newSteps = [...exerciseSteps];
    newSteps[index] = !newSteps[index];
    setExerciseSteps(newSteps);
    await saveProgress({ exercise_steps_completed: newSteps });
  };

  const handleMarkComplete = async () => {
    await saveProgress({ completed_at: new Date().toISOString() });
    toast({
      title: "Lesson completed!",
      description: "Great work on building your H.A.L.T. awareness."
    });
  };

  const completedCount = Object.values(progressData).filter(p => p.completed_at).length;
  const completionPercentage = (completedCount / haltLessons.length) * 100;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Loading your progress...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          H.A.L.T. Recovery Lessons
        </h1>
        <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-6">
          Learn to identify and manage the four most common emotional triggers that lead to poor financial decisions in recovery.
        </p>
        
        {/* Progress Overview */}
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedCount} of {haltLessons.length} lessons
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            {!user && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Sign in to save your progress
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* H.A.L.T. Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {haltLessons.map((lesson) => {
          const progress = progressData[lesson.id];
          const isCompleted = !!progress?.completed_at;
          
          return (
            <Card 
              key={lesson.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                activeLesson === lesson.id ? 'ring-2 ring-primary' : ''
              } ${isCompleted ? 'bg-green-50 dark:bg-green-950' : ''}`}
              onClick={() => setActiveLesson(lesson.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {lesson.icon}
                  {isCompleted && (
                    <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                  )}
                </div>
                <div className="text-2xl font-bold mb-1">{lesson.letter}</div>
                <div className="text-sm font-medium">{lesson.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {lesson.subtitle}
                </div>
                {progress?.quiz_score !== null && progress?.quiz_score !== undefined && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    Quiz: {progress.quiz_score}/{lesson.quizQuestions.length}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Lesson Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {currentLesson.icon}
              <div>
                <CardTitle className="text-2xl">
                  {currentLesson.letter} - {currentLesson.title}
                </CardTitle>
                <CardDescription className="text-lg">
                  {currentLesson.subtitle}
                </CardDescription>
              </div>
            </div>
            {currentProgress?.completed_at && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-4">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                <BookOpen className="h-4 w-4 mr-1 hidden sm:inline" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="triggers" className="text-xs sm:text-sm">
                <AlertTriangle className="h-4 w-4 mr-1 hidden sm:inline" />
                Triggers
              </TabsTrigger>
              <TabsTrigger value="strategies" className="text-xs sm:text-sm">
                <Target className="h-4 w-4 mr-1 hidden sm:inline" />
                Strategies
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-xs sm:text-sm">
                <Sparkles className="h-4 w-4 mr-1 hidden sm:inline" />
                Quiz
              </TabsTrigger>
              <TabsTrigger value="reflect" className="text-xs sm:text-sm">
                <PenLine className="h-4 w-4 mr-1 hidden sm:inline" />
                Reflect
              </TabsTrigger>
              <TabsTrigger value="exercise" className="text-xs sm:text-sm">
                <CheckCircle className="h-4 w-4 mr-1 hidden sm:inline" />
                Exercise
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <p className="text-lg leading-relaxed">{currentLesson.description}</p>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Key Learning Points</h3>
                <ul className="space-y-2">
                  {currentLesson.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="triggers" className="space-y-4">
              <h3 className="text-xl font-semibold">Common Financial Triggers</h3>
              <p className="text-muted-foreground">
                Recognize these patterns to prevent impulsive financial decisions:
              </p>
              <ul className="space-y-3">
                {currentLesson.financialTriggers.map((trigger, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{trigger}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="strategies" className="space-y-4">
              <h3 className="text-xl font-semibold">Prevention Strategies</h3>
              <p className="text-muted-foreground">
                Practical tools to manage this trigger when it arises:
              </p>
              <ul className="space-y-3">
                {currentLesson.preventionStrategies.map((strategy, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="quiz" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Knowledge Check</h3>
                <p className="text-muted-foreground mb-6">
                  Test your understanding of the {currentLesson.title} trigger:
                </p>
              </div>

              {currentLesson.quizQuestions.map((question, qIndex) => (
                <Card key={question.id} className="p-4">
                  <p className="font-medium mb-3">
                    {qIndex + 1}. {question.question}
                  </p>
                  <RadioGroup
                    value={quizAnswers[question.id]?.toString()}
                    onValueChange={(value) => setQuizAnswers(prev => ({
                      ...prev,
                      [question.id]: parseInt(value)
                    }))}
                    disabled={quizSubmitted}
                  >
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className={`flex items-center space-x-2 p-2 rounded ${
                        quizSubmitted && oIndex === question.correctAnswer 
                          ? 'bg-green-100 dark:bg-green-900' 
                          : quizSubmitted && quizAnswers[question.id] === oIndex && oIndex !== question.correctAnswer
                          ? 'bg-red-100 dark:bg-red-900'
                          : ''
                      }`}>
                        <RadioGroupItem value={oIndex.toString()} id={`${question.id}-${oIndex}`} />
                        <Label htmlFor={`${question.id}-${oIndex}`} className="cursor-pointer flex-1">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {quizSubmitted && (
                    <p className="mt-2 text-sm text-muted-foreground bg-muted p-2 rounded">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  )}
                </Card>
              ))}

              {!quizSubmitted ? (
                <Button 
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length < currentLesson.quizQuestions.length}
                  className="w-full"
                >
                  Submit Quiz
                </Button>
              ) : (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="font-medium">
                    Your Score: {currentProgress?.quiz_score || 0}/{currentLesson.quizQuestions.length}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                  >
                    Retake Quiz
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reflect" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Personal Reflection</h3>
                <p className="text-muted-foreground mb-4">
                  Take a moment to reflect on how this trigger affects your life:
                </p>
              </div>

              {/* Self-Assessment */}
              <Card className="p-4">
                <h4 className="font-medium mb-4">
                  How much does "{currentLesson.title}" affect your financial decisions?
                </h4>
                <div className="space-y-4">
                  <Slider
                    value={[selfAssessment]}
                    onValueChange={(value) => setSelfAssessment(value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1 - Rarely</span>
                    <span className="font-medium text-foreground">{selfAssessment}/10</span>
                    <span>10 - Very Often</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSaveSelfAssessment}>
                    Save Rating
                  </Button>
                </div>
              </Card>

              {/* Reflection Prompts */}
              <div className="space-y-4">
                <h4 className="font-medium">Reflection Prompts</h4>
                <ul className="space-y-2 text-muted-foreground">
                  {currentLesson.reflectionPrompts.map((prompt, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <PenLine className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>{prompt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Journal Entry */}
              <div className="space-y-3">
                <h4 className="font-medium">Your Journal Entry</h4>
                <Textarea
                  placeholder="Write your thoughts, experiences, and insights here... This is a safe space for honest reflection."
                  value={currentReflection}
                  onChange={(e) => setCurrentReflection(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <Button onClick={handleSaveReflection} disabled={!currentReflection.trim()}>
                  Save Reflection
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="exercise" className="space-y-4">
              <h3 className="text-xl font-semibold">{currentLesson.practicalExercise.title}</h3>
              <p className="text-muted-foreground mb-4">
                Complete this practical exercise to reinforce your learning. Check off each step as you complete it:
              </p>
              <ol className="space-y-3">
                {currentLesson.practicalExercise.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Checkbox
                      id={`step-${index}`}
                      checked={exerciseSteps[index] || false}
                      onCheckedChange={() => handleToggleExerciseStep(index)}
                      className="mt-1"
                    />
                    <label 
                      htmlFor={`step-${index}`}
                      className={`cursor-pointer ${exerciseSteps[index] ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {step}
                    </label>
                  </li>
                ))}
              </ol>
              
              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  {exerciseSteps.filter(Boolean).length} of {currentLesson.practicalExercise.steps.length} steps completed
                </p>
                {!currentProgress?.completed_at ? (
                  <Button 
                    onClick={handleMarkComplete}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Lesson as Complete
                  </Button>
                ) : (
                  <div className="text-center text-green-600 font-medium">
                    ✓ Lesson completed! Great work on building your H.A.L.T. awareness.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={() => {
            const currentIndex = haltLessons.findIndex(l => l.id === activeLesson);
            if (currentIndex > 0) {
              setActiveLesson(haltLessons[currentIndex - 1].id);
            }
          }}
          disabled={haltLessons.findIndex(l => l.id === activeLesson) === 0}
        >
          Previous Lesson
        </Button>
        
        <Button 
          onClick={() => {
            const currentIndex = haltLessons.findIndex(l => l.id === activeLesson);
            if (currentIndex < haltLessons.length - 1) {
              setActiveLesson(haltLessons[currentIndex + 1].id);
            }
          }}
          disabled={haltLessons.findIndex(l => l.id === activeLesson) === haltLessons.length - 1}
        >
          Next Lesson
        </Button>
      </div>
    </div>
  );
};

export default HALTLessons;
