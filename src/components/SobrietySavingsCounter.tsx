import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Heart,
  Trophy,
  Target,
  Coins
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface SavingsData {
  recoveryStartDate: string;
  dailySpending: number;
}

const SobrietySavingsCounter = () => {
  const [savingsData, setSavingsData] = useState<SavingsData>(() => {
    const saved = localStorage.getItem('sobriety-savings-data');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      recoveryStartDate: '',
      dailySpending: 50
    };
  });
  
  const [isSetup, setIsSetup] = useState(!!savingsData.recoveryStartDate);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [tempData, setTempData] = useState({
    recoveryStartDate: '',
    dailySpending: 50
  });

  // Calculate days and savings
  const calculations = useMemo(() => {
    if (!savingsData.recoveryStartDate) {
      return { days: 0, totalSaved: 0, monthlyAvg: 0, yearlyProjection: 0 };
    }
    
    const startDate = new Date(savingsData.recoveryStartDate);
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const days = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const totalSaved = days * savingsData.dailySpending;
    const monthlyAvg = savingsData.dailySpending * 30;
    const yearlyProjection = savingsData.dailySpending * 365;
    
    return { days, totalSaved, monthlyAvg, yearlyProjection };
  }, [savingsData]);

  // Generate chart data for growth visualization
  const chartData = useMemo(() => {
    if (!savingsData.recoveryStartDate) return [];
    
    const startDate = new Date(savingsData.recoveryStartDate);
    const today = new Date();
    const data = [];
    
    // Generate monthly data points
    let currentDate = new Date(startDate);
    let cumulativeSavings = 0;
    
    while (currentDate <= today) {
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const remainingDays = Math.min(
        daysInMonth - currentDate.getDate() + 1,
        Math.ceil((today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
      );
      
      cumulativeSavings += remainingDays * savingsData.dailySpending;
      
      data.push({
        month: currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        savings: Math.round(cumulativeSavings),
        invested: Math.round(cumulativeSavings * 1.07) // 7% growth projection
      });
      
      // Move to next month
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    }
    
    return data.slice(-12); // Last 12 months
  }, [savingsData]);

  // Animate the counter
  useEffect(() => {
    if (calculations.totalSaved === 0) {
      setAnimatedTotal(0);
      return;
    }
    
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = calculations.totalSaved / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= calculations.totalSaved) {
        setAnimatedTotal(calculations.totalSaved);
        clearInterval(timer);
      } else {
        setAnimatedTotal(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [calculations.totalSaved]);

  const handleSaveSetup = () => {
    if (!tempData.recoveryStartDate || tempData.dailySpending <= 0) return;
    
    const newData = {
      recoveryStartDate: tempData.recoveryStartDate,
      dailySpending: tempData.dailySpending
    };
    
    setSavingsData(newData);
    localStorage.setItem('sobriety-savings-data', JSON.stringify(newData));
    setIsSetup(true);
  };

  const handleReset = () => {
    setIsSetup(false);
    setTempData({
      recoveryStartDate: savingsData.recoveryStartDate || '',
      dailySpending: savingsData.dailySpending || 50
    });
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  const getMilestone = (days: number) => {
    if (days >= 365) return { label: `${Math.floor(days / 365)} Year${days >= 730 ? 's' : ''}!`, color: 'bg-amber-500' };
    if (days >= 180) return { label: '6 Months!', color: 'bg-purple-500' };
    if (days >= 90) return { label: '90 Days!', color: 'bg-blue-500' };
    if (days >= 30) return { label: '30 Days!', color: 'bg-green-500' };
    if (days >= 7) return { label: '1 Week!', color: 'bg-teal-500' };
    return { label: 'Just Starting!', color: 'bg-primary' };
  };

  const milestone = getMilestone(calculations.days);

  // Setup Screen
  if (!isSetup) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-card via-primary/5 to-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Recovery Savings Calculator
          </CardTitle>
          <CardDescription>
            See how much you've saved by choosing recovery. Every day counts!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Recovery Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={tempData.recoveryStartDate}
                onChange={(e) => setTempData({ ...tempData, recoveryStartDate: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                The day you began your recovery journey
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dailySpending" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Previous Daily Spending
              </Label>
              <Input
                id="dailySpending"
                type="number"
                min="1"
                value={tempData.dailySpending}
                onChange={(e) => setTempData({ ...tempData, dailySpending: parseFloat(e.target.value) || 0 })}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Estimated daily cost of addiction (substances, related expenses)
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">💡 Common Daily Estimates:</h4>
            <div className="flex flex-wrap gap-2">
              {[25, 50, 75, 100, 150, 200].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setTempData({ ...tempData, dailySpending: amount })}
                  className={tempData.dailySpending === amount ? 'border-primary bg-primary/10' : ''}
                >
                  ${amount}/day
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={handleSaveSetup} className="w-full gap-2" size="lg">
            <Heart className="h-5 w-5" />
            Calculate My Savings
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Main Display
  return (
    <div className="space-y-6">
      {/* Hero Counter Card */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-green-500/10 overflow-hidden">
        <CardContent className="p-8 text-center relative">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4">
            <Badge className={`${milestone.color} text-white`}>
              <Trophy className="h-3 w-3 mr-1" />
              {milestone.label}
            </Badge>
          </div>
          
          <div className="mb-4">
            <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
          </div>
          
          <h2 className="text-lg text-muted-foreground mb-2">
            You've Saved
          </h2>
          
          <div className="relative">
            <p className="text-6xl md:text-7xl font-bold text-primary mb-2 tabular-nums">
              {formatCurrency(animatedTotal)}
            </p>
            <p className="text-sm text-muted-foreground">
              in <span className="font-bold text-foreground">{calculations.days}</span> days of recovery
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
              Edit Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200">
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold">{calculations.days}</p>
            <p className="text-xs text-muted-foreground">Days Sober</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200">
          <CardContent className="p-4 text-center">
            <Coins className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold">{formatCurrency(calculations.monthlyAvg)}</p>
            <p className="text-xs text-muted-foreground">Monthly Savings</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-200">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold">{formatCurrency(calculations.yearlyProjection)}</p>
            <p className="text-xs text-muted-foreground">Yearly Projection</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto text-amber-600 mb-2" />
            <p className="text-2xl font-bold">{formatCurrency(calculations.yearlyProjection * 1.07)}</p>
            <p className="text-xs text-muted-foreground">If Invested (7%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart */}
      {chartData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your Savings Growth
            </CardTitle>
            <CardDescription>
              Watch your financial freedom grow over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name === 'savings' ? 'Total Saved' : 'If Invested'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="invested" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#investedGradient)" 
                  name="invested"
                />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#savingsGradient)" 
                  name="savings"
                />
              </AreaChart>
            </ResponsiveContainer>
            
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Total Saved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">If Invested (7% growth)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-primary/5 to-green-500/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <Heart className="h-8 w-8 mx-auto text-primary mb-3" />
          <p className="text-lg font-medium mb-2">
            Every day you choose recovery is a gift to yourself.
          </p>
          <p className="text-muted-foreground text-sm">
            {calculations.totalSaved > 1000 
              ? `You've already saved ${formatCurrency(calculations.totalSaved)} - that's real progress toward your financial goals!`
              : "Keep going! Your savings will grow with each passing day."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SobrietySavingsCounter;
