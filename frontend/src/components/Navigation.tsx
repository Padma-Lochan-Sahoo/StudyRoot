
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-uninote-blue to-uninote-purple p-2 rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
              UniNote
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-uninote-blue transition-colors font-medium">
              Features
            </a>
            <a href="#about" className="text-gray-700 hover:text-uninote-blue transition-colors font-medium">
              About
            </a>
            <Link to="/login">
              <Button variant="outline" className="border-uninote-blue text-uninote-blue hover:bg-uninote-blue hover:text-white">
                Login
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-gradient-to-r from-uninote-blue to-uninote-purple hover:from-uninote-purple hover:to-uninote-blue">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-uninote-blue transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 py-4 bg-white/95 backdrop-blur-lg">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-uninote-blue transition-colors font-medium px-4">
                Features
              </a>
              <a href="#about" className="text-gray-700 hover:text-uninote-blue transition-colors font-medium px-4">
                About
              </a>
              <div className="flex flex-col space-y-2 px-4">
                <Link to="/login">
                  <Button variant="outline" className="w-full border-uninote-blue text-uninote-blue hover:bg-uninote-blue hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="w-full bg-gradient-to-r from-uninote-blue to-uninote-purple hover:from-uninote-purple hover:to-uninote-blue">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
