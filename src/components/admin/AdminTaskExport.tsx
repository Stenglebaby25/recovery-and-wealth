import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Send, ExternalLink, CheckCircle2, Circle, Loader2, ClipboardCopy } from 'lucide-react';

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
}

const PROJECT_TASKS: ProjectTask[] = [
  // Circle.so Community
  {
    id: 'circle-spaces',
    title: 'Add remaining Circle.so community spaces',
    description: 'Create additional spaces: Financial Wins, Accountability Partners, Weekly Check-In, Recovery Milestones, and Resource Sharing',
    category: 'Circle.so Community',
    priority: 'high',
    status: 'todo',
  },
  {
    id: 'circle-content',
    title: 'Populate Circle.so spaces with starter content',
    description: 'Add welcome posts, pinned resources, discussion prompts, and community guidelines to each space',
    category: 'Circle.so Community',
    priority: 'high',
    status: 'todo',
  },
  {
    id: 'circle-onboarding',
    title: 'Create Circle.so member onboarding flow',
    description: 'Build welcome sequence, intro post template, and new member checklist for community onboarding',
    category: 'Circle.so Community',
    priority: 'medium',
    status: 'todo',
  },
  // Curriculum Content
  {
    id: 'advanced-lessons-9-21',
    title: 'Populate Advanced lesson content (Weeks 9-21)',
    description: 'Create interactive lesson content for remaining Advanced Series weeks following the standardized 5-section format',
    category: 'Curriculum',
    priority: 'high',
    status: 'todo',
  },
  {
    id: 'week-22-done',
    title: 'Week 22 Robo-Advisors lesson content',
    description: 'Interactive lesson with slides, quiz, checklist, and reflection prompts — fully populated',
    category: 'Curriculum',
    priority: 'high',
    status: 'done',
  },
  // Partner Resources
  {
    id: 'partner-course-links',
    title: 'Link Partner Resource Hub entries to curriculum',
    description: 'Add course links from Credit Karma → Week 21, YNAB → Week 2, NerdWallet → Week 4, etc.',
    category: 'Partner Resources',
    priority: 'medium',
    status: 'todo',
  },
  // Platform Features
  {
    id: 'email-drip-campaigns',
    title: 'Configure email drip campaign sequences',
    description: 'Set up automated welcome, onboarding, and re-engagement email sequences via Resend/Beehiiv',
    category: 'Marketing & Email',
    priority: 'medium',
    status: 'todo',
  },
  {
    id: 'stripe-pricing-tiers',
    title: 'Finalize Stripe pricing & subscription tiers',
    description: 'Confirm pricing for Individual, Facility, and Enterprise tiers; connect checkout flows',
    category: 'Payments',
    priority: 'high',
    status: 'todo',
  },
  {
    id: 'coaching-booking',
    title: 'Integrate coaching booking system',
    description: 'Connect calendar/booking tool for 1-on-1 financial coaching sessions',
    category: 'Coaching',
    priority: 'medium',
    status: 'todo',
  },
  {
    id: 'seo-meta-tags',
    title: 'Add SEO meta tags & Open Graph to all pages',
    description: 'Ensure all public pages have proper title, description, OG images, and structured data',
    category: 'SEO & Marketing',
    priority: 'medium',
    status: 'todo',
  },
  {
    id: 'mobile-responsive-audit',
    title: 'Mobile responsiveness audit & fixes',
    description: 'Test all pages on mobile viewports and fix any layout/usability issues',
    category: 'UX / QA',
    priority: 'medium',
    status: 'todo',
  },
];

const priorityColors: Record<string, string> = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-highlight/10 text-highlight border-highlight/20',
  low: 'bg-muted text-muted-foreground border-muted',
};

const statusIcons: Record<string, React.ReactNode> = {
  done: <CheckCircle2 className="w-4 h-4 text-primary" />,
  in_progress: <Circle className="w-4 h-4 text-highlight" />,
  todo: <Circle className="w-4 h-4 text-muted-foreground" />,
};

