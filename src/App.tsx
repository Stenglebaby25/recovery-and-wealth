import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Admin from "./pages/Admin";
import PaymentSuccess from "./pages/PaymentSuccess";
import Coaching from "./pages/Coaching";
import Pricing from "./pages/Pricing";
import SuccessStories from "./pages/SuccessStories";
import Tools from "./pages/Tools";
import CourseDemo from "./pages/CourseDemo";
import NotFound from "./pages/NotFound";
import CourseContentPreview from "./pages/CourseContentPreview";
import HALTLessons from "./components/course/HALTLessons";
import AdvancedLessons from "./components/course/AdvancedLessons";
import RecoveryTools from "./pages/RecoveryTools";
import LearningHubPreview from "./pages/LearningHubPreview";
import About from "./pages/About";
import LearningPathQuizPage from "./pages/LearningPathQuizPage";
import WeekLessons from "./pages/WeekLessons";
import Unsubscribe from "./pages/Unsubscribe";
import SobrietyCalculator from "./pages/SobrietyCalculator";
import PageSeo from "./components/PageSeo";
import { Helmet } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<><PageSeo title="Recovery & Wealth — Financial Literacy for People in Recovery" description="Financial literacy education built for addiction recovery. 8-week course, free tools, and coaching that support lasting sobriety." path="/" /><Index /></>} />
            <Route path="/auth" element={<><Helmet><meta name="robots" content="noindex,nofollow" /></Helmet><Auth /></>} />
            <Route path="/forgot-password" element={<><Helmet><meta name="robots" content="noindex,nofollow" /></Helmet><ForgotPassword /></>} />
            <Route path="/reset-password" element={<><Helmet><meta name="robots" content="noindex,nofollow" /></Helmet><ResetPassword /></>} />
            <Route path="/terms" element={<><PageSeo title="Terms of Service | Recovery & Wealth" description="Read the Recovery & Wealth terms of service covering account use, subscriptions, and acceptable use." path="/terms" /><TermsOfService /></>} />
            <Route path="/privacy" element={<><PageSeo title="Privacy Policy | Recovery & Wealth" description="How Recovery & Wealth collects, stores, and protects your personal and recovery data." path="/privacy" /><PrivacyPolicy /></>} />
            <Route path="/admin" element={<><Helmet><meta name="robots" content="noindex,nofollow" /></Helmet><Admin /></>} />
            <Route path="/payment-success" element={<><Helmet><meta name="robots" content="noindex,nofollow" /></Helmet><PaymentSuccess /></>} />
            <Route path="/coaching" element={<><PageSeo title="1-on-1 Recovery Financial Coaching | Recovery & Wealth" description="Personal financial coaching from coaches who understand recovery. Budgets, debt, and rebuilding without shame." path="/coaching" /><Coaching /></>} />
            <Route path="/pricing" element={<><PageSeo title="Pricing & Plans | Recovery & Wealth" description="Simple monthly and annual plans with a 14-day free trial. Freemium access for life. Facility licensing available." path="/pricing" /><Pricing /></>} />
            <Route path="/success-stories" element={<><PageSeo title="Recovery & Wealth Success Stories" description="Real stories from people in recovery rebuilding credit, paying off debt, and building emergency funds." path="/success-stories" /><SuccessStories /></>} />
            <Route path="/tools" element={<><PageSeo title="Free Financial Recovery Tools — Calculators & Trackers" description="Free calculators and trackers for people in recovery: sobriety savings, debt payoff, opportunity cost, and more." path="/tools" /><Tools /></>} />
            <Route path="/course-demo" element={<><PageSeo title="Course Demo | Recovery & Wealth" description="Preview the Recovery & Wealth course experience: video lessons, worksheets, and progress tracking." path="/course-demo" /><CourseDemo /></>} />
            <Route path="/course-content" element={<><PageSeo title="Course Content Preview | Recovery & Wealth" description="Browse the 8-week Recovery & Wealth curriculum module by module before enrolling." path="/course-content" /><CourseContentPreview /></>} />
            <Route path="/halt-lessons" element={<><PageSeo title="HALT Lessons — Hungry, Angry, Lonely, Tired & Money" description="Interactive HALT module connecting recovery's core emotional triggers to your financial decisions." path="/halt-lessons" /><HALTLessons /></>} />
            <Route path="/advanced-lessons" element={<><PageSeo title="Advanced Recovery & Wealth Lessons" description="Advanced modules on investing, credit rebuilding, business basics, and long-term recovery finance." path="/advanced-lessons" /><AdvancedLessons /></>} />
            <Route path="/recovery-tools" element={<><PageSeo title="Recovery-Focused Tools — HALT Button, Pause Timer, Amends Tracker" description="Free recovery tools: HALT crisis button, pause timer, amends priority tracker, and honesty inventory." path="/recovery-tools" /><RecoveryTools /></>} />
            <Route path="/learn" element={<><PageSeo title="Learning Hub — 8-Week Recovery & Wealth Curriculum" description="Browse the full Recovery & Wealth learning hub: 8 weeks of lessons connecting sobriety and money skills." path="/learn" /><LearningHubPreview /></>} />
            <Route path="/about" element={<><PageSeo title="About Recovery & Wealth — Our Mission" description="Why Recovery & Wealth exists: financial literacy designed for people in addiction recovery, built recovery-first." path="/about" /><About /></>} />
            <Route path="/learning-path-quiz" element={<><PageSeo title="Learning Path Quiz — Find Your Recovery Curriculum" description="Take a 7-question quiz to get a personalized Recovery & Wealth curriculum matched to your situation." path="/learning-path-quiz" /><LearningPathQuizPage /></>} />
            <Route path="/course/week/:weekNumber" element={<WeekLessons />} />
            <Route path="/unsubscribe" element={<><Helmet><meta name="robots" content="noindex,nofollow" /></Helmet><Unsubscribe /></>} />
            <Route path="/sobriety-calculator" element={<SobrietyCalculator />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<><Helmet><meta name="robots" content="noindex,nofollow" /></Helmet><NotFound /></>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
