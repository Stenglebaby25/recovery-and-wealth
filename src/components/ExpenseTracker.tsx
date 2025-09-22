import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
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
  const [alerts, setAlerts] = useState<string[]>([]);

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
      const newAlerts: string[] = [];

      data?.forEach((expense) => {
        spending[expense.category] = (spending[expense.category] || 0) + Number(expense.amount);
      });

      spendingLimits.forEach((limit) => {
        const spent = spending[limit.category] || 0;
        const threshold = limit.monthly_limit * limit.alert_threshold;
        
        if (spent >= threshold) {
          newAlerts.push(`You've spent $${spent.toFixed(2)} on ${limit.category} (${Math.round((spent / limit.monthly_limit) * 100)}% of your $${limit.monthly_limit} limit)`);
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
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{alert}</AlertDescription>
            </Alert>
          ))}
        </div>
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
              <div className="space-y-3">
                {Object.entries(monthlySpending).map(([category, amount]) => {
                  const limit = spendingLimits.find(l => l.category === category);
                  const percentage = limit ? (amount / limit.monthly_limit) * 100 : 0;
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Badge>
                        {percentage > 80 && (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${amount.toFixed(2)}</div>
                        {limit && (
                          <div className="text-sm text-muted-foreground">
                            {percentage.toFixed(0)}% of ${limit.monthly_limit}
                          </div>
                        )}
                      </div>
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