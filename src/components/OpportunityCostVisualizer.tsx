import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calculator, TrendingUp, Shield, AlertTriangle, Home, GraduationCap, Baby } from 'lucide-react';

interface OpportunityCostResult {
  totalSpent: number;
  conservativeTotal: number;
  conservativeGrowth: number;
  aggressiveTotal: number;
  aggressiveGrowth: number;
  yearlyContribution: number;
}

const OpportunityCostVisualizer = () => {
  const [spendingAmount, setSpendingAmount] = useState<string>('50');
  const [frequency, setFrequency] = useState<string>('weekly');
  const [timeHorizon, setTimeHorizon] = useState<string>('10');
  const [showResults, setShowResults] = useState(false);

  const frequencyMultipliers = {
    daily: 365,
    weekly: 52,
    monthly: 12,
    yearly: 1
  };

  const results: OpportunityCostResult = useMemo(() => {
    const amount = parseFloat(spendingAmount) || 0;
    const years = parseInt(timeHorizon) || 0;
    const multiplier = frequencyMultipliers[frequency as keyof typeof frequencyMultipliers];
    const yearlyContribution = amount * multiplier;
    
    // Conservative investment (6% annual return)
    const conservativeRate = 0.06;
    const conservativeTotal = yearlyContribution * (((1 + conservativeRate) ** years - 1) / conservativeRate);
    const conservativeGrowth = conservativeTotal - (yearlyContribution * years);
    
    // Aggressive investment (10% annual return - S&P 500 historical average)
    const aggressiveRate = 0.10;
    const aggressiveTotal = yearlyContribution * (((1 + aggressiveRate) ** years - 1) / aggressiveRate);
    const aggressiveGrowth = aggressiveTotal - (yearlyContribution * years);
    
    return {
      totalSpent: yearlyContribution * years,
      conservativeTotal,
      conservativeGrowth,
      aggressiveTotal,
      aggressiveGrowth,
      yearlyContribution
    };
  }, [spendingAmount, frequency, timeHorizon]);

  const chartData = [
    {
      name: 'Addiction Spending',
      'Final Value': 0,
      'Money Spent': results.totalSpent,
      'Growth': 0
    },
    {
      name: 'Conservative Investment',
      'Final Value': results.conservativeTotal,
      'Money Spent': results.totalSpent,
      'Growth': results.conservativeGrowth
    },
    {
      name: 'Aggressive Investment',
      'Final Value': results.aggressiveTotal,
      'Money Spent': results.totalSpent,
      'Growth': results.aggressiveGrowth
    }
  ];

  const pieData = [
    { name: 'Your Contributions', value: results.totalSpent, color: '#3b82f6' },
    { name: 'Investment Growth', value: results.aggressiveGrowth, color: '#10b981' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGoalComparisons = (amount: number) => {
    const goals = [
      { name: "4 Years College Tuition", amount: 80000, icon: GraduationCap },
      { name: "House Down Payment (20%)", amount: 60000, icon: Home },
      { name: "Child's Education Fund", amount: 100000, icon: Baby },
    ];

    return goals.filter(goal => amount >= goal.amount);
  };

  const calculate = () => {
    setShowResults(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="h-6 w-6" />
            Opportunity Cost Visualizer: Your Money's True Potential
          </CardTitle>
          <p className="text-muted-foreground">
            See the real cost of addiction spending by visualizing what that same money could become through investing.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spending-amount">How much do you spend?</Label>
              <Input
                id="spending-amount"
                type="number"
                value={spendingAmount}
                onChange={(e) => setSpendingAmount(e.target.value)}
                placeholder="50"
              />
            </div>
            <div className="space-y-2">
              <Label>How often?</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-horizon">Time period (years)</Label>
              <Input
                id="time-horizon"
                type="number"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(e.target.value)}
                placeholder="10"
              />
            </div>
          </div>
          
          <Button onClick={calculate} className="w-full" size="lg">
            Calculate My Opportunity Cost
          </Button>
        </CardContent>
      </Card>

      {showResults && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-destructive/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Addiction Spending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">$0</div>
                <p className="text-sm text-muted-foreground">
                  Money spent: {formatCurrency(results.totalSpent)}
                </p>
                <p className="text-sm font-medium text-destructive">
                  Final value: Nothing left
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-orange-600">
                  <Shield className="h-5 w-5" />
                  Conservative Investment (6%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {formatCurrency(results.conservativeTotal)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Your contributions: {formatCurrency(results.totalSpent)}
                </p>
                <p className="text-sm font-medium text-orange-600">
                  Investment growth: {formatCurrency(results.conservativeGrowth)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-primary">
                  <TrendingUp className="h-5 w-5" />
                  Aggressive Investment (10%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(results.aggressiveTotal)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Your contributions: {formatCurrency(results.totalSpent)}
                </p>
                <p className="text-sm font-medium text-primary">
                  Investment growth: {formatCurrency(results.aggressiveGrowth)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="comparison" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="comparison">Scenario Comparison</TabsTrigger>
                  <TabsTrigger value="breakdown">Growth Breakdown</TabsTrigger>
                </TabsList>
                
                <TabsContent value="comparison" className="space-y-4">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="Final Value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="breakdown" className="space-y-4">
                  {results.aggressiveGrowth > 0 && (
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Goal Comparisons */}
          {getGoalComparisons(results.aggressiveTotal).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>What This Money Could Buy</CardTitle>
                <p className="text-muted-foreground">
                  With {formatCurrency(results.aggressiveTotal)} from aggressive investing, you could afford:
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getGoalComparisons(results.aggressiveTotal).map((goal) => (
                    <div key={goal.name} className="flex items-center gap-3 p-4 border rounded-lg">
                      <goal.icon className="h-8 w-8 text-primary" />
                      <div>
                        <div className="font-medium">{goal.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(goal.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">The Power of Compound Interest</h4>
                <p className="text-sm text-muted-foreground">
                  Over {timeHorizon} years, your {formatCurrency(results.totalSpent)} in contributions 
                  could grow to {formatCurrency(results.aggressiveTotal)} through the magic of compounding. 
                  That's {formatCurrency(results.aggressiveGrowth)} in free money from investment returns!
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Rule of 72</h4>
                <p className="text-sm text-muted-foreground">
                  At 10% annual returns, your money doubles every 7.2 years (72 ÷ 10 = 7.2). 
                  Even at conservative 6% returns, it doubles every 12 years.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Time is Your Greatest Asset</h4>
                <p className="text-sm text-muted-foreground">
                  Starting early makes an enormous difference. The earlier you start investing instead of spending, 
                  the more time compound interest has to work its magic.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default OpportunityCostVisualizer;