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
import RecoveryTools from "./pages/RecoveryTools";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<Admin />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/coaching" element={<Coaching />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/course-demo" element={<CourseDemo />} />
            <Route path="/course-content" element={<CourseContentPreview />} />
            <Route path="/halt-lessons" element={<HALTLessons />} />
            <Route path="/recovery-tools" element={<RecoveryTools />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
