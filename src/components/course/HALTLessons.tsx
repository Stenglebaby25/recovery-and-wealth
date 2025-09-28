import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, Heart, Brain, Users, Bed } from "lucide-react";

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
  completed: boolean;
}

const haltLessons: HALTLesson[] = [
  {
    id: "hungry",
    letter: "H",
    title: "Hungry",
    subtitle: "Financial Decisions & Basic Needs",
    icon: <Heart className="h-6 w-6 text-red-500" />,
    description: "When our basic physical needs aren't met, our decision-making becomes compromised. Hunger affects blood sugar and cognitive function, leading to impulsive financial choices.",
    keyPoints: [
      "Low blood sugar impairs judgment and increases impulsivity",
      "Physical discomfort often leads to immediate gratification seeking",
      "Hunger can trigger emotional spending to feel better",
      "Basic needs must be met before making important financial decisions"
    ],
    financialTriggers: [
      "Impulse buying food when hungry at expensive locations",
      "Making major financial decisions on an empty stomach",
      "Using food delivery apps excessively when unprepared",
      "Shopping for groceries while hungry, leading to overspending"
    ],
    preventionStrategies: [
      "Never make financial decisions when hungry",
      "Keep healthy snacks readily available",
      "Plan meals and grocery shopping in advance",
      "Wait 30 minutes after eating before major financial choices",
      "Create a basic needs checklist before important decisions"
    ],
    practicalExercise: {
      title: "The 24-Hour Hunger Awareness Challenge",
      steps: [
        "Track your hunger levels throughout the day (1-10 scale)",
        "Note any financial decisions made at each hunger level",
        "Identify patterns between hunger and spending impulses",
        "Practice the 'HALT pause' - check if you're hungry before any purchase over $20",
        "Create a personal hunger management plan"
      ]
    },
    completed: false
  },
  {
    id: "angry",
    letter: "A",
    title: "Angry",
    subtitle: "Managing Money During Emotional Stress",
    icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
    description: "Anger triggers fight-or-flight responses that bypass rational thinking. This emotional state often leads to revenge spending, impulsive purchases, or financial decisions we later regret.",
    keyPoints: [
      "Anger activates the amygdala and shuts down prefrontal cortex (rational thinking)",
      "Emotional spending often serves as a coping mechanism",
      "Anger can lead to revenge spending or 'retail therapy'",
      "Financial decisions made in anger often have long-term negative consequences"
    ],
    financialTriggers: [
      "Revenge spending after arguments with partners/family",
      "Impulse purchases to feel better or regain control",
      "Making major financial decisions out of spite",
      "Online shopping binges during emotional distress",
      "Quitting jobs or making career changes in anger"
    ],
    preventionStrategies: [
      "Implement a 24-hour cooling-off period for purchases over $50",
      "Use the 'STOP' technique: Stop, Take a breath, Observe, Proceed mindfully",
      "Channel anger into physical activity before financial decisions",
      "Keep a list of free or low-cost anger management activities",
      "Remove payment methods from devices during emotional episodes"
    ],
    practicalExercise: {
      title: "Anger Spending Pattern Analysis",
      steps: [
        "Review your last 3 months of purchases",
        "Identify purchases made during emotional stress",
        "Calculate the total cost of anger-driven spending",
        "Create an 'Anger Emergency Kit' with healthier alternatives",
        "Practice the 24-hour rule for all non-essential purchases"
      ]
    },
    completed: false
  },
  {
    id: "lonely",
    letter: "L",
    title: "Lonely",
    subtitle: "Financial Isolation & Connection-Seeking Behaviors",
    icon: <Users className="h-6 w-6 text-blue-500" />,
    description: "Loneliness drives us to seek connection and belonging, often through spending. This can manifest as social spending, retail therapy, or expensive attempts to buy friendship or status.",
    keyPoints: [
      "Loneliness triggers the same pain centers as physical injury",
      "Spending often serves as a substitute for social connection",
      "Retail therapy provides temporary emotional relief",
      "Social spending can lead to financial overextension",
      "Isolation can worsen financial anxiety and poor decision-making"
    ],
    financialTriggers: [
      "Overspending on social activities to maintain friendships",
      "Retail therapy to fill emotional voids",
      "Expensive hobbies or activities seeking social connection",
      "Generosity beyond financial means to gain approval",
      "Status purchases to feel included or worthy"
    ],
    preventionStrategies: [
      "Build a support network that doesn't revolve around spending",
      "Find free or low-cost social activities and communities",
      "Practice self-compassion and mindfulness techniques",
      "Set clear boundaries around social spending",
      "Develop hobbies and interests that provide intrinsic satisfaction"
    ],
    practicalExercise: {
      title: "Connection vs. Cost Analysis",
      steps: [
        "List your current social activities and their costs",
        "Identify free or low-cost alternatives for connection",
        "Track loneliness levels and spending for one week",
        "Reach out to one person daily without spending money",
        "Create a 'loneliness action plan' with non-financial connection strategies"
      ]
    },
    completed: false
  },
  {
    id: "tired",
    letter: "T",
    title: "Tired",
    subtitle: "Decision Fatigue & Financial Choices",
    icon: <Bed className="h-6 w-6 text-purple-500" />,
    description: "Mental and physical exhaustion depletes our willpower and decision-making capacity. Tiredness leads to taking shortcuts, poor financial planning, and increased susceptibility to marketing.",
    keyPoints: [
      "Decision fatigue reduces willpower throughout the day",
      "Tired minds seek convenience regardless of cost",
      "Exhaustion impairs long-term thinking and planning",
      "Sleep deprivation affects impulse control",
      "Fatigue makes us more susceptible to marketing and sales tactics"
    ],
    financialTriggers: [
      "Convenience purchases when too tired to plan ahead",
      "Expensive delivery services instead of meal planning",
      "Impulse online shopping late at night",
      "Poor investment decisions due to mental fatigue",
      "Agreeing to financial commitments without proper consideration"
    ],
    preventionStrategies: [
      "Make important financial decisions when well-rested",
      "Automate routine financial tasks to reduce decision fatigue",
      "Plan purchases and financial activities for high-energy times",
      "Create evening routines that don't involve financial decisions",
      "Use the 'morning test' - revisit evening decisions the next day"
    ],
    practicalExercise: {
      title: "Energy-Based Financial Planning",
      steps: [
        "Track your energy levels throughout the day for one week",
        "Identify your peak decision-making hours",
        "Schedule important financial tasks during high-energy periods",
        "Create automated systems for routine financial decisions",
        "Develop a pre-bedtime routine that removes access to spending apps"
      ]
    },
    completed: false
  }
];

