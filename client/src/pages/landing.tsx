import { useState } from "react";
import { Link } from "wouter";
import { Star, MapPin, Gift, Trophy, Coins, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import TravelImageRenderer from "@/components/travel-image-renderer";
import Footer from "@/components/footer";
import LanguageSelector from "@/components/language-selector";

export default function Landing() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-lottery-purple/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gradient-gold flex items-center gap-2" data-testid="logo">
                <div className="w-8 h-8">
                  <TravelImageRenderer type="cultural" className="w-full h-full" />
                </div>
                TravelLotto
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-slate-600 hover:text-lottery-gold transition-colors"
                data-testid="nav-features"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-slate-600 hover:text-lottery-gold transition-colors"
                data-testid="nav-how-it-works"
              >
                How It Works
              </button>
              <LanguageSelector variant="ghost" size="sm" />
              <Link href="/dashboard">
                <Button className="btn-lottery shadow-lg" data-testid="button-get-started">
                  Get Started
                </Button>
              </Link>
            </nav>
            
            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSelector variant="ghost" size="sm" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6" data-testid="hero-title">
              Turn Your Dreams Into
              <span className="text-gradient-gold"> Adventures</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto" data-testid="hero-subtitle">
              Complete missions, win lotteries, and earn tokens to unlock real travel experiences. 
              Your next adventure starts with a single click!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="btn-lottery px-8 py-4 text-lg shadow-xl"
                  data-testid="button-start-exploring"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Exploring
                </Button>
              </Link>
              <Link href="/lotteries">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="btn-adventure px-8 py-4 text-lg shadow-xl"
                  data-testid="button-view-lotteries"
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  View Lotteries
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
              <div className="text-center" data-testid="stat-adventures">
                <div className="text-3xl font-bold text-gradient-gold">1000+</div>
                <div className="text-slate-600">Adventures Won</div>
              </div>
              <div className="text-center" data-testid="stat-destinations">
                <div className="text-3xl font-bold text-gradient-adventure">50+</div>
                <div className="text-slate-600">Destinations</div>
              </div>
              <div className="text-center" data-testid="stat-users">
                <div className="text-3xl font-bold text-gradient-lottery">25K+</div>
                <div className="text-slate-600">Active Explorers</div>
              </div>
              <div className="text-center" data-testid="stat-prizes">
                <div className="text-3xl font-bold text-gradient-gold">$2M+ USD</div>
                <div className="text-slate-600">Prizes Given</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Showcase - Real Photography */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="destinations-title">
              Authentic Travel <span className="text-gradient-gold">Destinations</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto" data-testid="destinations-subtitle">
              Real places, real experiences, real adventures waiting for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-300" data-testid="destination-paris">
              <TravelImageRenderer type="paris" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-bold text-xl mb-2">Paris, France</h3>
                <p className="text-sm opacity-90 mb-3">Iconic Eiffel Tower & Culture</p>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm">4.9 • Cultural Experience</span>
                </div>
              </div>
            </div>

            <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-300" data-testid="destination-tropical">
              <TravelImageRenderer type="tropical" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-bold text-xl mb-2">Tropical Paradise</h3>
                <p className="text-sm opacity-90 mb-3">Crystal Waters & White Beaches</p>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm">4.8 • Beach Paradise</span>
                </div>
              </div>
            </div>

            <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-300" data-testid="destination-tokyo">
              <TravelImageRenderer type="tokyo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-bold text-xl mb-2">Tokyo, Japan</h3>
                <p className="text-sm opacity-90 mb-3">Mount Fuji & Modern City</p>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm">4.9 • City Adventure</span>
                </div>
              </div>
            </div>

            <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-300" data-testid="destination-alps">
              <TravelImageRenderer type="europe" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-bold text-xl mb-2">Swiss Alps</h3>
                <p className="text-sm opacity-90 mb-3">Snow-Capped Mountains & Lakes</p>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm">4.9 • Mountain Adventure</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="btn-adventure px-8 py-4 text-lg shadow-xl"
                data-testid="button-explore-destinations"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Explore All Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" data-testid="features-title">
              Everything You Need for Your Journey
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto" data-testid="features-subtitle">
              Gamified experiences that turn exploration into rewards
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center" data-testid="feature-missions">
              <div className="w-16 h-16 bg-explore-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Themed Missions</h3>
              <p className="text-slate-600">
                Complete cultural, local, and adventure missions to earn tokens and unlock new destinations
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 text-center" data-testid="feature-lotteries">
              <div className="w-16 h-16 bg-ocean-pulse rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Travel Lotteries</h3>
              <p className="text-slate-600">
                Enter exciting lotteries for a chance to win real travel packages and exclusive experiences
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 text-center" data-testid="feature-marketplace">
              <div className="w-16 h-16 bg-golden-luck rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Prize Marketplace</h3>
              <p className="text-slate-600">
                Redeem your tokens for real travel packages, gear, and exclusive experiences from our partners
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" data-testid="how-it-works-title">
              Your Adventure in 4 Simple Steps
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto" data-testid="how-it-works-subtitle">
              From digital exploration to real-world adventures
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center" data-testid="step-1">
              <div className="w-16 h-16 bg-explore-blue rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-3">Join & Explore</h3>
              <p className="text-slate-600">Create your account and start your journey as a digital explorer</p>
            </div>
            
            <div className="text-center" data-testid="step-2">
              <div className="w-16 h-16 bg-ocean-pulse rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-3">Complete Missions</h3>
              <p className="text-slate-600">Take on cultural, local, and adventure challenges to earn tokens</p>
            </div>
            
            <div className="text-center" data-testid="step-3">
              <div className="w-16 h-16 bg-golden-luck rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-3">Win & Collect</h3>
              <p className="text-slate-600">Enter lotteries and collect NFTs while building your travel portfolio</p>
            </div>
            
            <div className="text-center" data-testid="step-4">
              <div className="w-16 h-16 bg-travel-mint rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-3">Redeem & Travel</h3>
              <p className="text-slate-600">Exchange tokens for real travel experiences and start your adventure</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-explore-blue to-ocean-pulse text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="cta-title">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl mb-8 text-blue-100" data-testid="cta-subtitle">
            Join thousands of explorers who are turning their dreams into reality
          </p>
          <Link href="/dashboard">
            <Button 
              size="lg" 
              className="bg-white text-explore-blue hover:bg-slate-100 px-8 py-4 text-lg"
              data-testid="button-join-now"
            >
              <Users className="mr-2 h-5 w-5" />
              Join the Adventure
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}