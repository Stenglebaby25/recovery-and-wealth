import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Music } from 'lucide-react';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { FooterContactForm } from '@/components/FooterContactForm';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <img 
              src="/recovery-wealth-logo-bold.png" 
              alt="Recovery & Wealth" 
              className="h-10 w-auto mb-4"
            />
            <p className="text-sm text-muted-foreground">
              Building financial stability in recovery, one step at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/tools" className="text-muted-foreground hover:text-primary transition-colors">
                  Free Tools
                </Link>
              </li>
              <li>
                <Link to="/recovery-tools" className="text-muted-foreground hover:text-primary transition-colors">
                  Recovery Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/halt-lessons" className="text-muted-foreground hover:text-primary transition-colors">
                  H.A.L.T. Lessons
                </Link>
              </li>
              <li>
                <Link to="/coaching" className="text-muted-foreground hover:text-primary transition-colors">
                  Coaching
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-muted-foreground hover:text-primary transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <FooterContactForm />
          </div>

          {/* Newsletter */}
          <div>
            <NewsletterSignup />
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <a href="https://youtube.com/@sobermoneymindset?si=ZA1FzPFe0g4CIDbB" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/sobermoneymindset?igsh=ZHFldWhqb3ljaDI3" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://x.com/SoberMoneyMind?s=09" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@sobermoneymindset?_t=ZP-8zi2CxGFwCc&_r=1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="TikTok">
                <Music className="w-5 h-5" />
              </a>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Recovery & Wealth. All rights reserved.</p>
              <p className="mt-1">Created by people in recovery, for people in recovery.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
