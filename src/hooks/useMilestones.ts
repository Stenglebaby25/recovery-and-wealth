import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface Milestone {
  id: string;
  type: 'recovery' | 'financial' | 'combined';
  name: string;
  description: string;
  targetDays?: number;
  targetAmount?: number;
  icon: string;
  badgeColor: string;
  points: number;
  isEarned: boolean;
  earnedAt?: string;
  progress: number;
}

interface UserMilestoneData {
  sobrietyStartDate: Date | null;
  dailySpendingBeforeRecovery: number;
  totalSaved: number;
  currentStreak: number;
}

const RECOVERY_MILESTONES = [
  { days: 1, name: "Day One", description: "Your first day of financial clarity", icon: "🌱", points: 10 },
  { days: 7, name: "One Week Strong", description: "A full week of mindful spending", icon: "🌿", points: 25 },
  { days: 14, name: "Two Weeks Clear", description: "Building healthy money habits", icon: "🌳", points: 50 },
  { days: 30, name: "30 Days Sober", description: "One month of financial freedom", icon: "🏆", points: 100 },
  { days: 60, name: "60 Days Strong", description: "Two months of recovery wealth", icon: "⭐", points: 150 },
  { days: 90, name: "90 Days Clear", description: "Quarter year milestone achieved", icon: "💎", points: 200 },
  { days: 180, name: "Six Months Free", description: "Half year of transformation", icon: "🎯", points: 300 },
  { days: 365, name: "One Year Anniversary", description: "A full year of recovery wealth", icon: "👑", points: 500 },
];

const FINANCIAL_MILESTONES = [
  { amount: 50, name: "First $50 Saved", description: "Your savings journey begins", icon: "💰", points: 15 },
  { amount: 100, name: "$100 Milestone", description: "Triple digits achieved", icon: "💵", points: 30 },
  { amount: 250, name: "Quarter Grand", description: "$250 protected from old habits", icon: "🏦", points: 50 },
  { amount: 500, name: "Half Grand Club", description: "$500 in your future", icon: "💸", points: 75 },
  { amount: 1000, name: "Thousand Dollar Win", description: "Four figures saved", icon: "🎉", points: 150 },
  { amount: 2500, name: "Emergency Fund Start", description: "Building real security", icon: "🛡️", points: 200 },
  { amount: 5000, name: "Five Grand Freedom", description: "Serious wealth building", icon: "🚀", points: 300 },
  { amount: 10000, name: "Five Figure Saver", description: "$10,000 life change", icon: "🌟", points: 500 },
];

