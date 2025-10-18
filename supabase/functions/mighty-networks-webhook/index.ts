import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Mighty Networks webhook triggered");

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const payload = await req.json();
    console.log("Webhook payload:", payload);

    // Extract user data from the webhook payload
    const { email, user_id, full_name, event_type } = payload;

    if (!email) {
      throw new Error("Email is required in webhook payload");
    }

    // Handle different event types
    if (event_type === 'user_signup' || event_type === 'user_created') {
      // Get user from Supabase auth by email
      const { data: authUsers } = await supabaseClient.auth.admin.listUsers();
      const existingUser = authUsers?.users.find(u => u.email === email);

      if (existingUser) {
        // Update profile to link with Mighty Networks
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({
            full_name: full_name || existingUser.user_metadata?.full_name,
          })
          .eq('user_id', existingUser.id);

        if (updateError) {
          console.error("Error updating profile:", updateError);
          throw updateError;
        }

        console.log("User profile updated with Mighty Networks data");
      } else {
        console.log("User not found in Recovery & Wealth app - they need to sign up first");
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Webhook processed successfully",
          user_exists: !!existingUser,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Handle other event types as needed
    return new Response(
      JSON.stringify({
        success: true,
        message: "Event received but not processed",
        event_type,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