const AdminTaskExport = () => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(
    new Set(PROJECT_TASKS.filter(t => t.status === 'todo').map(t => t.id))
  );
  const [sending, setSending] = useState(false);
  const [sentTasks, setSentTasks] = useState<Set<string>>(new Set());

  const toggleTask = (id: string) => {
    setSelectedTasks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedTasks(new Set(PROJECT_TASKS.filter(t => t.status !== 'done').map(t => t.id)));
  };

  const deselectAll = () => {
    setSelectedTasks(new Set());
  };

  const sendToMonday = async () => {
    if (!webhookUrl) {
      toast({ title: 'Missing Webhook URL', description: 'Please enter your Zapier webhook URL', variant: 'destructive' });
      return;
    }

    const tasksToSend = PROJECT_TASKS.filter(t => selectedTasks.has(t.id));
    if (tasksToSend.length === 0) {
      toast({ title: 'No tasks selected', description: 'Select at least one task to send', variant: 'destructive' });
      return;
    }

    setSending(true);

    try {
      for (const task of tasksToSend) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'no-cors',
          body: JSON.stringify({
            task_name: task.title,
            task_description: task.description,
            task_category: task.category,
            task_priority: task.priority,
            task_status: task.status,
            source: 'Recovery Wealth - Lovable',
            timestamp: new Date().toISOString(),
          }),
        });
        setSentTasks(prev => new Set([...prev, task.id]));
        // Small delay between requests to avoid rate limiting
        await new Promise(r => setTimeout(r, 300));
      }

      toast({
        title: `${tasksToSend.length} Tasks Sent`,
        description: 'Requests sent to Zapier. Check your Zap history to confirm they arrived in Monday.com.',
      });
    } catch (error) {
      console.error('Error sending tasks:', error);
      toast({ title: 'Error', description: 'Failed to send tasks. Check your webhook URL.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const copyAsText = () => {
    const tasks = PROJECT_TASKS.filter(t => selectedTasks.has(t.id));
    const text = tasks.map(t =>
      `[${t.priority.toUpperCase()}] ${t.title}\n  Category: ${t.category}\n  ${t.description}`
    ).join('\n\n');
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: `${tasks.length} tasks copied to clipboard` });
  };

  const categories = [...new Set(PROJECT_TASKS.map(t => t.category))];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-soft bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Export Tasks to Monday.com
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Send project tasks to Monday.com via a Zapier webhook. Set up a Zap with a
            "Webhooks by Zapier" trigger → "Monday.com: Create Item" action.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={sendToMonday} disabled={sending || selectedTasks.size === 0}>
              {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              {sending ? 'Sending...' : `Send ${selectedTasks.size} Tasks`}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>Select All Open</Button>
            <Button variant="outline" size="sm" onClick={deselectAll}>Deselect All</Button>
            <Button variant="outline" size="sm" onClick={copyAsText}>
              <ClipboardCopy className="w-4 h-4 mr-1" />
              Copy as Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {categories.map(category => {
        const categoryTasks = PROJECT_TASKS.filter(t => t.category === category);
        return (
          <Card key={category} className="border-0 shadow-soft bg-gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryTasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    task.status === 'done' ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                  } ${sentTasks.has(task.id) ? 'border-primary/40 bg-primary/5' : ''}`}
                >
                  <Checkbox
                    checked={selectedTasks.has(task.id)}
                    onCheckedChange={() => toggleTask(task.id)}
                    disabled={task.status === 'done'}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {statusIcons[task.status]}
                      <span className={`font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </span>
                      <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </Badge>
                      {sentTasks.has(task.id) && (
                        <Badge className="text-xs bg-primary/10 text-primary border-primary/20">Sent ✓</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      <Card className="border-dashed border-muted-foreground/30">
        <CardContent className="py-6">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Zapier Setup Guide
          </h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Create a new Zap in Zapier</li>
            <li>Choose <strong>"Webhooks by Zapier"</strong> as the trigger → <strong>"Catch Hook"</strong></li>
            <li>Copy the webhook URL and paste it above</li>
            <li>Send a test task, then continue the Zap setup</li>
            <li>Add <strong>"Monday.com → Create Item"</strong> as the action</li>
            <li>Map fields: task_name → Name, task_description → Description, task_priority → Priority, task_category → Group</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTaskExport;
