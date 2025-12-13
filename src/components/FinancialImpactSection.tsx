import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

const FinancialImpactSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
            See the difference
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The True Financial Impact of Recovery
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            15-year projections showing what's possible when you choose healing over harm
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Annual Drain Visualization */}
          <Card className="overflow-hidden border-destructive/20 hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-destructive/10 to-orange-100/50 dark:from-destructive/20 dark:to-orange-900/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                  <ArrowDown className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-destructive">
                    The Annual Drain
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Money that could transform your future
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <img 
                src="/learning-resources/Annual_Drain_SVG.svg" 
                alt="Annual financial drain from substance use showing yearly costs and 15-year totals"
                className="w-full h-auto"
              />
            </CardContent>
          </Card>

          {/* Power of Potential Visualization */}
          <Card className="overflow-hidden border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-green-100/50 dark:from-primary/20 dark:to-green-900/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <ArrowUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-primary">
                    The Power of Potential
                  </CardTitle>
                  <CardDescription className="text-sm">
                    When those dollars are invested instead
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <img 
                src="/learning-resources/Power_of_Potential_design.svg" 
                alt="Power of potential showing investment growth over 15 years when money is saved instead of spent on substances"
                className="w-full h-auto"
              />
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-muted-foreground mt-8 max-w-xl mx-auto text-sm">
          Recovery isn't just about getting your life back — it's about unlocking financial freedom you never thought possible.
        </p>
      </div>
    </section>
  );
};

export default FinancialImpactSection;