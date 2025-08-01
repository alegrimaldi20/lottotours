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
            Our Services
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto" data-testid="services-subtitle">
            Choose from our range of professional services. Each appointment includes consultation and follow-up support.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services?.map((service) => {
            const IconComponent = getIconComponent(service.icon);
            return (
              <div
                key={service.id}
                className="bg-slate-50 rounded-xl p-8 hover:shadow-lg transition-shadow border border-slate-200"
                data-testid={`service-card-${service.id}`}
              >
                <div className="text-primary-custom mb-4">
                  <IconComponent size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3" data-testid={`service-name-${service.id}`}>
                  {service.name}
                </h3>
                <p className="text-slate-600 mb-4" data-testid={`service-description-${service.id}`}>
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-custom" data-testid={`service-price-${service.id}`}>
                    ${(service.price / 100).toFixed(0)}
                  </span>
                  <span className="text-slate-500" data-testid={`service-duration-${service.id}`}>
                    {service.duration} min
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
