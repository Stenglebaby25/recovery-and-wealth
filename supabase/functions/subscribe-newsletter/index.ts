import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
  sourcePage?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, sourcePage }: SubscribeRequest = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const beehiivApiKey = Deno.env.get("BEEHIIV_API_KEY");
    const publicationId = Deno.env.get("BEEHIIV_PUBLICATION_ID");

    if (!beehiivApiKey || !publicationId) {
      console.error("Missing Beehiiv configuration");
      return new Response(
        JSON.stringify({ error: "Newsletter service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Subscribe to Beehiiv
    console.log(`Subscribing ${email} to Beehiiv publication ${publicationId}`);
    
    const beehiivResponse = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${beehiivApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          reactivate_existing: true,
          send_welcome_email: true,
        }),
      }
    );

    const beehiivData = await beehiivResponse.json();
    console.log("Beehiiv response:", JSON.stringify(beehiivData));

    if (!beehiivResponse.ok) {
      console.error("Beehiiv API error:", beehiivData);
      return new Response(
        JSON.stringify({ error: "Failed to subscribe to newsletter" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Also save to local leads table
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("leads").insert({
      email,
      lead_type: "newsletter_signup",
      source_page: sourcePage || "/",
      metadata: { beehiiv_subscription_id: beehiivData.data?.id },
    });

    console.log(`Successfully subscribed ${email} to newsletter`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Successfully subscribed to newsletter" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in subscribe-newsletter function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
