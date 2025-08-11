import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plane, Users, Star } from 'lucide-react';

const continents = [
  {
    id: 'europa',
    name: 'Europa',
    description: 'Descubre la rica historia y cultura europea',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=250&fit=crop',
    countries: ['España', 'Francia', 'Italia', 'Alemania', 'Reino Unido', 'Grecia'],
    popularDestinations: ['París', 'Roma', 'Barcelona', 'Londres', 'Atenas', 'Berlín']
  },
  {
    id: 'america-norte',
    name: 'América del Norte',
    description: 'Desde las montañas hasta las costas urbanas',
    image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=250&fit=crop',
    countries: ['Estados Unidos', 'Canadá', 'México'],
    popularDestinations: ['Nueva York', 'Los Ángeles', 'Toronto', 'Cancún', 'Vancouver', 'Miami']
  },
  {
    id: 'asia',
    name: 'Asia',
    description: 'Tradiciones milenarias y modernidad en perfecta armonía',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
    countries: ['Japón', 'Tailandia', 'Singapur', 'India', 'China', 'Corea del Sur'],
    popularDestinations: ['Tokio', 'Bangkok', 'Singapur', 'Mumbái', 'Pekín', 'Seúl']
  },
  {
    id: 'america-central',
    name: 'América Central',
    description: 'Paraísos tropicales y aventuras naturales',
    image: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=400&h=250&fit=crop',
    countries: ['Costa Rica', 'Panamá', 'Guatemala', 'Belice', 'Honduras', 'Nicaragua'],
    popularDestinations: ['San José', 'Ciudad de Panamá', 'Antigua', 'Belize City', 'Tegucigalpa', 'Managua']
  },
  {
    id: 'oceania',
    name: 'Oceanía',
    description: 'Islas paradisíacas y paisajes únicos',
    image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=250&fit=crop',
    countries: ['Australia', 'Nueva Zelanda', 'Fiji', 'Vanuatu'],
    popularDestinations: ['Sídney', 'Auckland', 'Suva', 'Port Vila', 'Melbourne', 'Wellington']
  },
  {
    id: 'sudamerica',
    name: 'Sudamérica',
    description: 'Nuestro mercado principal - Diversidad natural y cultural incomparable',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=250&fit=crop',
    countries: ['Brasil', 'Argentina', 'Colombia', 'Perú', 'Chile', 'Ecuador', 'Bolivia', 'Uruguay', 'Paraguay'],
    popularDestinations: ['Río de Janeiro', 'Buenos Aires', 'Bogotá', 'Lima', 'Santiago', 'Quito'],
    featured: true
  },
  {
    id: 'africa',
    name: 'África',
    description: 'Safaris, culturas ancestrales y paisajes espectaculares',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=250&fit=crop',
    countries: ['Sudáfrica', 'Kenia', 'Egipto', 'Marruecos', 'Tanzania', 'Botswana'],
    popularDestinations: ['Ciudad del Cabo', 'Nairobi', 'El Cairo', 'Marrakech', 'Dar es Salaam', 'Gaborone']
  },
  {
    id: 'oriente-medio',
    name: 'Oriente Medio',
    description: 'Donde la historia antigua se encuentra con el lujo moderno',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop',
    countries: ['Emiratos Árabes Unidos', 'Qatar', 'Jordania', 'Israel', 'Líbano'],
    popularDestinations: ['Dubái', 'Doha', 'Ammán', 'Tel Aviv', 'Beirut', 'Abu Dhabi']
  }
];

const popularCountries = [
  { name: 'Brasil', flag: '🇧🇷', visitors: '2.1M', growth: '+15%' },
  { name: 'Argentina', flag: '🇦🇷', visitors: '1.8M', growth: '+22%' },
  { name: 'Colombia', flag: '🇨🇴', visitors: '1.5M', growth: '+18%' },
  { name: 'Perú', flag: '🇵🇪', visitors: '1.2M', growth: '+25%' },
  { name: 'Chile', flag: '🇨🇱', visitors: '980K', growth: '+12%' },
  { name: 'Ecuador', flag: '🇪🇨', visitors: '750K', growth: '+30%' }
];

export default function ExplorePage() {
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-teal-600 bg-clip-text text-transparent mb-4">
            Explorar Destinos
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Destinos en todo el mundo
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            ¿Adónde quieres ir? Encuentra los mejores hoteles, experiencias y premios de lotería en los mejores destinos.
          </p>
        </div>

        {/* Continents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {continents.map((continent) => (
            <Card 
              key={continent.id} 
              className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                continent.featured ? 'ring-2 ring-gradient-to-r ring-orange-400 ring-opacity-50' : ''
              } ${selectedContinent === continent.id ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => setSelectedContinent(selectedContinent === continent.id ? null : continent.id)}
              data-testid={`continent-card-${continent.id}`}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={continent.image} 
                  alt={continent.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {continent.featured && (
                  <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    Mercado Principal
                  </Badge>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                  {continent.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  {continent.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{continent.countries.length} países</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Plane className="w-3 h-3" />
                    <span>{continent.popularDestinations.length} destinos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Continent Details */}
        {selectedContinent && (
          <Card className="mb-16 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-700">
                Destinos en {continents.find(c => c.id === selectedContinent)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    Países Disponibles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {continents.find(c => c.id === selectedContinent)?.countries.map((country) => (
                      <Badge key={country} variant="secondary" className="bg-purple-100 text-purple-700">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-orange-500" />
                    Destinos Populares
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {continents.find(c => c.id === selectedContinent)?.popularDestinations.map((destination) => (
                      <Badge key={destination} variant="outline" className="border-orange-300 text-orange-600">
                        {destination}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Popular Countries Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
            Países Más Visitados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCountries.map((country, index) => (
              <Card key={country.name} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{country.flag}</span>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{country.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Users className="w-4 h-4" />
                          <span>{country.visitors} visitantes</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="border-green-300 text-green-600 bg-green-50"
                    >
                      {country.growth}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                    data-testid={`explore-country-${country.name.toLowerCase()}`}
                  >
                    Explorar Destinos
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 via-orange-500 to-teal-500 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">¿Listo para tu próxima aventura?</h2>
          <p className="text-lg mb-6">
            Participa en nuestras loterías de viaje y gana experiencias increíbles
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100"
              data-testid="button-view-lotteries"
              onClick={() => setLocation('/lotteries')}
            >
              Ver Loterías Activas
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-600"
              data-testid="button-browse-marketplace"
              onClick={() => setLocation('/marketplace')}
            >
              Explorar Marketplace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}