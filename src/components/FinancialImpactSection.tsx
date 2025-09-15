import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FinancialImpactSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            The True Financial Impact of Recovery
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See the real cost of addiction versus the powerful potential of recovery. 
            These 15-year projections show what's possible when we choose healing over harm.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Annual Drain Visualization */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-destructive/10 to-orange-100/50 dark:from-destructive/20 dark:to-orange-900/20">
              <CardTitle className="text-2xl font-bold text-destructive">
                The Annual Drain
              </CardTitle>
              <CardDescription className="text-base">
                The true cost of substances - money that could transform your future
              </CardDescription>
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
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-green-100/50 dark:from-primary/20 dark:to-green-900/20">
              <CardTitle className="text-2xl font-bold text-primary">
                The Power of Potential
              </CardTitle>
              <CardDescription className="text-base">
                What happens when those same dollars are invested in your future
              </CardDescription>
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

        <div className="text-center mt-12">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Recovery isn't just about getting your life back - it's about unlocking financial freedom you never thought possible. 
            The path to wealth starts with the decision to heal.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinancialImpactSection;