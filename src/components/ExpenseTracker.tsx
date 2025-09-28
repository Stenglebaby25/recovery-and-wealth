import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, DollarSign, AlertTriangle, TrendingUp, Bell, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  expense_date: string;
}

interface SpendingLimit {
  id: string;
  category: string;
  monthly_limit: number;
  alert_threshold: number;
}

const EXPENSE_CATEGORIES = [
  "food",
  "transportation", 
  "entertainment",
  "shopping",
  "bills",
  "healthcare",
  "other"
];

export default function ExpenseTracker() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [spendingLimits, setSpendingLimits] = useState<SpendingLimit[]>([]);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    description: ""
  });
  const [monthlySpending, setMonthlySpending] = useState<Record<string, number>>({});
  const [alerts, setAlerts] = useState<{category: string, message: string, type: 'warning' | 'danger', percentage: number}[]>([]);

  useEffect(() => {
    if (user) {
      loadExpenses();
      loadSpendingLimits();
    }
  }, [user]);

  useEffect(() => {
    calculateMonthlySpending();
  }, [expenses, spendingLimits]);

  const loadExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user?.id)
        .order("expense_date", { ascending: false })
        .limit(10);

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  };

  const loadSpendingLimits = async () => {
    try {
      const { data, error } = await supabase
        .from("spending_limits")
        .select("*")
        .eq("user_id", user?.id)
        .eq("is_active", true);

      if (error) throw error;
      setSpendingLimits(data || []);
    } catch (error) {
      console.error("Error loading spending limits:", error);
    }
  };

  const calculateMonthlySpending = async () => {
    if (!user) return;

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("category, amount")
        .eq("user_id", user.id)
        .gte("expense_date", `${currentMonth}-01`)
        .lt("expense_date", `${currentMonth}-32`);

      if (error) throw error;

      const spending: Record<string, number> = {};
      const newAlerts: {category: string, message: string, type: 'warning' | 'danger', percentage: number}[] = [];

      data?.forEach((expense) => {
        spending[expense.category] = (spending[expense.category] || 0) + Number(expense.amount);
      });

      spendingLimits.forEach((limit) => {
        const spent = spending[limit.category] || 0;
        const percentage = (spent / limit.monthly_limit) * 100;
        const threshold = limit.monthly_limit * limit.alert_threshold;
        
        if (spent >= limit.monthly_limit) {
          newAlerts.push({
            category: limit.category,
            message: `Budget exceeded by $${(spent - limit.monthly_limit).toFixed(2)}`,
            type: 'danger',
            percentage: percentage
          });
          
          // Toast for budget exceeded
          toast.error(`${limit.category} budget exceeded!`, {
            description: `You've spent $${spent.toFixed(2)} of your $${limit.monthly_limit} limit`
          });
        } else if (spent >= threshold) {
          newAlerts.push({
            category: limit.category,
            message: `${percentage.toFixed(0)}% of budget used`,
            type: 'warning',
            percentage: percentage
          });
          
          // Toast for approaching limit (only at 90% to avoid spam)
          if (percentage >= 90 && percentage < 100) {
            toast.warning(`Approaching ${limit.category} budget limit`, {
              description: `You've used ${percentage.toFixed(0)}% of your monthly budget`
            });
          }
        }
      });

      setMonthlySpending(spending);
      setAlerts(newAlerts);
    } catch (error) {
      console.error("Error calculating monthly spending:", error);
    }
  };

  const addExpense = async () => {
    if (!user || !newExpense.amount || !newExpense.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase
        .from("expenses")
        .insert([
          {
            user_id: user.id,
            amount: parseFloat(newExpense.amount),
            category: newExpense.category,
            description: newExpense.description
          }
        ]);

      if (error) throw error;

      toast.success("Expense added successfully");
      setNewExpense({ amount: "", category: "", description: "" });
      loadExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    }
  };

  const setSpendingLimit = async (category: string, limit: string) => {
    if (!user || !limit) return;

    try {
      const { error } = await supabase
        .from("spending_limits")
        .upsert([
          {
            user_id: user.id,
            category,
            monthly_limit: parseFloat(limit),
            alert_threshold: 0.8
          }
        ]);

      if (error) throw error;

      toast.success(`Spending limit set for ${category}`);
      loadSpendingLimits();
    } catch (error) {
      console.error("Error setting spending limit:", error);
      toast.error("Failed to set spending limit");
    }
  };

  return (
    <div className="space-y-6">
      {alerts.length > 0 && (
        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-warning" />
              Spending Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert, index) => (
              <Alert key={index} variant={alert.type === 'danger' ? 'destructive' : 'default'}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {alert.type === 'danger' ? (
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    ) : (
                      <Target className="h-5 w-5 text-warning mt-0.5" />
                    )}
                    <div>
                      <AlertTitle className="capitalize">{alert.category}</AlertTitle>
                      <AlertDescription>{alert.message}</AlertDescription>
                    </div>
                  </div>
                  <Badge variant={alert.type === 'danger' ? 'destructive' : 'secondary'}>
                    {alert.percentage.toFixed(0)}%
                  </Badge>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add Expense
            </CardTitle>
            <CardDescription>
              Track your spending to stay aware of your financial habits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newExpense.category} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="What was this expense for?"
                value={newExpense.description}
                onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <Button onClick={addExpense} className="w-full">
              Add Expense
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Overview
            </CardTitle>
            <CardDescription>
              Your spending by category this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(monthlySpending).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No expenses recorded this month
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(monthlySpending).map(([category, amount]) => {
                  const limit = spendingLimits.find(l => l.category === category);
                  const percentage = limit ? (amount / limit.monthly_limit) * 100 : 0;
                  
                  return (
                    <div key={category} className="space-y-3 p-4 border rounded-lg bg-card/50">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="capitalize">
                              {category}
                            </Badge>
                            {percentage >= 100 ? (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            ) : percentage >= 80 ? (
                              <Target className="h-4 w-4 text-warning" />
                            ) : null}
                          </div>
                          <div className="text-2xl font-bold">${amount.toFixed(2)}</div>
                          {limit && (
                            <div className="text-sm text-muted-foreground">
                              of ${limit.monthly_limit} budget
                            </div>
                          )}
                        </div>
                        {limit && (
                          <Badge 
                            variant={percentage >= 100 ? "destructive" : percentage >= 80 ? "secondary" : "outline"}
                            className="ml-2"
                          >
                            {percentage.toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                      {limit && (
                        <div className="space-y-2">
                          <Progress 
                            value={Math.min(percentage, 100)} 
                            className={`h-2 ${percentage >= 100 ? '[&>div]:bg-destructive' : percentage >= 80 ? '[&>div]:bg-warning' : ''}`}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>${(limit.monthly_limit - amount).toFixed(2)} remaining</span>
                            <span>{percentage >= 100 ? 'Over budget' : `${(100 - percentage).toFixed(0)}% left`}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Recent Expenses
          </CardTitle>
          <CardDescription>
            Your last 10 recorded expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No expenses recorded yet. Add your first expense above!
            </p>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                    </Badge>
                    <div>
                      <div className="font-medium">${expense.amount}</div>
                      {expense.description && (
                        <div className="text-sm text-muted-foreground">{expense.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(expense.expense_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Set Spending Limits</CardTitle>
          <CardDescription>
            Set monthly limits for categories to get alerts when you're close to overspending
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {EXPENSE_CATEGORIES.map((category) => {
              const existingLimit = spendingLimits.find(l => l.category === category);
              return (
                <div key={category} className="flex items-center gap-2">
                  <Label className="min-w-24 capitalize">{category}:</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Monthly limit"
                    defaultValue={existingLimit?.monthly_limit || ""}
                    onBlur={(e) => {
                      if (e.target.value) {
                        setSpendingLimit(category, e.target.value);
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}