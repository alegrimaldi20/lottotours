import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users, MapPin, Award, ExternalLink, Shield } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  logo: string;
  tier: 'premium' | 'gold' | 'silver';
  commission: string;
  countries: string[];
  specialties: string[];
  verification: 'verified' | 'pending' | 'featured';
  description: string;
  rating: number;
  totalBookings: string;
}

const partners: Partner[] = [
  {
    id: 'viajes-colombia',
    name: 'Viajes Colombia S.A.',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=80&fit=crop',
    tier: 'premium',
    commission: '28%',
    countries: ['Colombia', 'Ecuador', 'Venezuela'],
    specialties: ['Aventura', 'Ecoturismo', 'Cultural'],
    verification: 'featured',
    description: 'Líder en turismo aventura y ecoturismo en Colombia con 15 años de experiencia.',
    rating: 4.9,
    totalBookings: '12.5K'
  },
  {
    id: 'argentina-travel',
    name: 'Argentina Travel Group',
    logo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=80&fit=crop',
    tier: 'premium',
    commission: '26%',
    countries: ['Argentina', 'Chile', 'Uruguay'],
    specialties: ['Lujo', 'Vinos', 'Patagonia'],
    verification: 'featured',
    description: 'Expertos en turismo de lujo y experiencias gastronómicas en el Cono Sur.',
    rating: 4.8,
    totalBookings: '8.7K'
  },
  {
    id: 'brasil-adventures',
    name: 'Brasil Adventures',
    logo: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=120&h=80&fit=crop',
    tier: 'gold',
    commission: '24%',
    countries: ['Brasil'],
    specialties: ['Playa', 'Carnaval', 'Amazonas'],
    verification: 'verified',
    description: 'Especialistas en experiencias brasileñas auténticas desde playas hasta la selva.',
    rating: 4.7,
    totalBookings: '15.2K'
  },
  {
    id: 'peru-mystic',
    name: 'Peru Mystic Tours',
    logo: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=120&h=80&fit=crop',
    tier: 'gold',
    commission: '22%',
    countries: ['Perú', 'Bolivia'],
    specialties: ['Arqueología', 'Trekking', 'Cultural'],
    verification: 'verified',
    description: 'Tours especializados en sitios arqueológicos y trekking en los Andes.',
    rating: 4.6,
    totalBookings: '6.8K'
  },
  {
    id: 'chile-premium',
    name: 'Chile Premium Experiences',
    logo: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=120&h=80&fit=crop',
    tier: 'gold',
    commission: '20%',
    countries: ['Chile'],
    specialties: ['Desierto', 'Vinos', 'Patagonia'],
    verification: 'verified',
    description: 'Experiencias premium en los paisajes más únicos de Chile.',
    rating: 4.5,
    totalBookings: '4.3K'
  },
  {
    id: 'ecuador-nature',
    name: 'Ecuador Nature Tours',
    logo: 'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=120&h=80&fit=crop',
    tier: 'silver',
    commission: '18%',
    countries: ['Ecuador'],
    specialties: ['Galápagos', 'Volcanes', 'Biodiversidad'],
    verification: 'verified',
    description: 'Tours especializados en la increíble biodiversidad del Ecuador.',
    rating: 4.4,
    totalBookings: '3.1K'
  }
];

const tierColors = {
  premium: 'from-purple-500 to-purple-600',
  gold: 'from-yellow-500 to-orange-500',
  silver: 'from-gray-400 to-gray-500'
};

const tierBadgeColors = {
  premium: 'bg-purple-100 text-purple-700 border-purple-300',
  gold: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  silver: 'bg-gray-100 text-gray-700 border-gray-300'
};

const verificationIcons = {
  featured: <Award className="w-4 h-4 text-yellow-500" />,
  verified: <Shield className="w-4 h-4 text-green-500" />,
  pending: <Users className="w-4 h-4 text-gray-400" />
};

export default function TravelPartners() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-teal-600 bg-clip-text text-transparent mb-4">
          Nuestros Socios de Viaje
        </h2>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
          Trabajamos con las mejores agencias de viaje de Sudamérica para ofrecerte experiencias excepcionales. 
          Cada socio está verificado y especializado en destinos únicos.
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">50+</div>
            <div className="text-gray-600">Agencias Verificadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">9</div>
            <div className="text-gray-600">Países Cubiertos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-600">28%</div>
            <div className="text-gray-600">Comisión Máxima</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600">150K+</div>
            <div className="text-gray-600">Reservas Totales</div>
          </div>
        </div>
      </div>

      {/* Partner Categories */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Categorías de Socios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h4 className="font-semibold text-purple-800 mb-2">Premium Partners</h4>
              <p className="text-purple-700 text-sm mb-2">26-28% Comisión</p>
              <p className="text-purple-600 text-xs">Agencias líderes con servicios de lujo</p>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-100">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <h4 className="font-semibold text-yellow-800 mb-2">Gold Partners</h4>
              <p className="text-yellow-700 text-sm mb-2">20-24% Comisión</p>
              <p className="text-yellow-600 text-xs">Agencias establecidas con excelente reputación</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-gray-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Silver Partners</h4>
              <p className="text-gray-700 text-sm mb-2">18-20% Comisión</p>
              <p className="text-gray-600 text-xs">Agencias verificadas en crecimiento</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {partners.map((partner) => (
          <Card 
            key={partner.id} 
            className="group hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {partner.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {verificationIcons[partner.verification]}
                      <Badge 
                        variant="outline" 
                        className={tierBadgeColors[partner.tier]}
                      >
                        {partner.tier.charAt(0).toUpperCase() + partner.tier.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{partner.commission}</div>
                  <div className="text-xs text-gray-500">comisión</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{partner.description}</p>
              
              {/* Rating and Bookings */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">{partner.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{partner.totalBookings} reservas</span>
                </div>
              </div>
              
              {/* Countries */}
              <div>
                <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Países
                </h5>
                <div className="flex flex-wrap gap-1">
                  {partner.countries.map((country) => (
                    <Badge key={country} variant="secondary" className="text-xs">
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Specialties */}
              <div>
                <h5 className="text-xs font-semibold text-gray-700 mb-2">Especialidades</h5>
                <div className="flex flex-wrap gap-1">
                  {partner.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600"
                data-testid={`partner-contact-${partner.id}`}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Detalles
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Section for Partners */}
      <Card className="bg-gradient-to-r from-purple-600 via-orange-500 to-teal-500 text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">¿Eres una Agencia de Viajes?</h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Únete a nuestro programa de socios y obtén hasta 28% de comisión en cada reserva. 
            Proceso de verificación rápido y soporte dedicado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100"
              data-testid="button-become-partner"
            >
              Convertirse en Socio
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-600"
              data-testid="button-partner-info"
            >
              Más Información
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}