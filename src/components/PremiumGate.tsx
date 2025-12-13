import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PremiumGateProps {
  children: ReactNode;
  feature: string;
  description?: string;
  benefits?: string[];
}

const PremiumGate = ({ children, feature, description, benefits }: PremiumGateProps) => {
  const { user, isPremium } = useAuth();

  // If user is premium, show the children
  if (isPremium) {
    return <>{children}</>;
  }

  // If not logged in
  if (!user) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{feature}</CardTitle>
          <CardDescription className="text-base">
            {description || "Sign in to access this premium feature"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <Link to="/auth">
            <Button size="lg" className="w-full max-w-xs">
              Sign In to Continue
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/auth" className="text-primary hover:underline">
              Sign up free
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  // User is logged in but not premium - show upgrade prompt
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-amber-500/5 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-amber-600/10 rounded-bl-full" />
      
      <CardHeader className="text-center pb-4 relative">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
          <Crown className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Unlock {feature}
          <Sparkles className="w-5 h-5 text-amber-500" />
        </CardTitle>
        <CardDescription className="text-base max-w-md mx-auto">
          {description || "Upgrade to Premium to access this powerful feature and take control of your financial recovery."}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {benefits && benefits.length > 0 && (
          <div className="bg-background/50 rounded-xl p-6 max-w-md mx-auto">
            <h4 className="font-semibold mb-4 text-center">What you'll get:</h4>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="text-center space-y-3">
          <Link to="/pricing">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground">
            Start with a 14-day free trial • Cancel anytime
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumGate;
