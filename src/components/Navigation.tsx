import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Link } from "react-router-dom";
import { ThemeSelector } from "./ThemeSelector";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/recovery-wealth-logo.png" 
              alt="Recovery & Wealth" 
              className="h-10 md:h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/tools" className="text-foreground hover:text-primary transition-colors">
              Free Tools
            </Link>
            <Link to="/halt-lessons" className="text-foreground hover:text-primary transition-colors">
              H.A.L.T. Lessons
            </Link>
            {user ? (
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            ) : (
              <a href="#learning-hub" className="text-foreground hover:text-primary transition-colors">
                Learning Hub
              </a>
            )}
            <Link to="/coaching" className="text-foreground hover:text-primary transition-colors">
              Coaching
            </Link>
            <Link to="/success-stories" className="text-foreground hover:text-primary transition-colors">
              Success Stories
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSelector />
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="destructive" size="sm">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <span className="text-sm text-muted-foreground">
                  Welcome back!
                </span>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="hero" onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            )}
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
              <Link 
                to="/tools" 
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Free Tools
              </Link>
              <Link 
                to="/halt-lessons" 
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                H.A.L.T. Lessons
              </Link>
              {user ? (
                <Link 
                  to="/" 
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <a 
                  href="#learning-hub" 
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Learning Hub
                </a>
              )}
              <Link 
                to="/coaching" 
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Coaching
              </Link>
              <Link 
                to="/success-stories" 
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Success Stories
              </Link>
              <Link 
                to="/pricing" 
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="px-3 py-2 space-y-2">
                <ThemeSelector fullWidth />
                {user ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="destructive" className="w-full" size="sm">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button variant="outline" className="w-full" onClick={signOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button variant="hero" className="w-full" onClick={() => window.location.href = '/auth'}>
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;