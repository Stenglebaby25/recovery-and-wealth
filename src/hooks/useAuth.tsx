import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string, accessCode?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only synchronous state updates here
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer Supabase calls with setTimeout
        if (session?.user) {
          setTimeout(async () => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            setProfile(profileData);
          }, 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string, accessCode?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: fullName ? { full_name: fullName } : undefined
      }
    });

    // If signup successful and access code provided, link to organization
    if (!error && authData.user && accessCode) {
      try {
        // Find organization by access code
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('id, seat_count, seats_used')
          .eq('access_code', accessCode)
          .eq('is_active', true)
          .eq('subscription_active', true)
          .single();

        if (orgError) throw new Error('Invalid access code');
        if (org.seats_used >= org.seat_count) {
          throw new Error('No available seats for this organization');
        }

        // Get or create profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', authData.user.id)
          .single();

        if (profileData) {
          // Update profile with organization
          await supabase
            .from('profiles')
            .update({
              organization_id: org.id,
              sponsored_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
              subscription_status: 'premium'
            })
            .eq('user_id', authData.user.id);

          // Add to organization_members
          await supabase.from('organization_members').insert({
            user_id: authData.user.id,
            organization_id: org.id,
            role: 'member'
          });
        }
      } catch (accessCodeError: any) {
        console.error('Failed to link access code:', accessCodeError);
        // Continue with signup even if access code linking fails
      }
    }

    // Send welcome email after successful signup
    if (!error) {
      try {
        await supabase.functions.invoke('send-welcome-email', {
          body: { 
            email, 
            fullName 
          }
        });
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the signup if email fails
      }
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Navigate to home page after sign out
    window.location.href = '/';
  };

  const isPremium = profile?.subscription_status === 'premium' || profile?.subscription_status === 'enterprise';

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isPremium
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}