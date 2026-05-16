import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailQueueItem {
  id: string;
  user_id: string;
  email: string;
  email_type: string;
  scheduled_for: string;
  metadata: Record<string, any>;
}

// Email templates based on type
const emailTemplates: Record<string, { subject: string; getHtml: (data: any) => string }> = {
  foundations_complete: {
    subject: "🎉 You've Completed Foundations! Here's What's Next",
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7f7f7;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Congratulations! 🎉</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">You've completed the Foundations course!</p>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px;">Hi${data.name ? ` ${data.name}` : ''}!</p>
            <p style="font-size: 16px;">Amazing work completing the 8-week Foundations course! You've built a solid base for your financial recovery.</p>
            
            <h3 style="color: #6366f1; margin-top: 30px;">Ready for the Next Level?</h3>
            <p style="font-size: 16px;">Our Advanced modules dive deeper into topics like:</p>
            <ul style="font-size: 15px; color: #555;">
              <li>Credit Repair Strategies</li>
              <li>Debt Negotiation Tactics</li>
              <li>Building Emergency Funds</li>
              <li>Investment Fundamentals</li>
              <li>And 9 more specialized modules!</li>
            </ul>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://recovery-and-wealth.lovable.app/learning-path-quiz" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold;">
                Find Your Personalized Path →
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">Take our quick quiz to get personalized recommendations based on your situation!</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  module_reminder: {
    subject: "📚 Your Next Financial Recovery Module Awaits",
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7f7f7;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Your Next Module is Ready 📖</h1>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px;">Hi${data.name ? ` ${data.name}` : ''}!</p>
            <p style="font-size: 16px;">Based on your personalized learning path, we recommend:</p>
            
            <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 20px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #6366f1;">${data.module_title || 'Your Next Module'}</h3>
              <p style="margin: 0; font-size: 14px; color: #666;">${data.module_description || 'Continue building your financial foundation'}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://recovery-and-wealth.lovable.app/halt-lessons" style="display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
                Start Learning →
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  },
  progress_nudge: {
    subject: "💪 We Miss You! Continue Your Financial Recovery",
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7f7f7;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Your Progress is Waiting 💪</h1>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px;">Hi${data.name ? ` ${data.name}` : ''}!</p>
            <p style="font-size: 16px;">It's been a few days since you last logged in. Your financial recovery journey is important—even 10 minutes of learning can make a difference!</p>
            
            <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #92400e;">You're ${data.progress || '0'}% through your current module</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://recovery-and-wealth.lovable.app/halt-lessons" style="display: inline-block; background: #f59e0b; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
                Continue Learning →
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center;">Small steps lead to big changes. You've got this! 🌟</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  milestone_celebration: {
    subject: "🏆 You've Hit a Milestone! Celebrate Your Progress",
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7f7f7;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); color: white; padding: 40px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px;">🏆</h1>
            <h2 style="margin: 10px 0 0 0; font-size: 24px;">Milestone Achieved!</h2>
          </div>
          <div style="padding: 30px; text-align: center;">
            <p style="font-size: 18px; font-weight: bold; color: #333;">Congratulations${data.name ? `, ${data.name}` : ''}!</p>
            <p style="font-size: 16px;">${data.milestone_message || 'You reached an important milestone in your financial recovery!'}</p>
            
            <div style="background: #fdf2f8; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; font-size: 24px;">${data.badge || '⭐'}</p>
              <p style="margin: 10px 0 0 0; font-weight: bold; color: #be185d;">${data.badge_name || 'Achievement Unlocked'}</p>
            </div>
            
            <p style="font-size: 14px; color: #666;">Keep up the amazing work! Each step brings you closer to financial freedom.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  reengagement: {
    subject: "👋 We Haven't Seen You in a While - Here's What's New",
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7f7f7;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">We Miss You! 👋</h1>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px;">Hi${data.name ? ` ${data.name}` : ''}!</p>
            <p style="font-size: 16px;">It's been a while since you visited Sober Money Mindset. Your financial recovery is worth continuing!</p>
            
            <h3 style="color: #6366f1;">What's New:</h3>
            <ul style="font-size: 15px; color: #555;">
              <li>New Advanced modules on entrepreneurship & side income</li>
              <li>Personalized learning path quiz</li>
              <li>Updated resources and worksheets</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://recovery-and-wealth.lovable.app/learning-path-quiz" style="display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
                Get Your Personalized Path →
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center;">Just 15 minutes a week can transform your financial future.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  discharge_transition: {
    subject: "🌟 Your Recovery Journey Continues — Keep Your Progress!",
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7f7f7;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Your Journey Continues 🌟</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Everything you've built is still here</p>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px;">Hi${data.name ? ` ${data.name}` : ''},</p>
            <p style="font-size: 16px;">As you transition from your treatment program, we want you to know that <strong>all of your progress, journal entries, check-ins, and course work are saved and waiting for you</strong>.</p>
            
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
              <h3 style="margin: 0 0 10px 0; color: #059669;">🎁 Your ${data.trial_days || 14}-Day Free Trial</h3>
              <p style="margin: 0; font-size: 15px; color: #065f46;">You have <strong>${data.trial_days || 14} days of full premium access</strong> — same tools, same courses, same community features. No credit card required.</p>
            </div>

            <h3 style="color: #059669; margin-top: 30px;">What's Included in Premium:</h3>
            <ul style="font-size: 15px; color: #555;">
              <li>📚 All 21+ advanced financial recovery modules</li>
              <li>🧠 AI-powered financial coaching chat</li>
              <li>📊 Full dashboard with expense tracking & bill management</li>
              <li>👥 Premium community access with alumni chapters</li>
              <li>📥 Downloadable worksheets & resources</li>
            </ul>
            
            <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #64748b;">After your trial, continue for:</p>
              <p style="margin: 0; font-size: 20px; font-weight: bold; color: #059669;">$4.99/month or $49.99/year</p>
              <p style="margin: 5px 0 0 0; font-size: 13px; color: #94a3b8;">Annual plan saves you $10/year</p>
            </div>

            <div style="text-align: center; margin: 35px 0;">
              <a href="https://recovery-and-wealth.lovable.app" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Continue Your Journey →
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center;">Same login. Same data. Same progress. Just keep going. 💚</p>
          </div>
          <div style="background: #f1f5f9; padding: 20px 30px; text-align: center;">
            <p style="margin: 0; font-size: 13px; color: #94a3b8;">Questions? Reply to this email or visit our support page.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Processing email drip queue...");

    // Get pending emails that are due
    const now = new Date().toISOString();
    const { data: pendingEmails, error: fetchError } = await supabase
      .from("email_drip_queue")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_for", now)
      .limit(50);

    if (fetchError) {
      console.error("Error fetching pending emails:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${pendingEmails?.length || 0} pending emails to process`);

    if (!pendingEmails || pendingEmails.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending emails to process", processed: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let successCount = 0;
    let failCount = 0;

    for (const emailItem of pendingEmails as EmailQueueItem[]) {
      try {
        const template = emailTemplates[emailItem.email_type];
        
        if (!template) {
          console.error(`Unknown email type: ${emailItem.email_type}`);
          continue;
        }

        // Get user profile for personalization
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", emailItem.user_id)
          .single();

        const templateData = {
          name: profile?.full_name,
          ...emailItem.metadata
        };

        // Send email
        const { error: sendError } = await resend.emails.send({
          from: "Sober Money Mindset <courses@yourdomain.com>",
          to: [emailItem.email],
          subject: template.subject,
          html: template.getHtml(templateData)
        });

        if (sendError) {
          throw sendError;
        }

        // Mark as sent
        await supabase
          .from("email_drip_queue")
          .update({ 
            status: "sent", 
            sent_at: new Date().toISOString() 
          })
          .eq("id", emailItem.id);

        successCount++;
        console.log(`Sent email to ${emailItem.email} (type: ${emailItem.email_type})`);

      } catch (emailError) {
        console.error(`Failed to send email ${emailItem.id}:`, emailError);
        
        // Mark as failed
        await supabase
          .from("email_drip_queue")
          .update({ status: "failed" })
          .eq("id", emailItem.id);

        failCount++;
      }
    }

    console.log(`Email processing complete. Success: ${successCount}, Failed: ${failCount}`);

    return new Response(
      JSON.stringify({ 
        message: "Email processing complete",
        processed: pendingEmails.length,
        success: successCount,
        failed: failCount
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in process-email-drip function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
