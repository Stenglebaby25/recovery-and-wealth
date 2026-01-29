import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { HelpCircle, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const FooterContactForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          email: email.trim(),
          lead_type: 'coaching_interest',
          source_page: 'footer_contact',
          metadata: { 
            message: message.trim(),
            form_type: 'general_inquiry'
          }
        });

      if (error) throw error;

      setIsSubmitted(true);
      setEmail('');
      setMessage('');
      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
      });
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 text-center">
          <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">Thanks! We'll be in touch.</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-xs"
            onClick={() => setIsSubmitted(false)}
          >
            Send another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">Questions?</h3>
        </div>
        <p className="text-muted-foreground text-xs mb-3">
          Not sure where to start? Send us a quick message.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="footer-email" className="sr-only">Email</Label>
            <Input
              id="footer-email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-sm"
              maxLength={255}
            />
          </div>
          <div>
            <Label htmlFor="footer-message" className="sr-only">Message</Label>
            <Textarea
              id="footer-message"
              placeholder="How can we help?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={2}
              className="text-sm resize-none"
              maxLength={500}
            />
          </div>
          <Button type="submit" size="sm" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : (
              <>
                <Send className="w-3 h-3 mr-1" />
                Send
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
