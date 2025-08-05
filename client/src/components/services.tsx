import { useQuery } from "@tanstack/react-query";
import { type Service } from "@shared/schema";
import { Bus, TrendingUp, Handshake } from "lucide-react";

const getIconComponent = (iconClass: string) => {
  switch (iconClass) {
    case "fas fa-user-tie":
      return Bus;
    case "fas fa-chart-line":
      return TrendingUp;
    case "fas fa-handshake":
      return Handshake;
    default:
      return Bus;
  }
};

export default function Services() {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Failed to load services. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" data-testid="services-title">
            Travel Experiences
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto" data-testid="services-subtitle">
            Win authentic travel packages through our blockchain-verified lottery system. Each destination offers unique cultural immersion and adventure opportunities.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-8 hover:shadow-lg transition-shadow border border-orange-200">
            <div className="text-4xl mb-4">🏝️</div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">Bali Cultural Immersion</h3>
            <p className="text-slate-600 mb-4">8-day spiritual journey through temples, rice terraces, and pristine beaches</p>
            <div className="flex justify-between items-center text-sm text-slate-500">
              <span>Prize Value: $3,200</span>
              <span>15 tokens/ticket</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 hover:shadow-lg transition-shadow border border-blue-200">
            <div className="text-4xl mb-4">🏔️</div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">Patagonia Wilderness</h3>
            <p className="text-slate-600 mb-4">10-day adventure with glacier trekking and wildlife encounters</p>
            <div className="flex justify-between items-center text-sm text-slate-500">
              <span>Prize Value: $4,500</span>
              <span>35 tokens/ticket</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 hover:shadow-lg transition-shadow border border-amber-200">
            <div className="text-4xl mb-4">🏜️</div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">Morocco Desert & Cities</h3>
            <p className="text-slate-600 mb-4">12-day imperial cities tour with Sahara desert camel trekking</p>
            <div className="flex justify-between items-center text-sm text-slate-500">
              <span>Prize Value: $3,800</span>
              <span>25 tokens/ticket</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
