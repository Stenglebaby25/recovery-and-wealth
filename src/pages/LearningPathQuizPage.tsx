import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LearningPathQuiz from "@/components/course/LearningPathQuiz";
import { Sparkles, Target, BookOpen, TrendingUp } from "lucide-react";

const LearningPathQuizPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Personalized Learning</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-progress bg-clip-text text-transparent">
              Find Your Financial Recovery Path
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Answer 7 quick questions about your situation, and we'll create a personalized 
              curriculum tailored to your recovery journey and financial goals.
            </p>
            
            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4 text-primary" />
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>13+ expert modules</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Priority-based learning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <LearningPathQuiz />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LearningPathQuizPage;
