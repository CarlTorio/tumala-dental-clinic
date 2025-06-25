
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MenuIcon, PhoneIcon } from 'lucide-react';

interface HeaderProps {
  onBookNow: () => void;
}

const Header = ({
  onBookNow
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 flex items-center justify-center logo-teeth-container">
              <div className="logo-content">
                <img 
                  src="/lovable-uploads/6a05d520-602e-4c7d-8853-bc4fe00a965f.png" 
                  alt="Tumala Dental Clinic Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="teeth-smile">
                <div className="tooth"></div>
                <div className="tooth"></div>
                <div className="tooth"></div>
                <div className="tooth"></div>
                <div className="tooth"></div>
                <div className="tooth"></div>
                <div className="tooth"></div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-primary text-lg">TUMALA</span>
              <span className="text-primary dental-shimmer font-semibold text-2xl">Dental Clinic</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-600 hover:text-primary transition-colors">
              Services
            </a>
            <a href="#about" className="text-gray-600 hover:text-primary transition-colors">
              About
            </a>
            
            <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <PhoneIcon className="h-4 w-4 mr-1" />
              (555) 123-SMILE
            </div>
            <Button onClick={onBookNow} className="bg-primary hover:bg-primary/90">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <MenuIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <a href="#services" className="text-gray-600 hover:text-primary transition-colors">
                Services
              </a>
              <a href="#about" className="text-gray-600 hover:text-primary transition-colors">
                About
              </a>
              <a href="#insurance" className="text-gray-600 hover:text-primary transition-colors">
                Insurance
              </a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">
                Contact
              </a>
              <div className="pt-4 border-t">
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <PhoneIcon className="h-4 w-4 mr-1" />
                  (555) 123-SMILE
                </div>
                <Button onClick={onBookNow} className="w-full bg-primary hover:bg-primary/90">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
