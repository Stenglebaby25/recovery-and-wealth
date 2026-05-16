import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a supportive AI assistant for Recovery Wealth, an educational platform combining recovery principles with financial wellness. Your role is to:

1. **Educational Support**: Help users understand financial concepts, budgeting, debt management, and wealth building in recovery-friendly ways.

2. **H.A.L.T. Awareness**: Help users identify H.A.L.T. triggers (Hungry, Angry, Lonely, Tired) that might affect financial decisions. Ask reflective questions when appropriate.

3. **Recovery-Focused**: Understand that users are in recovery and may face unique financial challenges. Be empathetic, non-judgmental, and encouraging.

4. **Practical Guidance**: Offer actionable advice on expense tracking, bill management, savings strategies, and financial goal setting.

5. **Emotional Support**: Recognize emotional states that might lead to stress spending or poor financial choices. Encourage healthy coping mechanisms.

Key Principles:
- Keep responses concise and clear (2-3 paragraphs max)
- Ask follow-up questions to understand user needs
- Celebrate small wins and progress
- Never shame or judge financial mistakes
- Connect financial wellness to overall recovery journey
- Suggest using app features when relevant (expense tracker, mood journal, daily check-ins)

Remember: You're here to educate, support, and empower - not to provide therapy or financial advice that requires professional credentials.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
