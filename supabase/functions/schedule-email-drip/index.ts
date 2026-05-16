import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScheduleEmailRequest {
  user_id: string;
  email: string;
  email_type: "foundations_complete" | "module_reminder" | "progress_nudge" | "milestone_celebration" | "reengagement" | "discharge_transition";
  delay_days?: number; // Days from now to schedule
  metadata?: Record<string, any>;
}

interface DripSequence {
  type: string;
  delay_days: number;
  metadata?: Record<string, any>;
}

// Standard drip sequences for different triggers
const FOUNDATIONS_COMPLETE_SEQUENCE: DripSequence[] = [
  { type: "foundations_complete", delay_days: 0 }, // Immediate
  { type: "module_reminder", delay_days: 3, metadata: { module_title: "Credit Repair in Recovery", module_description: "Learn proven strategies to rebuild your credit score." } },
  { type: "module_reminder", delay_days: 7, metadata: { module_title: "Debt Negotiation Strategies", module_description: "Master the art of settling debts for less." } },
  { type: "progress_nudge", delay_days: 14 },
  { type: "reengagement", delay_days: 30 }
];

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    
    // Handle both single email and sequence scheduling
    if (body.trigger === "foundations_complete") {
      // Schedule the full drip sequence for foundations completion
      const { user_id, email } = body;
      
      if (!user_id || !email) {
        return new Response(
          JSON.stringify({ error: "user_id and email are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Scheduling foundations complete sequence for user ${user_id}`);

      const now = new Date();
      const emailsToInsert = FOUNDATIONS_COMPLETE_SEQUENCE.map(seq => ({
        user_id,
        email,
        email_type: seq.type,
        scheduled_for: new Date(now.getTime() + seq.delay_days * 24 * 60 * 60 * 1000).toISOString(),
        metadata: seq.metadata || {},
        status: "pending"
      }));

      const { error } = await supabase
        .from("email_drip_queue")
        .insert(emailsToInsert);

      if (error) {
        console.error("Error scheduling drip sequence:", error);
        throw error;
      }

      console.log(`Scheduled ${emailsToInsert.length} emails for drip sequence`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Scheduled ${emailsToInsert.length} emails in drip sequence`,
          scheduled: emailsToInsert.length
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle single email scheduling
    const { user_id, email, email_type, delay_days = 0, metadata = {} }: ScheduleEmailRequest = body;

    if (!user_id || !email || !email_type) {
      return new Response(
        JSON.stringify({ error: "user_id, email, and email_type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const scheduledFor = new Date(Date.now() + delay_days * 24 * 60 * 60 * 1000).toISOString();

    console.log(`Scheduling ${email_type} email for ${email} at ${scheduledFor}`);

    const { error } = await supabase
      .from("email_drip_queue")
      .insert({
        user_id,
        email,
        email_type,
        scheduled_for: scheduledFor,
        metadata,
        status: "pending"
      });

    if (error) {
      console.error("Error scheduling email:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email scheduled for ${scheduledFor}`,
        scheduled_for: scheduledFor
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in schedule-email-drip function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
