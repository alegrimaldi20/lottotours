import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-custom" data-testid="logo">
                BookEasy
              </h1>
            </div>
          </div>
          
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection('services')}
                className="text-slate-600 hover:text-primary-custom px-3 py-2 text-sm font-medium transition-colors"
                data-testid="nav-services"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('booking')}
                className="text-slate-600 hover:text-primary-custom px-3 py-2 text-sm font-medium transition-colors"
                data-testid="nav-booking"
              >
                Book Now
              </button>
              <button
                onClick={() => scrollToSection('reviews')}
                className="text-slate-600 hover:text-primary-custom px-3 py-2 text-sm font-medium transition-colors"
                data-testid="nav-reviews"
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-slate-600 hover:text-primary-custom px-3 py-2 text-sm font-medium transition-colors"
                data-testid="nav-contact"
              >
                Contact
              </button>
            </div>
          </nav>
          
          <div className="md:hidden">
            <button
              type="button"
              className="text-slate-600 hover:text-primary-custom"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-slate-200">
              <button
                onClick={() => scrollToSection('services')}
                className="text-slate-600 hover:text-primary-custom block px-3 py-2 text-base font-medium w-full text-left"
                data-testid="mobile-nav-services"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('booking')}
                className="text-slate-600 hover:text-primary-custom block px-3 py-2 text-base font-medium w-full text-left"
                data-testid="mobile-nav-booking"
              >
                Book Now
              </button>
              <button
                onClick={() => scrollToSection('reviews')}
                className="text-slate-600 hover:text-primary-custom block px-3 py-2 text-base font-medium w-full text-left"
                data-testid="mobile-nav-reviews"
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-slate-600 hover:text-primary-custom block px-3 py-2 text-base font-medium w-full text-left"
                data-testid="mobile-nav-contact"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
