import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  ArrowRight, ArrowLeft, Sparkles, Target, BookOpen, 
  AlertTriangle, TrendingUp, Shield, Heart, DollarSign,
  Users, Briefcase, CreditCard, Home, CheckCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface QuizQuestion {
  id: string;
  question: string;
  category: "sobriety" | "debt" | "credit" | "employment" | "housing" | "goals" | "knowledge";
  options: {
    label: string;
    value: string;
    points: Record<string, number>; // Module ID -> points
  }[];
}

interface RecommendedModule {
  id: string;
  title: string;
  subtitle: string;
  weekNumber: number;
  icon: React.ReactNode;
  priority: "essential" | "recommended" | "optional";
  reason: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "sobriety_time",
    question: "How long have you been in recovery?",
    category: "sobriety",
    options: [
      { 
        label: "Less than 6 months", 
        value: "early",
        points: {
          "halt-lessons": 10, "insurance-essentials": 8, "emergency-fund-building": 10,
          "credit-repair-recovery": 3, "entrepreneurship-basics": 1
        }
      },
      { 
        label: "6 months to 1 year", 
        value: "mid-early",
        points: {
          "halt-lessons": 8, "insurance-essentials": 9, "emergency-fund-building": 9,
          "credit-repair-recovery": 6, "investment-fundamentals": 4
        }
      },
      { 
        label: "1-2 years", 
        value: "established",
        points: {
          "halt-lessons": 6, "credit-repair-recovery": 8, "investment-fundamentals": 7,
          "housing-roadmap": 8, "side-income-gig-economy": 7
        }
      },
      { 
        label: "2+ years", 
        value: "long-term",
        points: {
          "investment-fundamentals": 9, "entrepreneurship-basics": 8, "housing-roadmap": 9,
          "family-financial-repair": 7, "retirement-planning": 8
        }
      }
    ]
  },
  {
    id: "debt_situation",
    question: "What's your current debt situation?",
    category: "debt",
    options: [
      { 
        label: "Significant debt (collections, loans, credit cards)", 
        value: "significant",
        points: {
          "debt-negotiation-strategies": 10, "credit-repair-recovery": 9,
          "bankruptcy-fresh-start": 8, "legal-financial-issues": 8
        }
      },
      { 
        label: "Some debt but manageable", 
        value: "moderate",
        points: {
          "debt-negotiation-strategies": 7, "credit-repair-recovery": 7,
          "emergency-fund-building": 8, "tax-basics-recovery": 6
        }
      },
      { 
        label: "Little to no debt", 
        value: "minimal",
        points: {
          "investment-fundamentals": 8, "emergency-fund-building": 9,
          "housing-roadmap": 7, "retirement-planning": 6
        }
      },
      { 
        label: "I'm not sure", 
        value: "unknown",
        points: {
          "debt-negotiation-strategies": 6, "credit-repair-recovery": 6,
          "halt-lessons": 5, "insurance-essentials": 5
        }
      }
    ]
  },
  {
    id: "credit_status",
    question: "How would you describe your credit score?",
    category: "credit",
    options: [
      { 
        label: "Poor or no credit history", 
        value: "poor",
        points: {
          "credit-repair-recovery": 10, "debt-negotiation-strategies": 7,
          "housing-roadmap": 5, "legal-financial-issues": 5
        }
      },
      { 
        label: "Fair (500-650)", 
        value: "fair",
        points: {
          "credit-repair-recovery": 8, "debt-negotiation-strategies": 6,
          "housing-roadmap": 6, "investment-fundamentals": 4
        }
      },
      { 
        label: "Good (650-750)", 
        value: "good",
        points: {
          "investment-fundamentals": 7, "housing-roadmap": 8,
          "entrepreneurship-basics": 5, "retirement-planning": 6
        }
      },
      { 
        label: "Excellent (750+)", 
        value: "excellent",
        points: {
          "investment-fundamentals": 9, "housing-roadmap": 9,
          "entrepreneurship-basics": 7, "retirement-planning": 8
        }
      }
    ]
  },
  {
    id: "employment_status",
    question: "What's your current employment situation?",
    category: "employment",
    options: [
      { 
        label: "Unemployed or looking for work", 
        value: "unemployed",
        points: {
          "resume-interview-mastery": 10, "side-income-gig-economy": 9,
          "halt-lessons": 7, "emergency-fund-building": 6
        }
      },
      { 
        label: "Part-time or unstable work", 
        value: "part-time",
        points: {
          "resume-interview-mastery": 8, "side-income-gig-economy": 9,
          "emergency-fund-building": 7, "insurance-essentials": 6
        }
      },
      { 
        label: "Full-time employed", 
        value: "full-time",
        points: {
          "investment-fundamentals": 7, "tax-basics-recovery": 8,
          "insurance-essentials": 8, "retirement-planning": 7
        }
      },
      { 
        label: "Self-employed or entrepreneur", 
        value: "self-employed",
        points: {
          "entrepreneurship-basics": 9, "tax-basics-recovery": 10,
          "insurance-essentials": 8, "side-income-gig-economy": 5
        }
      }
    ]
  },
  {
    id: "housing_status",
    question: "What's your current housing situation?",
    category: "housing",
    options: [
      { 
        label: "Sober living or transitional housing", 
        value: "sober-living",
        points: {
          "housing-roadmap": 10, "credit-repair-recovery": 7,
          "emergency-fund-building": 8, "halt-lessons": 6
        }
      },
      { 
        label: "Renting", 
        value: "renting",
        points: {
          "housing-roadmap": 7, "investment-fundamentals": 6,
          "insurance-essentials": 7, "emergency-fund-building": 7
        }
      },
      { 
        label: "Living with family", 
        value: "family",
        points: {
          "family-financial-repair": 9, "housing-roadmap": 8,
          "credit-repair-recovery": 6, "emergency-fund-building": 7
        }
      },
      { 
        label: "Homeowner or stable long-term housing", 
        value: "stable",
        points: {
          "investment-fundamentals": 8, "entrepreneurship-basics": 6,
          "retirement-planning": 7, "tax-basics-recovery": 6
        }
      }
    ]
  },
  {
    id: "financial_goals",
    question: "What's your TOP financial priority right now?",
    category: "goals",
    options: [
      { 
        label: "Getting out of debt and stabilizing", 
        value: "stability",
        points: {
          "debt-negotiation-strategies": 10, "emergency-fund-building": 9,
          "halt-lessons": 7, "credit-repair-recovery": 8
        }
      },
      { 
        label: "Building credit and saving for housing", 
        value: "building",
        points: {
          "credit-repair-recovery": 9, "housing-roadmap": 10,
          "investment-fundamentals": 6, "insurance-essentials": 6
        }
      },
      { 
        label: "Investing and growing wealth", 
        value: "growth",
        points: {
          "investment-fundamentals": 10, "retirement-planning": 9,
          "entrepreneurship-basics": 7, "tax-basics-recovery": 7
        }
      },
      { 
        label: "Repairing relationships and making amends", 
        value: "relationships",
        points: {
          "family-financial-repair": 10, "halt-lessons": 7,
          "debt-negotiation-strategies": 6, "credit-repair-recovery": 5
        }
      }
    ]
  },
  {
    id: "knowledge_level",
    question: "How would you rate your current financial knowledge?",
    category: "knowledge",
    options: [
      { 
        label: "Beginner - I'm just learning the basics", 
        value: "beginner",
        points: {
          "halt-lessons": 10, "emergency-fund-building": 9,
          "insurance-essentials": 8, "tax-basics-recovery": 6
        }
      },
      { 
        label: "Intermediate - I know some concepts", 
        value: "intermediate",
        points: {
          "investment-fundamentals": 7, "credit-repair-recovery": 7,
          "debt-negotiation-strategies": 7, "housing-roadmap": 7
        }
      },
      { 
        label: "Advanced - Ready for complex topics", 
        value: "advanced",
        points: {
          "investment-fundamentals": 9, "entrepreneurship-basics": 9,
          "retirement-planning": 8, "tax-basics-recovery": 8
        }
      },
      { 
        label: "Focused - I need help in specific areas", 
        value: "focused",
        points: {
          "halt-lessons": 5, "credit-repair-recovery": 5,
          "investment-fundamentals": 5, "debt-negotiation-strategies": 5
        }
      }
    ]
  }
];

