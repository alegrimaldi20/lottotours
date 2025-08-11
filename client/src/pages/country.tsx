import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, MapPin, Plane, Users, Star, Calendar, 
  Clock, DollarSign, Trophy, Gift, Camera, Mountain, TrendingUp
} from "lucide-react";

const countryData = {
  brasil: {
    name: "Brasil",
    flag: "🇧🇷",
    description: "El país más grande de Sudamérica con increíbles playas, selvas amazónicas y cultura vibrante.",
    highlights: ["Río de Janeiro", "São Paulo", "Salvador", "Amazonas", "Iguazú"],
    experiences: [
      {
        id: "brasil-carnival",
        title: "Carnaval de Río 2025",
        description: "Vive la fiesta más grande del mundo",
        price: 1200,
        duration: "5 días",
        image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300&h=200&fit=crop"
      },
      {
        id: "brasil-amazon",
        title: "Expedición Amazónica",
        description: "Descubre la biodiversidad del pulmón del mundo",
        price: 800,
        duration: "7 días",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&h=200&fit=crop"
      }
    ],
    stats: {
      visitors: "2.1M",
      growth: "+15%",
      satisfaction: "4.8/5",
      experiences: 45
    }
  },
  argentina: {
    name: "Argentina",
    flag: "🇦🇷", 
    description: "Tierra del tango, los asados y paisajes únicos desde la Patagonia hasta las cataratas.",
    highlights: ["Buenos Aires", "Mendoza", "Patagonia", "Iguazú", "Ushuaia"],
    experiences: [
      {
        id: "argentina-tango",
        title: "Buenos Aires & Tango",
        description: "La capital del tango y la cultura porteña",
        price: 900,
        duration: "4 días",
        image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=300&h=200&fit=crop"
      },
      {
        id: "argentina-patagonia",
        title: "Aventura Patagónica",
        description: "Glaciares, montañas y paisajes únicos",
        price: 1500,
        duration: "10 días", 
        image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=300&h=200&fit=crop"
      }
    ],
    stats: {
      visitors: "1.8M",
      growth: "+22%",
      satisfaction: "4.7/5",
      experiences: 38
    }
  },
  colombia: {
    name: "Colombia",
    flag: "🇨🇴",
    description: "País de contrastes con costas caribeñas, montañas andinas y culturas diversas.",
    highlights: ["Cartagena", "Bogotá", "Medellín", "San Andrés", "Eje Cafetero"],
    experiences: [
      {
        id: "colombia-coffee",
        title: "Ruta del Café",
        description: "Descubre el mejor café del mundo en su origen",
        price: 650,
        duration: "5 días",
        image: "https://images.unsplash.com/photo-1495231916356-a86217efff12?w=300&h=200&fit=crop"
      },
      {
        id: "colombia-caribbean", 
        title: "Costa Caribeña",
        description: "Playas paradisíacas y ciudades coloniales",
        price: 850,
        duration: "6 días",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&h=200&fit=crop"
      }
    ],
    stats: {
      visitors: "1.5M",
      growth: "+18%",
      satisfaction: "4.6/5", 
      experiences: 42
    }
  },
  peru: {
    name: "Perú",
    flag: "🇵🇪",
    description: "Cuna del Imperio Inca con Machu Picchu, gastronomía mundial y culturas ancestrales.",
    highlights: ["Machu Picchu", "Lima", "Cusco", "Arequipa", "Iquitos"],
    experiences: [
      {
        id: "peru-machu-picchu",
        title: "Camino Inca a Machu Picchu",
        description: "La ruta de trekking más famosa del mundo",
        price: 1100,
        duration: "4 días",
        image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=300&h=200&fit=crop"
      },
      {
        id: "peru-gastronomy",
        title: "Tour Gastronómico",
        description: "Descubre la cocina peruana reconocida mundialmente",
        price: 450,
        duration: "3 días",
        image: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=300&h=200&fit=crop"
      }
    ],
    stats: {
      visitors: "1.2M", 
      growth: "+25%",
      satisfaction: "4.9/5",
      experiences: 52
    }
  },
  chile: {
    name: "Chile",
    flag: "🇨🇱",
    description: "País largo y estrecho con desiertos, glaciares, vinos de clase mundial y paisajes únicos.",
    highlights: ["Santiago", "Valparaíso", "Atacama", "Patagonia", "Isla de Pascua"],
    experiences: [
      {
        id: "chile-wine",
        title: "Ruta del Vino",
        description: "Los mejores vinos del mundo en sus valles",
        price: 750,
        duration: "4 días",
        image: "https://images.unsplash.com/photo-1506377872008-6645d6b2882c?w=300&h=200&fit=crop"
      },
      {
        id: "chile-atacama",
        title: "Desierto de Atacama",
        description: "El desierto más árido del mundo",
        price: 950,
        duration: "6 días",
        image: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=300&h=200&fit=crop"
      }
    ],
    stats: {
      visitors: "980K",
      growth: "+12%",
      satisfaction: "4.5/5",
      experiences: 35
    }
  },
  ecuador: {
    name: "Ecuador",
    flag: "🇪🇨", 
    description: "Pequeño país con enorme biodiversidad, las Galápagos y la mitad del mundo.",
    highlights: ["Quito", "Cuenca", "Galápagos", "Baños", "Mindo"],
    experiences: [
      {
        id: "ecuador-galapagos",
        title: "Islas Galápagos",
        description: "Evolución en vivo en las islas encantadas",
        price: 2200,
        duration: "8 días",
        image: "https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=300&h=200&fit=crop"
      },
      {
        id: "ecuador-andes",
        title: "Aventura Andina",
        description: "Volcanes, mercados y culturas indígenas",
        price: 650,
        duration: "5 días",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop"
      }
    ],
    stats: {
      visitors: "750K",
      growth: "+30%",
      satisfaction: "4.4/5",
      experiences: 28
    }
  }
};

