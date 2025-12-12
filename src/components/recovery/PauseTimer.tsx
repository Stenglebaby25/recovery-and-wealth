import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Play, RotateCcw, CheckCircle2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PausedItem {
  id: string;
  name: string;
  amount: number;
  startTime: number;
  endTime: number;
}

const STORAGE_KEY = 'recovery-wealth-pause-timers';

const PauseTimer = () => {
  const [pausedItems, setPausedItems] = useState<PausedItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [now, setNow] = useState(Date.now());

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPausedItems(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pausedItems));
  }, [pausedItems]);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const addPausedItem = () => {
    if (!newItemName.trim()) {
      toast.error('Please enter what you want to pause on');
      return;
    }

    const amount = parseFloat(newItemAmount) || 0;
    const startTime = Date.now();
    const endTime = startTime + 48 * 60 * 60 * 1000; // 48 hours

    const newItem: PausedItem = {
      id: crypto.randomUUID(),
      name: newItemName.trim(),
      amount,
      startTime,
      endTime,
    };

    setPausedItems(prev => [...prev, newItem]);
    setNewItemName('');
    setNewItemAmount('');
    toast.success('48-hour pause started!');
  };

  const removeItem = (id: string) => {
    setPausedItems(prev => prev.filter(item => item.id !== id));
    toast.info('Item removed');
  };

  const restartTimer = (id: string) => {
    const startTime = Date.now();
    const endTime = startTime + 48 * 60 * 60 * 1000;
    setPausedItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, startTime, endTime } : item
      )
    );
    toast.success('Timer restarted');
  };

  const formatTimeRemaining = (endTime: number) => {
    const diff = endTime - now;
    if (diff <= 0) return { text: 'Complete!', complete: true };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      text: `${hours}h ${minutes}m ${seconds}s`,
      complete: false,
      percent: ((48 * 60 * 60 * 1000 - diff) / (48 * 60 * 60 * 1000)) * 100,
    };
  };

  return (
    <Card className="rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/20">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <Clock className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">48-Hour Pause Timer</h4>
            <p className="text-xs text-muted-foreground">Delay impulse purchases</p>
          </div>
        </div>

        {/* Add new item */}
        <div className="space-y-3">
          <Input
            placeholder="What do you want to buy?"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="bg-background"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount ($)"
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(e.target.value)}
              className="bg-background flex-1"
            />
            <Button onClick={addPausedItem} className="bg-slate-600 hover:bg-slate-700">
              <Play className="w-4 h-4 mr-1" />
              Start
            </Button>
          </div>
        </div>

        {/* Active timers */}
        {pausedItems.length > 0 && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {pausedItems.map((item) => {
              const time = formatTimeRemaining(item.endTime);
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border ${
                    time.complete
                      ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30'
                      : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      {item.amount > 0 && (
                        <p className="text-xs text-muted-foreground">${item.amount.toFixed(2)}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {time.complete ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => restartTimer(item.id)}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  
                  {!time.complete && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Time remaining</span>
                        <span className="font-mono font-medium">{time.text}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-500 transition-all duration-1000"
                          style={{ width: `${time.percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {time.complete && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      You waited 48 hours! Make a mindful decision now.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {pausedItems.length === 0 && (
          <p className="text-xs text-center text-muted-foreground py-2">
            No active timers. Add a purchase you're tempted to make.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PauseTimer;
