import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type LeadType = 'guide_download' | 'coaching_interest' | 'community_join' | 'newsletter_signup';

interface LeadData {
  email: string;
  leadType: LeadType;
  sourcePage?: string;
  metadata?: Record<string, any>;
}

export function useLeadCapture() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const captureLead = async ({ email, leadType, sourcePage, metadata }: LeadData) => {
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

      if (error) {
        throw error;
      }

      // Show success notification based on lead type
      const messages = {
        guide_download: {
          title: "Guide Download Started!",
          description: "Check your email for the download link. Welcome to our community!"
        },
        coaching_interest: {
          title: "Interest Registered!",
          description: "We'll contact you soon about our coaching programs."
        },
        community_join: {
          title: "Welcome to the Community!",
          description: "You'll receive an invitation link shortly."
        },
        newsletter_signup: {
          title: "Subscribed Successfully!",
          description: "You'll receive our latest updates and insights."
        }
      };

      toast({
        title: messages[leadType].title,
        description: messages[leadType].description,
      });

      return { success: true };
    } catch (error) {
      console.error('Error capturing lead:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    captureLead,
    isSubmitting
  };
}