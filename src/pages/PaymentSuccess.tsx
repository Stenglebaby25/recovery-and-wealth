import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(true);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const updateSubscriptionStatus = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        // Check subscription status to update user profile
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.error('Error checking subscription:', error);
          toast({
            title: "Warning",
            description: "Payment successful, but there was an issue updating your account. Please contact support if needed.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Payment Successful!",
            description: "Your subscription has been activated. Welcome to Recovery Wealth!",
          });
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Payment Successful",
          description: "Your payment was processed successfully!",
        });
      } finally {
        setIsUpdating(false);
      }
    };

    updateSubscriptionStatus();
  }, [user, navigate, toast]);

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-primary">
                  Payment Successful!
                </CardTitle>
                <CardDescription className="text-lg">
                  Welcome to Recovery Wealth! Your subscription has been activated.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {sessionId && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      Transaction ID: <span className="font-mono">{sessionId}</span>
                    </p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">What's Next?</h3>
                  <ul className="text-left space-y-2 text-muted-foreground">
                    <li>• Access to all premium courses and resources</li>
                    <li>• Personalized financial recovery dashboard</li>
                    <li>• Habit tracking and mood journaling tools</li>
                    <li>• Community support and coaching sessions</li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button 
                    onClick={() => navigate('/')} 
                    className="flex-1"
                    disabled={isUpdating}
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/tools')} 
                    className="flex-1"
                    disabled={isUpdating}
                  >
                    Explore Tools
                  </Button>
                </div>
                
                {isUpdating && (
                  <p className="text-sm text-muted-foreground">
                    Updating your account status...
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;