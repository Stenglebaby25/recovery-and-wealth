import Navigation from "@/components/Navigation";
import CoachingSection from "@/components/CoachingSection";

const Coaching = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <CoachingSection />
      </main>
    </div>
  );
};

export default Coaching;