const HALTLessons = () => {
  const [activeLesson, setActiveLesson] = useState("hungry");
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const currentLesson = haltLessons.find(lesson => lesson.id === activeLesson)!;
  const completionPercentage = (completedLessons.size / haltLessons.length) * 100;

  const markAsCompleted = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

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
                {completedLessons.size} of {haltLessons.length} lessons
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* H.A.L.T. Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {haltLessons.map((lesson) => (
          <Card 
            key={lesson.id}
            className={`cursor-pointer transition-all ${
              activeLesson === lesson.id ? 'ring-2 ring-primary' : ''
            } ${completedLessons.has(lesson.id) ? 'bg-green-50 dark:bg-green-950' : ''}`}
            onClick={() => setActiveLesson(lesson.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {lesson.icon}
                {completedLessons.has(lesson.id) && (
                  <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                )}
              </div>
              <div className="text-2xl font-bold mb-1">{lesson.letter}</div>
              <div className="text-sm font-medium">{lesson.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {lesson.subtitle}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Lesson Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
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
            {completedLessons.has(currentLesson.id) && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="triggers">Triggers</TabsTrigger>
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
              <TabsTrigger value="exercise">Exercise</TabsTrigger>
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
            
            <TabsContent value="exercise" className="space-y-4">
              <h3 className="text-xl font-semibold">{currentLesson.practicalExercise.title}</h3>
              <p className="text-muted-foreground mb-4">
                Complete this practical exercise to reinforce your learning:
              </p>
              <ol className="space-y-3">
                {currentLesson.practicalExercise.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              
              <div className="pt-6 border-t">
                {!completedLessons.has(currentLesson.id) ? (
                  <Button 
                    onClick={() => markAsCompleted(currentLesson.id)}
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