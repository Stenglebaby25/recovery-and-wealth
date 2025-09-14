import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Star, Award, ShoppingBag, GraduationCap, Users } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Reward {
  id: string;
  title: string;
  description: string;
  reward_type: string;
  points_required: number;
  value: string;
  category: string;
  is_active: boolean;
  max_redemptions?: number;
  current_redemptions: number;
}

interface UserRedemption {
  id: string;
  reward_id: string;
  points_spent: number;
  redeemed_at: string;
  status: string;
  redemption_code?: string;
  rewards: {
    title: string;
    value: string;
  };
}

const RewardsCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [redemptions, setRedemptions] = useState<UserRedemption[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryIcons = {
    coaching: Users,
    recovery_tools: Award,
    gift_cards: Gift,
    education: GraduationCap,
    workshops: Users,
    physical_items: ShoppingBag
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Gift;
    return <IconComponent className="h-6 w-6" />;
  };

  useEffect(() => {
    if (user) {
      fetchRewards();
      fetchUserPoints();
      fetchUserRedemptions();
    }
  }, [user]);

  const fetchRewards = async () => {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true)
      .order('points_required', { ascending: true });

    if (error) {
      console.error('Error fetching rewards:', error);
      return;
    }

    setRewards(data || []);
  };

  const fetchUserPoints = async () => {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        achievements (points)
      `)
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error fetching user points:', error);
      return;
    }

    const totalPoints = data?.reduce((sum, achievement) => {
      return sum + (achievement.achievements?.points || 0);
    }, 0) || 0;

    setUserPoints(totalPoints);
  };

  const fetchUserRedemptions = async () => {
    const { data, error } = await supabase
      .from('user_reward_redemptions')
      .select(`
        *,
        rewards (title, value)
      `)
      .eq('user_id', user?.id)
      .order('redeemed_at', { ascending: false });

    if (error) {
      console.error('Error fetching redemptions:', error);
      return;
    }

    setRedemptions(data || []);
    setLoading(false);
  };

  const redeemReward = async (reward: Reward) => {
    if (!user) return;

    if (userPoints < reward.points_required) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.points_required - userPoints} more points to redeem this reward.`,
        variant: "destructive"
      });
      return;
    }

    const redemptionCode = `RW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const { error } = await supabase
      .from('user_reward_redemptions')
      .insert({
        user_id: user.id,
        reward_id: reward.id,
        points_spent: reward.points_required,
        redemption_code: redemptionCode,
        status: 'pending'
      });

    if (error) {
      toast({
        title: "Redemption Failed",
        description: "There was an error processing your redemption. Please try again.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reward Redeemed!",
      description: `Your redemption code is: ${redemptionCode}. Check your redemptions tab for details.`
    });

    // Refresh data
    fetchUserPoints();
    fetchUserRedemptions();
  };

  const groupedRewards = rewards.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, Reward[]>);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            Your Recovery Points
          </CardTitle>
          <CardDescription>
            Earn points through achievements and redeem them for exclusive rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{userPoints} Points</div>
        </CardContent>
      </Card>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Available Rewards</TabsTrigger>
          <TabsTrigger value="history">My Redemptions</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          {Object.entries(groupedRewards).map(([category, categoryRewards]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 capitalize">
                {getCategoryIcon(category)}
                {category.replace('_', ' ')}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryRewards.map((reward) => {
                  const canAfford = userPoints >= reward.points_required;
                  const isAvailable = !reward.max_redemptions || reward.current_redemptions < reward.max_redemptions;
                  
                  return (
                    <Card key={reward.id} className={`transition-all hover:shadow-md ${!canAfford ? 'opacity-60' : ''}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{reward.title}</CardTitle>
                          <Badge variant={canAfford ? "default" : "secondary"}>
                            {reward.points_required} pts
                          </Badge>
                        </div>
                        <CardDescription>{reward.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium text-primary">
                            Value: {reward.value}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => redeemReward(reward)}
                            disabled={!canAfford || !isAvailable}
                          >
                            {!canAfford ? 'Need More Points' : 'Redeem'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {redemptions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No redemptions yet. Start earning points to unlock rewards!</p>
              </CardContent>
            </Card>
          ) : (
            redemptions.map((redemption) => (
              <Card key={redemption.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{redemption.rewards.title}</CardTitle>
                    <Badge variant={redemption.status === 'pending' ? 'secondary' : 'default'}>
                      {redemption.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Redeemed on {new Date(redemption.redeemed_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Points Spent:</span>
                      <span>{redemption.points_spent}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Value:</span>
                      <span>{redemption.rewards.value}</span>
                    </div>
                    {redemption.redemption_code && (
                      <div className="flex justify-between text-sm">
                        <span>Code:</span>
                        <span className="font-mono bg-muted px-2 py-1 rounded">
                          {redemption.redemption_code}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RewardsCenter;