// Module metadata for recommendations
const moduleMetadata: Record<string, { title: string; subtitle: string; weekNumber: number; icon: React.ReactNode }> = {
  "halt-lessons": { 
    title: "H.A.L.T. Recovery Lessons", 
    subtitle: "Managing Emotional Triggers",
    weekNumber: 0,
    icon: <Heart className="h-5 w-5 text-red-500" />
  },
  "insurance-essentials": { 
    title: "Insurance Essentials", 
    subtitle: "Protecting Your Recovery",
    weekNumber: 9,
    icon: <Shield className="h-5 w-5 text-blue-500" />
  },
  "tax-basics-recovery": { 
    title: "Tax Basics & Recovery Deductions", 
    subtitle: "Claiming What You're Owed",
    weekNumber: 10,
    icon: <DollarSign className="h-5 w-5 text-green-600" />
  },
  "investment-fundamentals": { 
    title: "Investment Fundamentals", 
    subtitle: "Building Wealth Through Compound Interest",
    weekNumber: 11,
    icon: <TrendingUp className="h-5 w-5 text-emerald-500" />
  },
  "credit-repair-recovery": { 
    title: "Credit Repair in Recovery", 
    subtitle: "Rebuilding Your Score",
    weekNumber: 12,
    icon: <CreditCard className="h-5 w-5 text-purple-500" />
  },
  "debt-negotiation-strategies": { 
    title: "Debt Negotiation Strategies", 
    subtitle: "Settling Debts for Less",
    weekNumber: 13,
    icon: <Target className="h-5 w-5 text-orange-500" />
  },
  "bankruptcy-fresh-start": { 
    title: "Bankruptcy: A Fresh Start", 
    subtitle: "When Filing Makes Sense",
    weekNumber: 14,
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
  },
  "legal-financial-issues": { 
    title: "Legal & Financial Issues", 
    subtitle: "Handling Court Costs and Fines",
    weekNumber: 15,
    icon: <BookOpen className="h-5 w-5 text-slate-600" />
  },
  "emergency-fund-building": { 
    title: "Emergency Fund Building", 
    subtitle: "Creating Your Financial Safety Net",
    weekNumber: 16,
    icon: <Shield className="h-5 w-5 text-teal-500" />
  },
  "housing-roadmap": { 
    title: "Housing Roadmap", 
    subtitle: "From Sober Living to Homeownership",
    weekNumber: 17,
    icon: <Home className="h-5 w-5 text-amber-600" />
  },
  "resume-interview-mastery": { 
    title: "Resume & Interview Mastery", 
    subtitle: "Landing Jobs with Gaps",
    weekNumber: 18,
    icon: <Briefcase className="h-5 w-5 text-indigo-500" />
  },
  "side-income-gig-economy": { 
    title: "Side Income & Gig Economy", 
    subtitle: "Recovery-Safe Extra Income",
    weekNumber: 19,
    icon: <TrendingUp className="h-5 w-5 text-green-500" />
  },
  "family-financial-repair": { 
    title: "Family Financial Repair", 
    subtitle: "Making Financial Amends",
    weekNumber: 20,
    icon: <Users className="h-5 w-5 text-pink-500" />
  },
  "entrepreneurship-basics": { 
    title: "Entrepreneurship Basics", 
    subtitle: "Starting a Business in Recovery",
    weekNumber: 21,
    icon: <Sparkles className="h-5 w-5 text-yellow-500" />
  },
  "retirement-planning": { 
    title: "Retirement Planning", 
    subtitle: "Building Long-Term Security",
    weekNumber: 22,
    icon: <TrendingUp className="h-5 w-5 text-blue-600" />
  }
};

