import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle, CreditCard, GitBranch, Clock } from "lucide-react";

const RecoveryTools = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <Navigation />
      <main className="pt-20">
        <div className="container py-12 md:py-16 space-y-16">
          {/* Page Header */}
          <section className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Recovery‑Focused Tools
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground italic font-medium">
              "Knowing the facts is the first step to freedom, not failure."
            </p>
          </section>

          {/* Section 1: The Honesty Inventory Sheet - Purple Theme */}
          <section className="space-y-6">
            <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-50 via-purple-50/50 to-background dark:from-purple-950/30 dark:via-purple-900/20 dark:to-background shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="space-y-6 pb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0 p-4 rounded-2xl bg-purple-100 dark:bg-purple-900/50 shadow-lg">
                    <FileText className="w-16 h-16 md:w-20 md:h-20 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent">
                      The Honesty Inventory Sheet
                    </CardTitle>
                    <CardDescription className="text-base md:text-lg">
                      A comprehensive worksheet to document your financial reality with clarity and compassion
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 pt-0">
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    This tool helps you create a complete and honest financial picture. List all debts, assets, income sources, 
                    and relationship-based obligations. The worksheet includes a special "Amends Priority" section to help you 
                    identify and address financial obligations to friends and family—an essential step in recovery.
                  </p>
                </div>
                
                {/* Placeholder Areas */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-950/20 p-8 md:p-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-purple-900 dark:text-purple-100">PDF Worksheet</p>
                      <p className="text-sm text-muted-foreground">Downloadable inventory template</p>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-950/20 p-8 md:p-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-purple-900 dark:text-purple-100">Interactive Tool</p>
                      <p className="text-sm text-muted-foreground">Visual debt vs assets tracker</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 2: The Financial HALT Button/Flow - Blue Theme */}
          <section className="space-y-6">
            <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-50 via-blue-50/50 to-background dark:from-blue-950/30 dark:via-blue-900/20 dark:to-background shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="space-y-6 pb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0 p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/50 shadow-lg">
                    <AlertTriangle className="w-16 h-16 md:w-20 md:h-20 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                      The Financial HALT Button/Flow
                    </CardTitle>
                    <CardDescription className="text-base md:text-lg">
                      Crisis intervention tool for moments of financial stress and emotional triggers
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 pt-0">
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-blue-600 dark:text-blue-400">"Financial stress is temporary, but relapse is permanent."</strong>
                    {' '}When you're feeling Hungry, Angry, Lonely, or Tired, financial decisions can become dangerous. 
                    This tool provides immediate crisis support with guided mindfulness exercises, accountability prompts, 
                    and a printable wallet card to keep with you at all times.
                  </p>
                </div>
                
                {/* Placeholder Areas */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20 p-8 md:p-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-blue-900 dark:text-blue-100">Crisis Mode Button</p>
                      <p className="text-sm text-muted-foreground">Guided mindfulness & accountability</p>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20 p-8 md:p-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-blue-900 dark:text-blue-100">Printable Wallet Card</p>
                      <p className="text-sm text-muted-foreground">Crisis response methodology</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 3: The Decision Flowchart - Dark Accent Theme */}
          <section className="space-y-6">
            <Card className="border-2 border-slate-500/20 bg-gradient-to-br from-slate-50 via-slate-50/50 to-background dark:from-slate-950/50 dark:via-slate-900/30 dark:to-background shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="space-y-6 pb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 shadow-lg">
                    <GitBranch className="w-16 h-16 md:w-20 md:h-20 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-500 dark:from-slate-300 dark:to-slate-400 bg-clip-text text-transparent">
                      The Decision Flowchart
                    </CardTitle>
                    <CardDescription className="text-base md:text-lg">
                      Structured decision-making tool with delayed gratification support
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 pt-0">
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-slate-700 dark:text-slate-300">"The goal isn't deprivation, but Freedom of Choice over the urge."</strong>
                    {' '}Delayed gratification isn't about saying "no" forever—it's about choosing when and how you say "yes." 
                    This flowchart guides you through spending decisions with thoughtful questions about needs vs. wants, 
                    affordability, and long-term impact. The 48-Hour Pause Timer helps you build the muscle of intentional choice.
                  </p>
                </div>
                
                {/* Placeholder Areas */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/20 p-8 md:p-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <GitBranch className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Printable Flowchart</p>
                      <p className="text-sm text-muted-foreground">Decision-making guidance PDF</p>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/20 p-8 md:p-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <Clock className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">48-Hour Pause Timer</p>
                      <p className="text-sm text-muted-foreground">Delayed gratification tool</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Closing Message */}
          <section className="rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 dark:from-primary/20 dark:via-accent/20 dark:to-primary/20 p-10 md:p-16 space-y-6 border border-primary/20">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Recovery Journey Matters
            </h3>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              These tools are designed to support you at every stage of your financial recovery journey. 
              Whether you're taking your first honest inventory, managing a crisis moment, or making thoughtful 
              decisions about spending, we're here to help you build lasting freedom and peace of mind.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RecoveryTools;
