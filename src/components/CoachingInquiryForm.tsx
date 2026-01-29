import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useLeadCapture } from '@/hooks/useLeadCapture';

interface CoachingInquiryFormProps {
  preselectedTopic?: string;
}

export const CoachingInquiryForm = ({ preselectedTopic }: CoachingInquiryFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(preselectedTopic ? `I'm interested in: ${preselectedTopic}\n\n` : '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { captureLead, isSubmitting } = useLeadCapture();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;

    const result = await captureLead({
      email: email.trim(),
      leadType: 'coaching_interest',
      sourcePage: '/coaching',
      metadata: { 
        name: name.trim(),
        message: message.trim(),
        preselected_topic: preselectedTopic || null
      }
    });

    if (result.success) {
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  if (isSubmitted) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">Message Received!</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for reaching out. One of our coaches will get back to you within 24-48 hours.
          </p>
          <Button variant="outline" onClick={() => setIsSubmitted(false)}>
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-medium">
      <CardHeader className="text-center pb-4">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4 mx-auto">
          <MessageSquare className="w-7 h-7 text-primary" />
        </div>
        <CardTitle className="text-2xl">Have Questions? Let's Chat</CardTitle>
        <CardDescription className="text-base">
          Not sure which option is right for you? Send us a message and we'll help you find the best fit for your recovery journey.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inquiry-name">Name (optional)</Label>
              <Input
                id="inquiry-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inquiry-email">Email *</Label>
              <Input
                id="inquiry-email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inquiry-message">Your Message *</Label>
            <Textarea
              id="inquiry-message"
              placeholder="Tell us about your situation, questions, or what you're hoping to achieve..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/1000 characters
            </p>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>Sending...</>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            We respect your privacy. Your information is never shared.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
