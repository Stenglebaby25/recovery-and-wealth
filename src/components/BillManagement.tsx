import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, CheckCircle, Clock, DollarSign, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format, isAfter, isBefore, addDays } from 'date-fns';

interface Bill {
  id: string;
  bill_name: string;
  amount: number;
  due_date: string;
  frequency: string;
  category: string;
  is_paid: boolean;
  autopay_enabled: boolean;
  reminder_days: number;
  notes?: string;
}

const BillManagement = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isAddingBill, setIsAddingBill] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newBill, setNewBill] = useState({
    bill_name: '',
    amount: '',
    due_date: '',
    frequency: 'monthly',
    category: 'utilities',
    autopay_enabled: false,
    reminder_days: 3,
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchBills();
    }
  }, [user]);

  const fetchBills = async () => {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('user_id', user?.id)
        .order('due_date');

      if (error) throw error;
      setBills(data || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast({
        title: "Error",
        description: "Failed to load bills",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addBill = async () => {
    if (!newBill.bill_name || !newBill.amount || !newBill.due_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('bills')
        .insert([
          {
            user_id: user?.id,
            bill_name: newBill.bill_name,
            amount: parseFloat(newBill.amount),
            due_date: newBill.due_date,
            frequency: newBill.frequency,
            category: newBill.category,
            autopay_enabled: newBill.autopay_enabled,
            reminder_days: newBill.reminder_days,
            notes: newBill.notes
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bill added successfully",
      });

      setNewBill({
        bill_name: '',
        amount: '',
        due_date: '',
        frequency: 'monthly',
        category: 'utilities',
        autopay_enabled: false,
        reminder_days: 3,
        notes: ''
      });
      setIsAddingBill(false);
      fetchBills();
    } catch (error) {
      console.error('Error adding bill:', error);
      toast({
        title: "Error",
        description: "Failed to add bill",
        variant: "destructive",
      });
    }
  };

  const togglePaidStatus = async (billId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('bills')
        .update({ is_paid: !currentStatus })
        .eq('id', billId);

      if (error) throw error;

      setBills(bills.map(bill => 
        bill.id === billId ? { ...bill, is_paid: !currentStatus } : bill
      ));

      toast({
        title: "Success",
        description: `Bill marked as ${!currentStatus ? 'paid' : 'unpaid'}`,
      });
    } catch (error) {
      console.error('Error updating bill:', error);
      toast({
        title: "Error",
        description: "Failed to update bill status",
        variant: "destructive",
      });
    }
  };

  const getBillStatus = (bill: Bill) => {
    const today = new Date();
    const dueDate = new Date(bill.due_date);
    const reminderDate = addDays(dueDate, -bill.reminder_days);

    if (bill.is_paid) {
      return { status: 'paid', color: 'bg-green-500', icon: CheckCircle };
    } else if (isBefore(dueDate, today)) {
      return { status: 'overdue', color: 'bg-red-500', icon: AlertTriangle };
    } else if (isBefore(reminderDate, today)) {
      return { status: 'due-soon', color: 'bg-yellow-500', icon: Clock };
    } else {
      return { status: 'upcoming', color: 'bg-blue-500', icon: Calendar };
    }
  };

  const upcomingBills = bills.filter(bill => !bill.is_paid);
  const overdueBills = upcomingBills.filter(bill => isBefore(new Date(bill.due_date), new Date()));
  const totalUpcoming = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);

  if (loading) {
    return <div className="text-center py-8">Loading bills...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-soft bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Upcoming</p>
                <p className="text-2xl font-bold">${totalUpcoming.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Overdue Bills</p>
                <p className="text-2xl font-bold text-red-500">{overdueBills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Bills</p>
                <p className="text-2xl font-bold">{bills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Bill */}
      <Card className="border-0 shadow-soft bg-gradient-subtle">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Add New Bill
            <Button
              onClick={() => setIsAddingBill(!isAddingBill)}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAddingBill ? 'Cancel' : 'Add Bill'}
            </Button>
          </CardTitle>
        </CardHeader>
        {isAddingBill && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bill-name">Bill Name *</Label>
                <Input
                  id="bill-name"
                  value={newBill.bill_name}
                  onChange={(e) => setNewBill({ ...newBill, bill_name: e.target.value })}
                  placeholder="e.g., Electric Bill"
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="due-date">Due Date *</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={newBill.due_date}
                  onChange={(e) => setNewBill({ ...newBill, due_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={newBill.frequency} onValueChange={(value) => setNewBill({ ...newBill, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newBill.category} onValueChange={(value) => setNewBill({ ...newBill, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="rent">Rent/Mortgage</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="loans">Loans</SelectItem>
                    <SelectItem value="subscriptions">Subscriptions</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reminder-days">Reminder Days</Label>
                <Input
                  id="reminder-days"
                  type="number"
                  value={newBill.reminder_days}
                  onChange={(e) => setNewBill({ ...newBill, reminder_days: parseInt(e.target.value) || 3 })}
                  placeholder="3"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newBill.notes}
                onChange={(e) => setNewBill({ ...newBill, notes: e.target.value })}
                placeholder="Additional notes about this bill..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="autopay"
                checked={newBill.autopay_enabled}
                onCheckedChange={(checked) => setNewBill({ ...newBill, autopay_enabled: checked })}
              />
              <Label htmlFor="autopay">Autopay Enabled</Label>
            </div>
            <Button onClick={addBill} className="w-full">
              Add Bill
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Bills List */}
      <Card className="border-0 shadow-soft bg-gradient-subtle">
        <CardHeader>
          <CardTitle>Your Bills</CardTitle>
        </CardHeader>
        <CardContent>
          {bills.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No bills added yet. Add your first bill to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {bills.map((bill) => {
                const { status, color, icon: StatusIcon } = getBillStatus(bill);
                return (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-background/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${color} text-white`}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{bill.bill_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Due: {format(new Date(bill.due_date), 'MMM dd, yyyy')} • {bill.category}
                        </p>
                        {bill.autopay_enabled && (
                          <Badge variant="secondary" className="mt-1">
                            Autopay
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground capitalize">{bill.frequency}</p>
                      </div>
                      <Button
                        variant={bill.is_paid ? "default" : "outline"}
                        size="sm"
                        onClick={() => togglePaidStatus(bill.id, bill.is_paid)}
                      >
                        {bill.is_paid ? 'Paid' : 'Mark Paid'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillManagement;