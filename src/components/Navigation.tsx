import { Button } from "@/components/ui/button";
import { Menu, X, Shield, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Link } from "react-router-dom";
import { ThemeSelector } from "./ThemeSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(200,18%,88%)] backdrop-blur-md border-b border-[hsl(200,12%,82%)] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/recovery-wealth-logo-bold.png" 
              alt="Recovery & Wealth" 
              className="h-14 md:h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-primary transition-colors focus:outline-none">
                Tools
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover z-50">
                <DropdownMenuItem asChild>
                  <Link to="/tools" className="w-full cursor-pointer">
                    Free Tools
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/recovery-tools" className="w-full cursor-pointer">
                    Recovery Tools
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Learn Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-primary transition-colors focus:outline-none">
                Learn
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover z-50">
                <DropdownMenuItem asChild>
                  <Link to="/halt-lessons" className="w-full cursor-pointer">
                    H.A.L.T. Lessons
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  {user ? (
                    <Link to="/" className="w-full cursor-pointer">
                      Dashboard
                    </Link>
                  ) : (
                    <a href="#learning-hub" className="w-full cursor-pointer">
                      Learning Hub
                    </a>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* About Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-primary transition-colors focus:outline-none">
                About
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover z-50">
                <DropdownMenuItem asChild>
                  <Link to="/coaching" className="w-full cursor-pointer">
                    Coaching
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/success-stories" className="w-full cursor-pointer">
                    Success Stories
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pricing" className="w-full cursor-pointer">
                    Pricing
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <div className="md:hidden border-t border-[hsl(200,12%,82%)] bg-[hsl(200,18%,89%)] backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Tools Section */}
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tools</p>
                <Link 
                  to="/tools" 
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Free Tools
                </Link>
                <Link 
                  to="/recovery-tools" 
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Recovery Tools
                </Link>
              </div>

              {/* Learn Section */}
              <div className="px-3 py-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Learn</p>
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
              </div>

              {/* About Section */}
              <div className="px-3 py-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</p>
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
              </div>

              <div className="px-3 py-2 space-y-2 border-t border-border">
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
