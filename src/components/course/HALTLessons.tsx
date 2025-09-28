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
    completed: false
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
    completed: false
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
    completed: false
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