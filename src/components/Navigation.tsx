import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Recovery & Wealth
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#course" className="text-foreground hover:text-primary transition-colors">
              Course
            </a>
            <a href="#coaching" className="text-foreground hover:text-primary transition-colors">
              Coaching
            </a>
            <a href="https://recoveryandwealth.mn.co" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
              Community
            </a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#business" className="text-foreground hover:text-primary transition-colors">
              For Centers
            </a>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost">
              Sign In
            </Button>
            <Button variant="hero">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a 
                href="#course" 
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Course
              </a>
              <a 
                href="#coaching" 
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Coaching
              </a>
              <a 
                href="https://recoveryandwealth.mn.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </a>
              <a 
                href="#pricing" 
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#business" 
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                For Centers
              </a>
              <div className="px-3 py-2 space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  Sign In
                </Button>
                <Button variant="hero" className="w-full">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;