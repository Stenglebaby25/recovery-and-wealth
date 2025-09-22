import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface IncomeSource {
  id: string;
  source: string;
  amount: number;
}

interface ExpenseData {
  category: string;
  amount: number;
  count: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--destructive))', 'hsl(var(--warning))'];

export const BudgetAnalysis = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [newIncomeSource, setNewIncomeSource] = useState('');
  const [newIncomeAmount, setNewIncomeAmount] = useState('');
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    if (user) {
      loadIncomeData();
      loadExpenseData();
    }
  }, [user]);

  const loadIncomeData = () => {
    // For now, use localStorage for income data (can be moved to Supabase later)
    const stored = localStorage.getItem(`income_${user?.id}`);
    if (stored) {
      const sources = JSON.parse(stored);
      setIncomeSources(sources);
      setTotalIncome(sources.reduce((sum: number, source: IncomeSource) => sum + source.amount, 0));
    }
  };

  const loadExpenseData = async () => {
    if (!user) return;

    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('category, amount')
      .eq('user_id', user.id)
      .gte('expense_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

    if (error) {
      console.error('Error loading expenses:', error);
      return;
    }

    // Group expenses by category
    const categoryMap = new Map<string, { amount: number; count: number }>();
    let total = 0;

    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount.toString());
      total += amount;
      
      if (categoryMap.has(expense.category)) {
        const existing = categoryMap.get(expense.category)!;
        categoryMap.set(expense.category, {
          amount: existing.amount + amount,
          count: existing.count + 1
        });
      } else {
        categoryMap.set(expense.category, { amount, count: 1 });
      }
    });

    const categoryData = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount: data.amount,
      count: data.count
    }));

    setExpenseData(categoryData);
    setTotalExpenses(total);
  };

  const addIncomeSource = () => {
    if (!newIncomeSource.trim() || !newIncomeAmount.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both income source and amount.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(newIncomeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive"
      });
      return;
    }

    const newSource: IncomeSource = {
      id: Date.now().toString(),
      source: newIncomeSource,
      amount
    };

    const updatedSources = [...incomeSources, newSource];
    setIncomeSources(updatedSources);
    setTotalIncome(updatedSources.reduce((sum, source) => sum + source.amount, 0));
    
    // Save to localStorage
    localStorage.setItem(`income_${user?.id}`, JSON.stringify(updatedSources));
    
    setNewIncomeSource('');
    setNewIncomeAmount('');
    
    toast({
      title: "Income Source Added",
      description: `${newIncomeSource} has been added to your budget.`
    });
  };

  const removeIncomeSource = (id: string) => {
    const updatedSources = incomeSources.filter(source => source.id !== id);
    setIncomeSources(updatedSources);
    setTotalIncome(updatedSources.reduce((sum, source) => sum + source.amount, 0));
    localStorage.setItem(`income_${user?.id}`, JSON.stringify(updatedSources));
  };

  const exportAnalysis = () => {
    const analysisData = {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      incomeSources,
      expenseBreakdown: expenseData,
      generatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(analysisData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `budget-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Analysis Exported",
      description: "Your budget analysis has been downloaded."
    });
  };

  const incomeVsExpenseData = [
    { name: 'Income', amount: totalIncome, fill: 'hsl(var(--primary))' },
    { name: 'Expenses', amount: totalExpenses, fill: 'hsl(var(--destructive))' }
  ];

  const netIncome = totalIncome - totalExpenses;

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Please sign in to access budget analysis.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            {netIncome >= 0 ? (
              <TrendingUp className="h-4 w-4 text-primary" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-primary' : 'text-destructive'}`}>
              ${netIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income Management */}
      <Card>
        <CardHeader>
          <CardTitle>Income Sources</CardTitle>
          <CardDescription>Add your monthly income sources for analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income-source">Income Source</Label>
              <Input
                id="income-source"
                placeholder="e.g., Salary, Freelance"
                value={newIncomeSource}
                onChange={(e) => setNewIncomeSource(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="income-amount">Monthly Amount</Label>
              <Input
                id="income-amount"
                type="number"
                placeholder="0.00"
                value={newIncomeAmount}
                onChange={(e) => setNewIncomeAmount(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addIncomeSource} className="w-full">Add Income</Button>
            </div>
          </div>
          
          {incomeSources.length > 0 && (
            <div className="space-y-2">
              {incomeSources.map((source) => (
                <div key={source.id} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>{source.source}: ${source.amount.toFixed(2)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeIncomeSource(source.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Monthly comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeVsExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                <Bar dataKey="amount" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, amount }) => `${category}: $${amount.toFixed(2)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No expense data available. Start tracking expenses to see the breakdown.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Detailed spending analysis by category</CardDescription>
          </div>
          <Button onClick={exportAnalysis} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
        </CardHeader>
        <CardContent>
          {expenseData.length > 0 ? (
            <div className="space-y-4">
              {expenseData.map((category, index) => {
                const percentage = totalExpenses > 0 ? (category.amount / totalExpenses * 100) : 0;
                return (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.category}</span>
                      <div className="text-right">
                        <div className="font-semibold">${category.amount.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {category.count} transaction{category.count !== 1 ? 's' : ''} • {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">No expense data available for analysis.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};