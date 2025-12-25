import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verify the requesting user is an admin
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user has admin role
    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, full_name, organization_id, sponsored_months } = await req.json();

    if (!email || !organization_id) {
      return new Response(JSON.stringify({ error: "Email and organization_id are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check organization exists and has available seats
    const { data: org, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("id, name, seat_count, seats_used, is_active")
      .eq("id", organization_id)
      .single();

    if (orgError || !org) {
      return new Response(JSON.stringify({ error: "Organization not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!org.is_active) {
      return new Response(JSON.stringify({ error: "Organization is not active" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (org.seats_used >= org.seat_count) {
      return new Response(JSON.stringify({ error: "No available seats in this organization" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate sponsored_until date
    const sponsoredUntil = new Date();
    sponsoredUntil.setMonth(sponsoredUntil.getMonth() + (parseInt(sponsored_months) || 12));

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    let userId = existingUsers?.users.find((u) => u.email === email)?.id;

    if (!userId) {
      // Create new user with temporary password
      const tempPassword = crypto.randomUUID().slice(0, 12) + "Aa1!";
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { full_name: full_name || email },
      });

      if (createError) {
        console.error("Create user error:", createError);
        return new Response(JSON.stringify({ error: createError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      userId = newUser.user?.id;

      // Send password reset email so they can set their own password
      await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email,
      });
    }

    // Update profile with sponsorship
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        organization_id,
        sponsored_until: sponsoredUntil.toISOString(),
        subscription_status: "premium",
        full_name: full_name || null,
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Add to organization_members (triggers seat increment)
    const { error: memberError } = await supabaseAdmin
      .from("organization_members")
      .upsert({
        user_id: userId,
        organization_id,
        role: "member",
      }, { onConflict: "user_id,organization_id" });

    if (memberError) {
      console.error("Member insert error:", memberError);
      // Don't fail the whole request, just log it
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Client added successfully",
        user_id: userId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
