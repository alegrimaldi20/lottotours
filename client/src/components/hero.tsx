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
            Win Amazing Travel Experiences
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto" data-testid="hero-subtitle">
            Join blockchain-verified lotteries for authentic travel packages. Explore Bali temples, trek Patagonia glaciers, or discover Morocco's imperial cities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/lotteries"
              className="bg-white text-primary-custom px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg inline-block text-center"
              data-testid="button-explore-lotteries"
            >
              Explore Travel Lotteries
            </a>
            <a
              href="/missions"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-custom transition-colors inline-block text-center"
              data-testid="button-earn-tokens"
            >
              Earn Tokens
            </a>
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
              <span className="ml-2">Blockchain-verified and transparent</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
