import Navigation from "@/components/Navigation";
import CalculatorsSection from "@/components/CalculatorsSection";
import ResourceLibrary from "@/components/premium/ResourceLibrary";
import FinancialImpactSection from "@/components/FinancialImpactSection";
import OpportunityCostVisualizer from "@/components/OpportunityCostVisualizer";
import DebtManagementCalculator from "@/components/DebtManagementCalculator";
import PartnerResourceHub from "@/components/PartnerResourceHub";
import QuickDailyCheckIn from "@/components/QuickDailyCheckIn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Crown, Sparkles, TrendingUp, Receipt, Bell, Brain } from "lucide-react";

const Tools = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section for Tools */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Free Financial Recovery Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start your journey with powerful calculators and visualizers designed for people in recovery
            </p>
          </div>
        </section>

        {/* Opportunity Cost Visualizer - HERO TOOL */}
        <section className="container mx-auto px-4 py-12">
          <OpportunityCostVisualizer />
        </section>

        {/* Financial Impact Visualizations (Annual Drain + Power of Potential) */}
        <FinancialImpactSection />

        {/* Budget & Emergency Fund Calculators */}
        <CalculatorsSection />

        {/* Advanced Debt Management Calculator */}
        <section className="container mx-auto px-4 py-12">
          <DebtManagementCalculator />
        </section>

        {/* Partner Resource Hub */}
        <section className="container mx-auto px-4 py-12 bg-muted/30">
          <PartnerResourceHub />
        </section>

        {/* Premium Tools Teaser Section */}
        <section className="py-16 bg-gradient-to-br from-amber-50/50 to-primary/5 dark:from-amber-900/10 dark:to-primary/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 px-4 py-2 rounded-full mb-4">
                <Crown className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Premium Features</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Take Control with Premium Tools
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Unlock personalized tracking, alerts, and insights to accelerate your financial recovery
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
              {/* Daily Check-In Teaser */}
              <Card className="relative overflow-hidden border-amber-200/50 dark:border-amber-800/50">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full" />
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Daily Check-In</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track mood, energy, and spending impulses daily. Identify patterns and prevent financial stress.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Mood & sobriety tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Spending impulse alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Historical patterns & insights
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Expense Tracker Teaser */}
              <Card className="relative overflow-hidden border-amber-200/50 dark:border-amber-800/50">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full" />
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Receipt className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Expense Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Monitor spending by category with real-time alerts when approaching your budget limits.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Category-based tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Customizable spending limits
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Visual budget progress
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Bill Reminders Teaser */}
              <Card className="relative overflow-hidden border-amber-200/50 dark:border-amber-800/50">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full" />
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Bell className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Bill Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Never miss a payment. Automated reminders and payment tracking for all your bills.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Due date reminders
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Autopay tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Monthly overview
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link to="/pricing">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Start Your 14-Day Free Trial
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-3">
                Full access to all premium tools • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* Resource Library */}
        <div className="container mx-auto px-4 py-12">
          <ResourceLibrary />
        </div>
      </main>
    </div>
  );
};

export default Tools;