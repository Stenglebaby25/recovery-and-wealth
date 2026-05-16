import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  fullName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName }: WelcomeEmailRequest = await req.json();
    
    console.log(`Sending welcome email to: ${email}`);

    const emailResponse = await resend.emails.send({
      from: "Sober Money Mindset <welcome@yourdomain.com>",
      to: [email],
      subject: "Welcome to Your Sober Money Mindset Journey! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Welcome to Sober Money Mindset</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7f7f7;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Welcome to Sober Money Mindset!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your journey to financial recovery starts now</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #6366f1; margin: 0 0 20px 0; font-size: 24px;">Hi${fullName ? ` ${fullName}` : ''}! 👋</h2>
              
              <p style="margin: 0 0 20px 0; font-size: 16px;">
                Congratulations on taking this powerful step toward transforming your relationship with money in recovery! 
                We're thrilled to have you join our community of people committed to building wealth while staying sober.
              </p>
              
              <h3 style="color: #333; margin: 30px 0 15px 0; font-size: 20px;">What's next? 🚀</h3>
              
              <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 20px; margin: 20px 0; border-radius: 0 4px 4px 0;">
                <h4 style="margin: 0 0 10px 0; color: #6366f1; font-size: 16px;">🎯 Explore Your Dashboard</h4>
                <p style="margin: 0; font-size: 14px; color: #666;">Access personalized tools, track your progress, and start building healthy financial habits.</p>
              </div>
              
              <div style="background-color: #f8fafc; border-left: 4px solid #8b5cf6; padding: 20px; margin: 20px 0; border-radius: 0 4px 4px 0;">
                <h4 style="margin: 0 0 10px 0; color: #8b5cf6; font-size: 16px;">📚 Download Free Resources</h4>
                <p style="margin: 0; font-size: 14px; color: #666;">Get instant access to our Recovery & Wealth Guide and money mindset worksheets.</p>
              </div>
              
              <div style="background-color: #f8fafc; border-left: 4px solid #06b6d4; padding: 20px; margin: 20px 0; border-radius: 0 4px 4px 0;">
                <h4 style="margin: 0 0 10px 0; color: #06b6d4; font-size: 16px;">🏆 Track Your Progress</h4>
                <p style="margin: 0; font-size: 14px; color: #666;">Use our habit tracker and progress dashboard to stay motivated on your journey.</p>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://your-app-url.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Go to Dashboard →
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0;">
              
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Need support? We're here for you! 💙</h3>
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                • Join our community discussions<br>
                • Book a 1-on-1 coaching session<br>
                • Access our premium courses and tools
              </p>
              
              <p style="margin: 30px 0 0 0; font-size: 14px; color: #666;">
                Remember: Recovery is a journey, and building wealth is a marathon, not a sprint. 
                We're honored to be part of your story.
              </p>
              
              <p style="margin: 20px 0 0 0; font-size: 16px; font-weight: bold; color: #6366f1;">
                Here's to your sober wealth journey! 🌟
              </p>
              
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
                The Sober Money Mindset Team
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                You're receiving this email because you signed up for Sober Money Mindset.
                <br>
                <a href="#" style="color: #6366f1; text-decoration: none;">Unsubscribe</a> | 
                <a href="#" style="color: #6366f1; text-decoration: none;">Contact Us</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Welcome email sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);