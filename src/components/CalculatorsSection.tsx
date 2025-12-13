import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calculator, DollarSign, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import { useState } from "react";

const CalculatorsSection = () => {
  // Budget Calculator State
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState({
    housing: "",
    food: "",
    transportation: "",
    utilities: "",
    debt: "",
    personal: "",
    other: ""
  });

  // Emergency Fund Calculator State
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");

  const calculateBudget = () => {
    const totalIncome = parseFloat(income) || 0;
    const totalExpenses = Object.values(expenses).reduce((sum, expense) => sum + (parseFloat(expense) || 0), 0);
    const remaining = totalIncome - totalExpenses;
    
    return {
      totalIncome,
      totalExpenses,
      remaining,
      isOverspending: remaining < 0
    };
  };

  const calculateEmergencyFund = () => {
    const monthlyExp = parseFloat(monthlyExpenses) || 0;
    const currentSav = parseFloat(currentSavings) || 0;
    const targetFund = monthlyExp * 6; // 6 months of expenses
    const needed = Math.max(0, targetFund - currentSav);
    
    return {
      targetFund,
      currentSav,
      needed,
      monthsOfCoverage: currentSav / monthlyExp
    };
  };

  const budget = calculateBudget();
  const emergencyFund = calculateEmergencyFund();

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
            Plan your finances
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Financial Recovery Calculators
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Easy tools to build your Sober Money Mindset and take control
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Budget Calculator */}
          <Card className="shadow-medium">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 mx-auto">
                <Calculator className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Recovery Budget Calculator</CardTitle>
              <CardDescription>
                Get a clear snapshot of your financial situation and identify areas for improvement
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="income">Monthly Income</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="3000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="housing">Housing</Label>
                    <Input
                      id="housing"
                      type="number"
                      placeholder="1200"
                      value={expenses.housing}
                      onChange={(e) => setExpenses({...expenses, housing: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="food">Food</Label>
                    <Input
                      id="food"
                      type="number"
                      placeholder="400"
                      value={expenses.food}
                      onChange={(e) => setExpenses({...expenses, food: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="transportation">Transportation</Label>
                    <Input
                      id="transportation"
                      type="number"
                      placeholder="300"
                      value={expenses.transportation}
                      onChange={(e) => setExpenses({...expenses, transportation: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="utilities">Utilities</Label>
                    <Input
                      id="utilities"
                      type="number"
                      placeholder="150"
                      value={expenses.utilities}
                      onChange={(e) => setExpenses({...expenses, utilities: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="debt">Debt Payments</Label>
                    <Input
                      id="debt"
                      type="number"
                      placeholder="200"
                      value={expenses.debt}
                      onChange={(e) => setExpenses({...expenses, debt: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="other">Other Expenses</Label>
                    <Input
                      id="other"
                      type="number"
                      placeholder="200"
                      value={expenses.other}
                      onChange={(e) => setExpenses({...expenses, other: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {(income || Object.values(expenses).some(e => e)) && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Financial Snapshot</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Monthly Income:</span>
                        <span className="font-medium">${budget.totalIncome.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Expenses:</span>
                        <span className="font-medium">${budget.totalExpenses.toFixed(2)}</span>
                      </div>
                      <div className={`flex justify-between text-lg font-bold ${budget.isOverspending ? 'text-destructive' : 'text-primary'}`}>
                        <span>Remaining:</span>
                        <span>${budget.remaining.toFixed(2)}</span>
                      </div>
                    </div>

                    {budget.isOverspending && (
                      <div className="bg-destructive/10 p-4 rounded-lg">
                        <div className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-destructive mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-destructive">Overspending Alert</p>
                            <p className="text-sm text-muted-foreground">
                              Consider reducing expenses or increasing income. Focus on needs vs wants - a key principle in building your Sober Money Mindset.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {budget.remaining > 0 && (
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <div className="flex items-start">
                          <TrendingUp className="w-5 h-5 text-primary mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-primary">Great Progress!</p>
                            <p className="text-sm text-muted-foreground">
                              You have surplus to build emergency funds and invest in your recovery journey. Consider professional coaching to maximize this opportunity.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Emergency Fund Calculator */}
          <Card className="shadow-medium">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4 mx-auto">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Find Your Magic Number</CardTitle>
              <CardDescription>
                Calculate your Emergency Fund target - your Easy Button for financial security
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="monthlyExpenses">Monthly Essential Expenses</Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    placeholder="2500"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include housing, food, utilities, and other necessities
                  </p>
                </div>

                <div>
                  <Label htmlFor="currentSavings">Current Emergency Savings</Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    placeholder="1000"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                  />
                </div>
              </div>

              {(monthlyExpenses || currentSavings) && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Magic Number</h3>
                    <div className="text-center p-6 bg-accent/10 rounded-lg">
                      <DollarSign className="w-12 h-12 text-accent mx-auto mb-2" />
                      <p className="text-2xl font-bold text-accent">
                        ${emergencyFund.targetFund.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Your 6-month emergency fund target
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Current Savings:</span>
                        <span className="font-medium">${emergencyFund.currentSav.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Still Needed:</span>
                        <span className="font-medium text-accent">${emergencyFund.needed.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Coverage:</span>
                        <span className="font-medium">
                          {isFinite(emergencyFund.monthsOfCoverage) ? 
                            `${emergencyFund.monthsOfCoverage.toFixed(1)} months` : 
                            '0 months'
                          }
                        </span>
                      </div>
                    </div>

                    <div className="bg-accent/10 p-4 rounded-lg">
                      <h4 className="font-medium text-accent mb-2">Why This Matters in Recovery</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Reduces financial stress that can trigger relapse</li>
                        <li>• Builds confidence and long-term thinking</li>
                        <li>• Supports impulse control by providing security</li>
                        <li>• Creates a foundation for other recovery investments</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}

              <Button className="w-full" variant="outline">
                Learn More About Emergency Funds
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need help implementing these insights? Professional coaching can accelerate your progress.
          </p>
          <Button variant="hero" size="lg">
            Schedule a Consultation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CalculatorsSection;