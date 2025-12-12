import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Sparkles, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: { email, sourcePage: window.location.pathname },
      });

      if (error) throw error;

      setIsSubscribed(true);
      setEmail('');
      toast({
        title: "You're in!",
        description: "Welcome to the Recovery & Wealth community. Check your inbox!",
      });
    } catch (error: any) {
      console.error('Newsletter signup error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-foreground mb-2">You're Subscribed!</h3>
          <p className="text-muted-foreground">
            Check your inbox for a welcome email. We're excited to have you!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Stay Connected</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          Weekly insights on recovery, financial wellness, and building a life you're proud of.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={isSubmitting} className="shrink-0">
            {isSubmitting ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-3">
          No spam, ever. Unsubscribe anytime.
        </p>
      </CardContent>
    </Card>
  );
};