const LearningPathQuiz = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedModule[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [quizQuestions[currentQuestion].id]: value
    }));
  };

  const calculateRecommendations = () => {
    const moduleScores: Record<string, number> = {};

    // Calculate scores from all answers
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const question = quizQuestions.find(q => q.id === questionId);
      if (question) {
        const option = question.options.find(o => o.value === answerValue);
        if (option) {
          Object.entries(option.points).forEach(([moduleId, points]) => {
            moduleScores[moduleId] = (moduleScores[moduleId] || 0) + points;
          });
        }
      }
    });

    // Sort modules by score and assign priorities
    const sortedModules = Object.entries(moduleScores)
      .sort(([, a], [, b]) => b - a)
      .map(([moduleId, score], index) => {
        const metadata = moduleMetadata[moduleId];
        if (!metadata) return null;

        let priority: "essential" | "recommended" | "optional";
        let reason: string;

        if (index < 3) {
          priority = "essential";
          reason = "Highly aligned with your current situation and goals";
        } else if (index < 7) {
          priority = "recommended";
          reason = "Will help you build on your foundation";
        } else {
          priority = "optional";
          reason = "Consider after completing higher priority modules";
        }

        return {
          id: moduleId,
          title: metadata.title,
          subtitle: metadata.subtitle,
          weekNumber: metadata.weekNumber,
          icon: metadata.icon,
          priority,
          reason,
          score
        } as RecommendedModule & { score: number };
      })
      .filter(Boolean) as (RecommendedModule & { score: number })[];

    setRecommendations(sortedModules);
    setShowResults(true);

    // Save results to database if user is logged in
    if (user) {
      saveQuizResults(sortedModules);
    }
  };

  const saveQuizResults = async (recs: RecommendedModule[]) => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from("user_learning_paths").upsert({
        user_id: user?.id,
        quiz_answers: answers,
        recommended_modules: recs.map(r => ({
          id: r.id,
          priority: r.priority,
          reason: r.reason
        })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Learning path saved!",
        description: "Your personalized recommendations have been saved to your profile."
      });
    } catch (error) {
      console.error("Error saving quiz results:", error);
      // Don't show error toast - the quiz still works without saving
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateRecommendations();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setRecommendations([]);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const currentQ = quizQuestions[currentQuestion];
  const hasCurrentAnswer = answers[currentQ?.id];

  if (showResults) {
    const essential = recommendations.filter(r => r.priority === "essential");
    const recommended = recommendations.filter(r => r.priority === "recommended");
    const optional = recommendations.filter(r => r.priority === "optional");

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Results Header */}
        <Card className="border-0 shadow-soft bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl">Your Personalized Learning Path</CardTitle>
            <CardDescription className="text-base">
              Based on your answers, we've created a customized curriculum to support your financial recovery journey.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Essential Modules */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-700 border-red-200">Start Here</Badge>
            <h3 className="text-lg font-semibold">Essential Modules ({essential.length})</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {essential.map((module) => (
              <Card key={module.id} className="border-red-200 bg-red-50/50 hover:shadow-medium transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-background">
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{module.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{module.subtitle}</p>
                      <p className="text-xs text-red-600 mt-2">{module.reason}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended Modules */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">Next Steps</Badge>
            <h3 className="text-lg font-semibold">Recommended Modules ({recommended.length})</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommended.map((module) => (
              <Card key={module.id} className="border-amber-200 bg-amber-50/30 hover:shadow-medium transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-background">
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{module.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{module.subtitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Optional Modules */}
        {optional.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Later</Badge>
              <h3 className="text-lg font-semibold">Optional Modules ({optional.length})</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {optional.map((module) => (
                <Card key={module.id} className="bg-muted/30 hover:shadow-soft transition-shadow">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-2">
                      {module.icon}
                      <span className="text-sm font-medium">{module.title}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button variant="outline" onClick={restartQuiz}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
          <Link to="/halt-lessons">
            <Button>
              Start Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {!user && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Create a free account to save your personalized learning path and track your progress.
              </p>
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Sign Up Free
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Progress Header */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className="border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl leading-relaxed">
            {currentQ.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={answers[currentQ.id] || ""}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQ.options.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer hover:bg-muted/50 ${
                  answers[currentQ.id] === option.value
                    ? "border-primary bg-primary/5"
                    : "border-muted"
                }`}
                onClick={() => handleAnswer(option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer font-normal">
                  {option.label}
                </Label>
                {answers[currentQ.id] === option.value && (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </div>
            ))}
          </RadioGroup>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!hasCurrentAnswer}
            >
              {currentQuestion === quizQuestions.length - 1 ? (
                <>
                  See My Path
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Indicator */}
      <div className="text-center text-sm text-muted-foreground">
        <Badge variant="secondary" className="capitalize">
          {currentQ.category.replace("-", " ")}
        </Badge>
      </div>
    </div>
  );
};

export default LearningPathQuiz;
