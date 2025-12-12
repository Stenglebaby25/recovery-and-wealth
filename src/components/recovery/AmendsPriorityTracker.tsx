import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, Plus, Check, Trash2, Users, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface AmendEntry {
  id: string;
  personName: string;
  amount: number;
  relationship: string;
  priority: "high" | "medium" | "low";
  notes: string;
  isAddressed: boolean;
  createdAt: string;
}

const STORAGE_KEY = "amends-priority-tracker";

const AmendsPriorityTracker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<AmendEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [personName, setPersonName] = useState("");
  const [amount, setAmount] = useState("");
  const [relationship, setRelationship] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [notes, setNotes] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load amends data");
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const resetForm = () => {
    setPersonName("");
    setAmount("");
    setRelationship("");
    setPriority("medium");
    setNotes("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    const trimmedName = personName.trim();
    const trimmedRelationship = relationship.trim();
    const trimmedNotes = notes.trim();
    
    if (!trimmedName) {
      toast.error("Please enter a name");
      return;
    }
    
    if (trimmedName.length > 100) {
      toast.error("Name must be less than 100 characters");
      return;
    }
    
    const parsedAmount = parseFloat(amount) || 0;
    if (parsedAmount < 0 || parsedAmount > 999999999) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (editingId) {
      setEntries(prev => prev.map(entry => 
        entry.id === editingId 
          ? { 
              ...entry, 
              personName: trimmedName, 
              amount: parsedAmount, 
              relationship: trimmedRelationship.slice(0, 50),
              priority, 
              notes: trimmedNotes.slice(0, 500)
            }
          : entry
      ));
      toast.success("Entry updated");
    } else {
      const newEntry: AmendEntry = {
        id: crypto.randomUUID(),
        personName: trimmedName,
        amount: parsedAmount,
        relationship: trimmedRelationship.slice(0, 50),
        priority,
        notes: trimmedNotes.slice(0, 500),
        isAddressed: false,
        createdAt: new Date().toISOString(),
      };
      setEntries(prev => [...prev, newEntry]);
      toast.success("Entry added to your amends list");
    }
    
    resetForm();
  };

  const handleEdit = (entry: AmendEntry) => {
    setPersonName(entry.personName);
    setAmount(entry.amount.toString());
    setRelationship(entry.relationship);
    setPriority(entry.priority);
    setNotes(entry.notes);
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast.success("Entry removed");
  };

  const toggleAddressed = (id: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, isAddressed: !entry.isAddressed } : entry
    ));
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "high": return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      case "medium": return "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30";
      case "low": return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      default: return "";
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    // Unaddressed first
    if (a.isAddressed !== b.isAddressed) return a.isAddressed ? 1 : -1;
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const totalOwed = entries.filter(e => !e.isAddressed).reduce((sum, e) => sum + e.amount, 0);
  const totalAddressed = entries.filter(e => e.isAddressed).reduce((sum, e) => sum + e.amount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="rounded-xl border-2 border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-950/20 p-8 text-center space-y-4 cursor-pointer hover:border-purple-400 dark:hover:border-purple-600 transition-colors">
          <div className="w-16 h-16 mx-auto rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-purple-900 dark:text-purple-100">Amends Priority Tracker</p>
            <p className="text-sm text-muted-foreground">Track and prioritize financial amends</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Heart className="w-4 h-4 mr-2" />
            Open Tracker
          </Button>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Heart className="w-6 h-6 text-purple-600" />
            Amends Priority Tracker
          </DialogTitle>
          <DialogDescription>
            "Making amends isn't just about money—it's about restoring trust and integrity."
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Summary Stats */}
          {entries.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-purple-50 dark:bg-purple-950/30 p-4 text-center">
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  ${totalOwed.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 text-center">
                <p className="text-sm text-muted-foreground">Addressed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${totalAddressed.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Add/Edit Form */}
          {showForm ? (
            <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="personName">Person's Name *</Label>
                  <Input
                    id="personName"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    placeholder="Who do you owe?"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount Owed</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    max="999999999"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="Friend, Family, etc."
                    maxLength={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as "high" | "medium" | "low")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">🔴 High Priority</SelectItem>
                      <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                      <SelectItem value="low">🟢 Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Context, feelings, or plan for making amends..."
                  rows={3}
                  maxLength={500}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  {editingId ? "Update Entry" : "Add to List"}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={() => setShowForm(true)} 
              variant="outline" 
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Someone to Your Amends List
            </Button>
          )}

          {/* Entries List */}
          {sortedEntries.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                Your Amends List ({entries.filter(e => !e.isAddressed).length} remaining)
              </h4>
              {sortedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-4 rounded-lg border transition-all ${
                    entry.isAddressed 
                      ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800 opacity-75" 
                      : "bg-background border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold ${entry.isAddressed ? "line-through text-muted-foreground" : ""}`}>
                          {entry.personName}
                        </span>
                        {entry.relationship && (
                          <span className="text-xs text-muted-foreground">({entry.relationship})</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(entry.priority)}`}>
                          {entry.priority}
                        </span>
                      </div>
                      {entry.amount > 0 && (
                        <p className={`text-lg font-medium ${entry.isAddressed ? "text-muted-foreground" : "text-purple-600 dark:text-purple-400"}`}>
                          ${entry.amount.toLocaleString()}
                        </p>
                      )}
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{entry.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant={entry.isAddressed ? "default" : "outline"}
                        onClick={() => toggleAddressed(entry.id)}
                        className="h-8 w-8 p-0"
                        title={entry.isAddressed ? "Mark as pending" : "Mark as addressed"}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(entry)}
                        className="h-8 w-8 p-0"
                        title="Edit"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(entry.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No entries yet.</p>
              <p className="text-sm">Start by adding someone you'd like to make amends with.</p>
            </div>
          )}

          {/* Encouragement */}
          <div className="rounded-lg bg-purple-50 dark:bg-purple-950/30 p-4 text-center">
            <p className="text-sm text-purple-700 dark:text-purple-300 italic">
              "Every amend you make is a step toward freedom. Progress, not perfection."
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AmendsPriorityTracker;
