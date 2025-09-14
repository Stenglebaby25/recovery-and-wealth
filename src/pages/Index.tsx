import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import LearningHub from "@/components/LearningHub";
import MarketingHomepage from "@/components/MarketingHomepage";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {user ? (
          // Logged-in user experience - clean dashboard focused
          <>
            <Dashboard />
          </>
        ) : (
          // Marketing experience for non-logged-in users - strategic lead generation
          <>
            <MarketingHomepage />
            <LearningHub />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