export const useMilestones = () => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [userData, setUserData] = useState<UserMilestoneData>({
    sobrietyStartDate: null,
    dailySpendingBeforeRecovery: 50, // Default estimate
    totalSaved: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [newlyEarnedMilestone, setNewlyEarnedMilestone] = useState<Milestone | null>(null);

  const calculateMilestones = useCallback((data: UserMilestoneData, earnedAchievements: string[]) => {
    const allMilestones: Milestone[] = [];
    const daysSober = data.sobrietyStartDate 
      ? Math.floor((Date.now() - data.sobrietyStartDate.getTime()) / (1000 * 60 * 60 * 24))
      : data.currentStreak;

    // Recovery milestones
    RECOVERY_MILESTONES.forEach((m, idx) => {
      const progress = Math.min(100, (daysSober / m.days) * 100);
      const isEarned = daysSober >= m.days;
      
      allMilestones.push({
        id: `recovery_${m.days}`,
        type: 'recovery',
        name: m.name,
        description: m.description,
        targetDays: m.days,
        icon: m.icon,
        badgeColor: isEarned ? 'bg-success' : 'bg-muted',
        points: m.points,
        isEarned,
        progress,
      });
    });

    // Financial milestones based on estimated savings
    const estimatedSavings = daysSober * data.dailySpendingBeforeRecovery;
    
    FINANCIAL_MILESTONES.forEach((m) => {
      const progress = Math.min(100, (estimatedSavings / m.amount) * 100);
      const isEarned = estimatedSavings >= m.amount;
      
      allMilestones.push({
        id: `financial_${m.amount}`,
        type: 'financial',
        name: m.name,
        description: `${m.description} - Est. $${estimatedSavings.toLocaleString()} saved`,
        targetAmount: m.amount,
        icon: m.icon,
        badgeColor: isEarned ? 'bg-primary' : 'bg-muted',
        points: m.points,
        isEarned,
        progress,
      });
    });

    // Combined milestones (linking recovery to financial wins)
    const combinedMilestones = [
      { days: 30, multiplier: 1, name: "Month of Freedom", description: `30 days = ~$${(30 * data.dailySpendingBeforeRecovery).toLocaleString()} saved`, icon: "🎊", points: 125 },
      { days: 90, multiplier: 1, name: "Quarter Year Wealth", description: `90 days = ~$${(90 * data.dailySpendingBeforeRecovery).toLocaleString()} saved`, icon: "💫", points: 250 },
      { days: 365, multiplier: 1, name: "Year of Prosperity", description: `365 days = ~$${(365 * data.dailySpendingBeforeRecovery).toLocaleString()} saved`, icon: "🏅", points: 600 },
    ];

    combinedMilestones.forEach((m) => {
      const progress = Math.min(100, (daysSober / m.days) * 100);
      const isEarned = daysSober >= m.days;
      
      allMilestones.push({
        id: `combined_${m.days}`,
        type: 'combined',
        name: m.name,
        description: m.description,
        targetDays: m.days,
        icon: m.icon,
        badgeColor: isEarned ? 'bg-accent' : 'bg-muted',
        points: m.points,
        isEarned,
        progress,
      });
    });

    return allMilestones;
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch daily check-ins to calculate streak
      const { data: checkins } = await supabase
        .from('daily_checkins')
        .select('check_in_date, sobriety_status')
        .eq('user_id', user.id)
        .order('check_in_date', { ascending: false });

      // Fetch user achievements
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id);

      // Calculate streak from check-ins
      let streak = 0;
      if (checkins && checkins.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        let currentDate = new Date(today);
        
        for (const checkin of checkins) {
          const checkinDate = new Date(checkin.check_in_date).toISOString().split('T')[0];
          const expectedDate = currentDate.toISOString().split('T')[0];
          
          if (checkinDate === expectedDate && checkin.sobriety_status !== 'struggling') {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }
      }

      const updatedData: UserMilestoneData = {
        sobrietyStartDate: checkins && checkins.length > 0 
          ? new Date(checkins[checkins.length - 1].check_in_date)
          : null,
        dailySpendingBeforeRecovery: 50, // Could be user-configured
        totalSaved: streak * 50,
        currentStreak: streak,
      };

      setUserData(updatedData);
      
      const earnedIds = achievements?.map(a => a.achievement_id) || [];
      const calculatedMilestones = calculateMilestones(updatedData, earnedIds);
      setMilestones(calculatedMilestones);
      
    } catch (error) {
      console.error('Error fetching milestone data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, calculateMilestones]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const celebrateMilestone = (milestone: Milestone) => {
    setNewlyEarnedMilestone(milestone);
  };

  const clearCelebration = () => {
    setNewlyEarnedMilestone(null);
  };

  const getNextMilestone = (type?: 'recovery' | 'financial' | 'combined') => {
    const filtered = type 
      ? milestones.filter(m => m.type === type && !m.isEarned)
      : milestones.filter(m => !m.isEarned);
    return filtered.sort((a, b) => a.progress - b.progress).reverse()[0];
  };

  const getEarnedMilestones = () => milestones.filter(m => m.isEarned);
  
  const getTotalPoints = () => milestones
    .filter(m => m.isEarned)
    .reduce((sum, m) => sum + m.points, 0);

  return {
    milestones,
    userData,
    loading,
    newlyEarnedMilestone,
    celebrateMilestone,
    clearCelebration,
    getNextMilestone,
    getEarnedMilestones,
    getTotalPoints,
    refetch: fetchUserData,
  };
};
