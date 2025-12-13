import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 13, 2025</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-foreground/80 leading-relaxed">
              By accessing or using Recovery & Wealth ("the Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Service. We reserve the right to modify these 
              terms at any time, and your continued use of the Service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
            <p className="text-foreground/80 leading-relaxed">
              Recovery & Wealth provides educational content, tools, and community resources designed to support 
              individuals in recovery with financial wellness. The Service includes but is not limited to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
              <li>Educational courses and learning materials</li>
              <li>Financial tracking and budgeting tools</li>
              <li>Recovery-focused resources and exercises</li>
              <li>Community platform access</li>
              <li>Coaching and support resources</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Not Medical or Financial Advice</h2>
            <p className="text-foreground/80 leading-relaxed">
              <strong>Important:</strong> The Service is for educational and informational purposes only. Nothing 
              provided through Recovery & Wealth constitutes medical advice, mental health treatment, addiction 
              treatment, or professional financial advice. The Service is not a substitute for professional 
              treatment or advice from qualified healthcare providers, licensed therapists, certified addiction 
              counselors, or licensed financial advisors.
            </p>
            <p className="text-foreground/80 leading-relaxed mt-4">
              If you are experiencing a medical or mental health emergency, please contact emergency services 
              immediately or call the National Suicide Prevention Lifeline at 988.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Accounts</h2>
            <p className="text-foreground/80 leading-relaxed">
              To access certain features, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and current information</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Subscription and Payments</h2>
            <p className="text-foreground/80 leading-relaxed">
              Some features require a paid subscription. By subscribing, you agree to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
              <li>Pay all applicable fees as described at the time of purchase</li>
              <li>Automatic renewal of subscriptions unless cancelled before the renewal date</li>
              <li>Our refund policy as stated at the time of purchase</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              Subscriptions can be managed through your account settings or the Stripe customer portal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Acceptable Use</h2>
            <p className="text-foreground/80 leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
              <li>Use the Service for any unlawful purpose</li>
              <li>Share your account credentials with others</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Upload harmful content or malware</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Copy, distribute, or modify any content without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
            <p className="text-foreground/80 leading-relaxed">
              All content, features, and functionality of the Service are owned by Recovery & Wealth and are 
              protected by copyright, trademark, and other intellectual property laws. You may not reproduce, 
              distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Privacy</h2>
            <p className="text-foreground/80 leading-relaxed">
              Your use of the Service is also governed by our{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, 
              which describes how we collect, use, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-foreground/80 leading-relaxed">
              To the maximum extent permitted by law, Recovery & Wealth shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, 
              whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Termination</h2>
            <p className="text-foreground/80 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violations of these terms 
              or for any other reason at our sole discretion. Upon termination, your right to use the Service will 
              immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
            <p className="text-foreground/80 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:support@recoveryandwealth.com" className="text-primary hover:underline">
                support@recoveryandwealth.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