export default function CountryPage() {
  const [match, params] = useRoute("/country/:country");
  const [, setLocation] = useLocation();

  if (!match || !params?.country) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">País no encontrado</h1>
          <Button onClick={() => setLocation("/explore")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Explorar
          </Button>
        </div>
      </div>
    );
  }

  const country = countryData[params.country as keyof typeof countryData];
  
  if (!country) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">País no disponible</h1>
          <p className="text-red-600 mb-4">Este destino estará disponible pronto.</p>
          <Button onClick={() => setLocation("/explore")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Explorar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/explore")}
            className="mb-6"
            data-testid="back-to-explore"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Explorar
          </Button>
          
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">{country.flag}</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-teal-600 bg-clip-text text-transparent mb-4">
              {country.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              {country.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{country.stats.visitors}</div>
              <div className="text-gray-600">Visitantes Anuales</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{country.stats.growth}</div>
              <div className="text-gray-600">Crecimiento</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{country.stats.satisfaction}</div>
              <div className="text-gray-600">Satisfacción</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Gift className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{country.stats.experiences}</div>
              <div className="text-gray-600">Experiencias</div>
            </CardContent>
          </Card>
        </div>

        {/* Highlights */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <MapPin className="w-6 h-6 text-orange-500" />
              Destinos Destacados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {country.highlights.map((highlight) => (
                <Badge 
                  key={highlight} 
                  variant="outline" 
                  className="bg-orange-50 text-orange-700 border-orange-200 px-4 py-2 text-base"
                >
                  {highlight}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experiences */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
            Experiencias Populares
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {country.experiences.map((experience) => (
              <Card 
                key={experience.id} 
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <div className="relative">
                  <img 
                    src={experience.image} 
                    alt={experience.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white text-gray-800 font-semibold">
                      ${experience.price}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 group-hover:text-purple-600 transition-colors">
                    {experience.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{experience.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{experience.duration}</span>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-teal-600 text-white"
                      onClick={() => setLocation(`/lotteries`)}
                      data-testid={`book-experience-${experience.id}`}
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Participar en Lotería
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 via-orange-500 to-teal-500 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">¿Listo para conocer {country.name}?</h2>
          <p className="text-lg mb-6">
            Participa en nuestras loterías de viaje y gana experiencias increíbles
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100"
              onClick={() => setLocation('/lotteries')}
              data-testid="view-country-lotteries"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Ver Loterías Activas
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-600"
              onClick={() => setLocation('/explore')}
              data-testid="explore-more-countries"
            >
              <Plane className="w-5 h-5 mr-2" />
              Explorar Más Países
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}