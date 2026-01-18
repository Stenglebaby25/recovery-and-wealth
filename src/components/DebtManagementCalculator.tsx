import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  TrendingDown, 
  Snowflake, 
  Flame, 
  Plus, 
  Trash2,
  DollarSign,
  Calendar,
  PiggyBank,
  Scale,
  AlertTriangle,
  LineChart as LineChartIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';

interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  isRecoveryRelated?: boolean;
}

interface PayoffResult {
  debt: Debt;
  payoffOrder: number;
  monthsToPayoff: number;
  totalInterestPaid: number;
  payoffDate: Date;
}

const DebtManagementCalculator = () => {
  const { toast } = useToast();
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card 1', balance: 5000, interestRate: 19.99, minimumPayment: 150, isRecoveryRelated: false },
    { id: '2', name: 'Medical Bills', balance: 3000, interestRate: 0, minimumPayment: 100, isRecoveryRelated: true },
  ]);
  const [extraPayment, setExtraPayment] = useState(200);
  const [newDebt, setNewDebt] = useState<Partial<Debt>>({
    name: '',
    balance: 0,
    interestRate: 0,
    minimumPayment: 0,
    isRecoveryRelated: false
  });

  const addDebt = () => {
    if (!newDebt.name || !newDebt.balance || !newDebt.minimumPayment) {
      toast({
        title: "Missing Information",
        description: "Please fill in all debt details",
        variant: "destructive"
      });
      return;
    }
    
    setDebts([...debts, {
      id: Date.now().toString(),
      name: newDebt.name || '',
      balance: newDebt.balance || 0,
      interestRate: newDebt.interestRate || 0,
      minimumPayment: newDebt.minimumPayment || 0,
      isRecoveryRelated: newDebt.isRecoveryRelated || false
    }]);
    
    setNewDebt({ name: '', balance: 0, interestRate: 0, minimumPayment: 0, isRecoveryRelated: false });
    toast({ title: "Debt Added", description: `${newDebt.name} has been added to your debt list` });
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const calculatePayoff = (sortedDebts: Debt[], extraMonthly: number): PayoffResult[] => {
    const results: PayoffResult[] = [];
    let remainingDebts = sortedDebts.map(d => ({ ...d, currentBalance: d.balance }));
    let availableExtra = extraMonthly;
    let month = 0;
    const maxMonths = 600; // 50 years max

    while (remainingDebts.some(d => d.currentBalance > 0) && month < maxMonths) {
      month++;
      
      for (const debt of remainingDebts) {
        if (debt.currentBalance <= 0) continue;
        
        // Apply interest
        const monthlyInterest = (debt.interestRate / 100) / 12;
        debt.currentBalance += debt.currentBalance * monthlyInterest;
        
        // Apply minimum payment
        const payment = Math.min(debt.minimumPayment, debt.currentBalance);
        debt.currentBalance -= payment;
        
        // Check if paid off
        if (debt.currentBalance <= 0) {
          const existingResult = results.find(r => r.debt.id === debt.id);
          if (!existingResult) {
            results.push({
              debt: sortedDebts.find(d => d.id === debt.id)!,
              payoffOrder: results.length + 1,
              monthsToPayoff: month,
              totalInterestPaid: (month * debt.minimumPayment) - sortedDebts.find(d => d.id === debt.id)!.balance,
              payoffDate: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000)
            });
            availableExtra += debt.minimumPayment;
          }
        }
      }
      
      // Apply extra payment to first unpaid debt
      const targetDebt = remainingDebts.find(d => d.currentBalance > 0);
      if (targetDebt) {
        const extraApplied = Math.min(availableExtra, targetDebt.currentBalance);
        targetDebt.currentBalance -= extraApplied;
      }
    }
    
    // Add any remaining debts that weren't fully calculated
    for (const debt of remainingDebts) {
      if (!results.find(r => r.debt.id === debt.id)) {
        results.push({
          debt: sortedDebts.find(d => d.id === debt.id)!,
          payoffOrder: results.length + 1,
          monthsToPayoff: maxMonths,
          totalInterestPaid: 0,
          payoffDate: new Date(Date.now() + maxMonths * 30 * 24 * 60 * 60 * 1000)
        });
      }
    }
    
    return results;
  };

  const snowballResults = useMemo(() => {
    const sorted = [...debts].sort((a, b) => a.balance - b.balance);
    return calculatePayoff(sorted, extraPayment);
  }, [debts, extraPayment]);

  const avalancheResults = useMemo(() => {
    const sorted = [...debts].sort((a, b) => b.interestRate - a.interestRate);
    return calculatePayoff(sorted, extraPayment);
  }, [debts, extraPayment]);

  const recoveryPriorityResults = useMemo(() => {
    // Recovery-related debts first (restitution, legal fees, etc.), then by balance
    const sorted = [...debts].sort((a, b) => {
      if (a.isRecoveryRelated && !b.isRecoveryRelated) return -1;
      if (!a.isRecoveryRelated && b.isRecoveryRelated) return 1;
      return a.balance - b.balance;
    });
    return calculatePayoff(sorted, extraPayment);
  }, [debts, extraPayment]);

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinimumPayments = debts.reduce((sum, d) => sum + d.minimumPayment, 0);

  const snowballTotalMonths = Math.max(...snowballResults.map(r => r.monthsToPayoff));
  const avalancheTotalMonths = Math.max(...avalancheResults.map(r => r.monthsToPayoff));
  const recoveryTotalMonths = Math.max(...recoveryPriorityResults.map(r => r.monthsToPayoff));

  const snowballTotalInterest = snowballResults.reduce((sum, r) => sum + Math.max(0, r.totalInterestPaid), 0);
  const avalancheTotalInterest = avalancheResults.reduce((sum, r) => sum + Math.max(0, r.totalInterestPaid), 0);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatMonths = (months: number) => {
    if (months >= 600) return "50+ years";
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${remainingMonths} months`;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years}y ${remainingMonths}m`;
  };

  // Generate timeline data for the payoff chart
  const generateTimelineData = useMemo(() => {
    if (debts.length === 0) return [];
    
    const maxMonths = Math.max(snowballTotalMonths, avalancheTotalMonths, recoveryTotalMonths);
    const dataPoints = Math.min(maxMonths, 60); // Show up to 5 years
    const data = [];
    
    for (let month = 0; month <= dataPoints; month += Math.max(1, Math.floor(dataPoints / 12))) {
      const calculateRemainingBalance = (results: PayoffResult[]) => {
        return debts.reduce((total, debt) => {
          const result = results.find(r => r.debt.id === debt.id);
          if (!result || month >= result.monthsToPayoff) return total;
          
          // Approximate remaining balance
          const monthlyInterest = (debt.interestRate / 100) / 12;
          const monthlyPayment = debt.minimumPayment;
          let balance = debt.balance;
          
          for (let m = 0; m < month; m++) {
            balance = balance * (1 + monthlyInterest) - monthlyPayment;
            if (balance < 0) balance = 0;
          }
          
          return total + Math.max(0, balance);
        }, 0);
      };

      data.push({
        month: `Mo ${month}`,
        monthNum: month,
        snowball: Math.round(calculateRemainingBalance(snowballResults)),
        avalanche: Math.round(calculateRemainingBalance(avalancheResults)),
        recovery: Math.round(calculateRemainingBalance(recoveryPriorityResults))
      });
    }
    
    return data;
  }, [debts, snowballResults, avalancheResults, recoveryPriorityResults, snowballTotalMonths, avalancheTotalMonths, recoveryTotalMonths]);

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            Debt Management Calculator
          </CardTitle>
          <CardDescription>
            Compare payoff strategies and create a plan that supports your recovery journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-background/50">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 mx-auto text-destructive mb-2" />
                <p className="text-sm text-muted-foreground">Total Debt</p>
                <p className="text-2xl font-bold text-destructive">{formatCurrency(totalDebt)}</p>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Monthly Minimums</p>
                <p className="text-2xl font-bold">{formatCurrency(totalMinimumPayments)}</p>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardContent className="p-4 text-center">
                <PiggyBank className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <p className="text-sm text-muted-foreground">Extra Payment</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(extraPayment)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Add New Debt */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Add a Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                <div>
                  <Label htmlFor="debtName">Name</Label>
                  <Input
                    id="debtName"
                    placeholder="Credit Card"
                    value={newDebt.name}
                    onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="balance">Balance ($)</Label>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="5000"
                    value={newDebt.balance || ''}
                    onChange={(e) => setNewDebt({ ...newDebt, balance: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="rate">APR (%)</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    placeholder="19.99"
                    value={newDebt.interestRate || ''}
                    onChange={(e) => setNewDebt({ ...newDebt, interestRate: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="minPayment">Min Payment ($)</Label>
                  <Input
                    id="minPayment"
                    type="number"
                    placeholder="150"
                    value={newDebt.minimumPayment || ''}
                    onChange={(e) => setNewDebt({ ...newDebt, minimumPayment: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="recoveryRelated"
                    checked={newDebt.isRecoveryRelated}
                    onChange={(e) => setNewDebt({ ...newDebt, isRecoveryRelated: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="recoveryRelated" className="text-xs">Recovery-Related</Label>
                </div>
                <Button onClick={addDebt} className="gap-2">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Debts List */}
          {debts.length > 0 && (
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Debts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {debts.map((debt) => (
                    <div key={debt.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {debt.name}
                            {debt.isRecoveryRelated && (
                              <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-300">
                                Recovery
                              </Badge>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(debt.balance)} at {debt.interestRate}% APR
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm">{formatCurrency(debt.minimumPayment)}/mo</span>
                        <Button variant="ghost" size="sm" onClick={() => removeDebt(debt.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Extra Payment Slider */}
          <div className="space-y-2">
            <Label>Extra Monthly Payment: {formatCurrency(extraPayment)}</Label>
            <input
              type="range"
              min="0"
              max="1000"
              step="25"
              value={extraPayment}
              onChange={(e) => setExtraPayment(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$500</span>
              <span>$1,000</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Comparison */}
      {debts.length > 0 && (
        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="comparison" className="gap-1">
              <Scale className="h-4 w-4" /> Compare
            </TabsTrigger>
            <TabsTrigger value="snowball" className="gap-1">
              <Snowflake className="h-4 w-4" /> Snowball
            </TabsTrigger>
            <TabsTrigger value="avalanche" className="gap-1">
              <Flame className="h-4 w-4" /> Avalanche
            </TabsTrigger>
            <TabsTrigger value="recovery" className="gap-1">
              <AlertTriangle className="h-4 w-4" /> Recovery First
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Snowflake className="h-5 w-5 text-blue-600" />
                    Debt Snowball
                  </CardTitle>
                  <CardDescription>Pay smallest balance first for quick wins</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time to Debt-Free:</span>
                      <span className="font-bold">{formatMonths(snowballTotalMonths)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Interest Paid:</span>
                      <span className="font-bold text-destructive">{formatCurrency(snowballTotalInterest)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-600" />
                    Debt Avalanche
                  </CardTitle>
                  <CardDescription>Pay highest interest first to save money</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time to Debt-Free:</span>
                      <span className="font-bold">{formatMonths(avalancheTotalMonths)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Interest Paid:</span>
                      <span className="font-bold text-destructive">{formatCurrency(avalancheTotalInterest)}</span>
                    </div>
                    {avalancheTotalInterest < snowballTotalInterest && (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        Saves {formatCurrency(snowballTotalInterest - avalancheTotalInterest)}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    Recovery Priority
                  </CardTitle>
                  <CardDescription>Prioritize recovery-related debts first</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time to Debt-Free:</span>
                      <span className="font-bold">{formatMonths(recoveryTotalMonths)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Tackles restitution, legal fees, and treatment costs first to support your recovery journey.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Debt Payoff Timeline Chart */}
            {generateTimelineData.length > 1 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <LineChartIcon className="h-5 w-5 text-primary" />
                    Debt Payoff Timeline
                  </CardTitle>
                  <CardDescription>
                    Watch your debt disappear over time with each strategy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={generateTimelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
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
                          name === 'snowball' ? 'Snowball' : name === 'avalanche' ? 'Avalanche' : 'Recovery First'
                        ]}
                      />
                      <Legend />
                      <ReferenceLine y={0} stroke="hsl(var(--success))" strokeWidth={2} strokeDasharray="5 5" />
                      <Line 
                        type="monotone" 
                        dataKey="snowball" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={false}
                        name="Snowball"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avalanche" 
                        stroke="#f97316" 
                        strokeWidth={2}
                        dot={false}
                        name="Avalanche"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="recovery" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={false}
                        name="Recovery First"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground text-center">
                      <strong>Goal:</strong> Reach $0 debt! The faster the line drops, the quicker you're debt-free.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">💡 Recovery-Focused Recommendation</h4>
                <p className="text-sm text-muted-foreground">
                  {debts.some(d => d.isRecoveryRelated) 
                    ? "Consider the Recovery Priority method to address amends and legal obligations first. This aligns with Step 8-9 work and reduces emotional burden, even if it costs slightly more in interest."
                    : "The Debt Snowball method often works best in recovery because quick wins build momentum and self-esteem. The psychological boost of paying off debts can reinforce positive financial behaviors."
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="snowball">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Snowflake className="h-5 w-5 text-blue-600" />
                  Snowball Payoff Order
                </CardTitle>
                <CardDescription>Pay minimum on all debts, put extra toward smallest balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {snowballResults.map((result, index) => (
                    <div key={result.debt.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{result.debt.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(result.debt.balance)} • Paid off in {formatMonths(result.monthsToPayoff)}
                        </p>
                      </div>
                      <TrendingDown className="h-5 w-5 text-green-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="avalanche">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-600" />
                  Avalanche Payoff Order
                </CardTitle>
                <CardDescription>Pay minimum on all debts, put extra toward highest interest rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {avalancheResults.map((result, index) => (
                    <div key={result.debt.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{result.debt.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {result.debt.interestRate}% APR • Paid off in {formatMonths(result.monthsToPayoff)}
                        </p>
                      </div>
                      <TrendingDown className="h-5 w-5 text-green-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recovery">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Recovery Priority Payoff Order
                </CardTitle>
                <CardDescription>Prioritize recovery-related debts (restitution, legal fees, treatment costs)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recoveryPriorityResults.map((result, index) => (
                    <div key={result.debt.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium flex items-center gap-2">
                          {result.debt.name}
                          {result.debt.isRecoveryRelated && (
                            <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800">
                              Recovery
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(result.debt.balance)} • Paid off in {formatMonths(result.monthsToPayoff)}
                        </p>
                      </div>
                      <TrendingDown className="h-5 w-5 text-green-600" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Why prioritize recovery debts?</strong> Addressing restitution and legal obligations supports your 12-step work and removes barriers to making amends. This approach aligns financial recovery with emotional and spiritual healing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default DebtManagementCalculator;
