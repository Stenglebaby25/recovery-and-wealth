import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
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

        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 13, 2025</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p className="text-foreground/80 leading-relaxed">
              Recovery & Wealth ("we," "our," or "us") respects your privacy and is committed to protecting 
              your personal information. This Privacy Policy explains how we collect, use, disclose, and 
              safeguard your information when you use our service.
            </p>
            <p className="text-foreground/80 leading-relaxed mt-4">
              We understand that users of our service may be sharing sensitive information related to their 
              recovery journey and financial situation. We take this responsibility seriously and are committed 
              to maintaining the highest standards of privacy and security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Information You Provide</h3>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
              <li><strong>Account Information:</strong> Name, email address, and password when you create an account</li>
              <li><strong>Profile Information:</strong> Optional information you choose to add to your profile</li>
              <li><strong>Financial Data:</strong> Budget information, expense tracking data, and financial goals you enter into our tools</li>
              <li><strong>Recovery Data:</strong> Check-in responses, mood journal entries, and progress information</li>
              <li><strong>Communications:</strong> Messages you send to us or through our community platform</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Information Collected Automatically</h3>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
              <li><strong>Usage Data:</strong> Pages visited, features used, and time spent on the service</li>
              <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
              <li><strong>Log Data:</strong> IP address, access times, and referring URLs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-foreground/80 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
              <li>Provide, maintain, and improve our services</li>
              <li>Personalize your experience and content</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent or unauthorized activity</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-foreground/80 leading-relaxed">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
              <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., payment processing, email delivery, hosting)</li>
              <li><strong>Treatment Centers:</strong> If you enrolled through a treatment center program, limited information may be shared with that organization as outlined in your enrollment agreement</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you have given us explicit permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
            <p className="text-foreground/80 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication mechanisms</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls limiting who can view your data</li>
              <li>Row-level security policies on our database</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure, and we 
              cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Retention</h2>
            <p className="text-foreground/80 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide 
              you services. We will also retain and use your information as necessary to comply with legal 
              obligations, resolve disputes, and enforce our agreements.
            </p>
            <p className="text-foreground/80 leading-relaxed mt-4">
              You may request deletion of your account and associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Rights and Choices</h2>
            <p className="text-foreground/80 leading-relaxed">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              To exercise these rights, please contact us at the email address below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Cookies and Tracking</h2>
            <p className="text-foreground/80 leading-relaxed">
              We use cookies and similar tracking technologies to collect usage information and improve our 
              services. You can control cookies through your browser settings, though some features may not 
              function properly if cookies are disabled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Third-Party Services</h2>
            <p className="text-foreground/80 leading-relaxed">
              Our service integrates with third-party services including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground/80">
              <li><strong>Supabase:</strong> For authentication and data storage</li>
              <li><strong>Stripe:</strong> For payment processing</li>
              <li><strong>Circle:</strong> For community platform features</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Children's Privacy</h2>
            <p className="text-foreground/80 leading-relaxed">
              Our service is not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children. If you believe we have collected information from a child, 
              please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to This Policy</h2>
            <p className="text-foreground/80 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
            <p className="text-foreground/80 leading-relaxed">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:{' '}
              <a href="mailto:privacy@recoveryandwealth.com" className="text-primary hover:underline">
                privacy@recoveryandwealth.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
