import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

type LeadType = 'guide_download' | 'coaching_interest' | 'community_join' | 'newsletter_signup';

export const useLeadCapture = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const captureLead = async (
    email: string, 
    leadType: LeadType, 
    sourcePage?: string,
    metadata?: Record<string, any>
  ) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          email,
          lead_type: leadType,
          source_page: sourcePage || window.location.pathname,
          metadata: metadata || {}
        });

      if (error) throw error;

      // Show success message based on lead type
      const successMessages = {
        guide_download: 'Success! Check your email for the free guide download link.',
        coaching_interest: 'Thank you for your interest! We\'ll contact you soon about coaching options.',
        community_join: 'Welcome to our community! You\'ll receive an invite shortly.',
        newsletter_signup: 'Successfully subscribed! Welcome to our newsletter.'
      };

      toast({
        title: "Success!",
        description: successMessages[leadType],
        duration: 5000,
      });

      return { success: true };
    } catch (error) {
      console.error('Lead capture error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubscriptionSuccess = () => {
    // Navigate to dashboard after successful subscription
    if (user) {
      window.location.href = '/';
      toast({
        title: "Welcome to Premium!",
        description: "You now have access to all premium content and features.",
        duration: 5000,
      });
    }
  };

  return {
    captureLead,
    handleSubscriptionSuccess,
    isSubmitting
  };
};