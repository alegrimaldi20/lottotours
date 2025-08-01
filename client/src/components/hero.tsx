import { Star } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary-custom to-secondary-custom text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="hero-title">
            Book Your Appointment Online
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto" data-testid="hero-subtitle">
            Skip the phone calls and emails. Book instantly with our easy-to-use scheduling system trusted by thousands of clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection('booking')}
              className="bg-white text-primary-custom px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              data-testid="button-book-appointment"
            >
              Book Appointment Now
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-custom transition-colors"
              data-testid="button-read-reviews"
            >
              Read Reviews
            </button>
          </div>
          <div className="mt-12 flex items-center justify-center text-blue-100">
            <div className="flex items-center space-x-2" data-testid="hero-rating">
              <div className="flex text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <span className="ml-2">4.9/5 from 500+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
