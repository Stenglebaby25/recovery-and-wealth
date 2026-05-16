import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SobrietySavingsCounter from "@/components/SobrietySavingsCounter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Heart, ArrowRight } from "lucide-react";

const FAQS = [
  {
    q: "What is a sobriety calculator?",
    a: "A sobriety calculator tracks how long you've been sober and estimates the money you've saved by not spending on alcohol or drugs. It turns recovery time into a concrete financial number, which is a powerful motivator for staying on track.",
  },
  {
    q: "How does the sobriety savings calculator work?",
    a: "Enter the date you stopped drinking or using, and the average amount you used to spend per day. The calculator multiplies your sober days by your daily spending to show your total savings, plus projections for the next month, year, and five years.",
  },
  {
    q: "Is the sobriety calculator free to use?",
    a: "Yes. The Recovery & Wealth sobriety calculator is 100% free with no signup required. Your inputs are stored locally in your browser — we never see or store your personal data.",
  },
  {
    q: "How much money do people save by quitting drinking?",
    a: "It varies, but the average heavy drinker spends $50–$100 per day on alcohol. At $50/day, one year of sobriety saves roughly $18,250 — enough to wipe out credit card debt, build an emergency fund, or fund a fresh start.",
  },
  {
    q: "Can I use this calculator for drugs, gambling, or vaping?",
    a: "Absolutely. Any recurring spending tied to addiction works — alcohol, drugs, nicotine, gambling, even DoorDash habits triggered by stress. Enter your average daily spend and the math is the same.",
  },
];

const SobrietyCalculator = () => {
  const canonical = "https://recoveryandwealth.app/sobriety-calculator";

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Sobriety Calculator — See What Quitting Saves You | Recovery & Wealth</title>
        <meta
          name="description"
          content="Free sobriety calculator. Track your sober days and see exactly how much money you've saved by quitting alcohol or drugs. No signup."
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="Sobriety Calculator — See What Quitting Saves You" />
        <meta
          property="og:description"
          content="Free sobriety calculator. Track sober days and money saved from quitting alcohol or drugs."
        />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <Navigation />

      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Calculator className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Free Sobriety Calculator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Sobriety Calculator: See What Quitting Is Really Saving You
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Track your sober days and watch the money you used to spend on alcohol or drugs add up.
              Built for people in recovery — free, private, no signup.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="container mx-auto px-4 py-10">
          <SobrietySavingsCounter />
        </section>

        {/* Why it matters */}
        <section className="container mx-auto px-4 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why a Sobriety Calculator Matters in Recovery
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Heart className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Motivation You Can See</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Recovery wins are often invisible. A growing dollar figure makes the progress tangible
                on hard days.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Proof of Compounding</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                $50 a day becomes $18,250 a year. Seeing the projection reframes sobriety as an
                investment, not a sacrifice.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Calculator className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">A Plan for the Money</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Once you can see the savings, you can give them a job — emergency fund, debt payoff,
                or your first real investment.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <Card key={f.q}>
                  <CardHeader>
                    <CardTitle className="text-lg">{f.q}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">{f.a}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Turn Sober Days Into a Financial Plan</h2>
          <p className="text-lg text-muted-foreground mb-6">
            The calculator shows what you're saving. Our course shows you what to do with it —
            budgeting, debt, and building wealth in recovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/learn">
              <Button size="lg">
                Explore the Course <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/tools">
              <Button size="lg" variant="outline">
                See All Free Tools
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SobrietyCalculator;