import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useLocaleSafeToast } from "@/hooks/use-locale-safe-toast";
import { Calendar, Clock, MapPin, Users, Star, Ticket, Sparkles, Shuffle, Gift, Trophy, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Import generated travel images
import patagoniaImage from "@assets/generated_images/Patagonia_wilderness_adventure_caaea0bd.png";
import moroccoImage from "@assets/generated_images/Morocco_desert_cities_experience_8e820f54.png";
import baliImage from "@assets/generated_images/Bali_cultural_immersion_experience_a657a7e1.png";
import vipImage from "@assets/generated_images/VIP_ultimate_world_experience_8dedac74.png";

interface Lottery {
  id: string;
  title: string;
  description: string;
  theme: string;
  prizeTitle: string;
  prizeDescription: string;
  prizeValue: number;
  ticketPrice: number;
  maxTickets: number;
  soldTickets: number;
  drawDate: string;
  status: string;
  lotteryCode: string;
  image: string;
}

interface User {
  id: string;
  kairosTokens: number;
  raivanTokens: number;
}

// Mapeo de imágenes reales para cada lotería
const lotteryImages: Record<string, string> = {
  "lottery-patagonia-expedition": patagoniaImage,
  "lottery-morocco-magic": moroccoImage,
  "lottery-bali-adventure": baliImage,
  "lottery-vip-ultimate-world": vipImage,
};

// Descripciones detalladas de cada paquete
const lotteryDetails: Record<string, {
  includes: string[];
  highlights: string[];
  duration: string;
  difficulty: string;
  bestTime: string;
}> = {
  "lottery-patagonia-expedition": {
    includes: [
      "10 días y 9 noches de alojamiento",
      "Guías especializados en montañismo",
      "Equipo de trekking profesional",
      "Transporte 4x4 en terrenos difíciles",
      "Comidas gourmet en refugios de montaña",
      "Seguro de aventura completo"
    ],
    highlights: [
      "Torres del Paine National Park",
      "Glaciar Perito Moreno",
      "Avistamiento de cóndores y pumas",
      "Kayak en lagos glaciares",
      "Fotografía de vida silvestre"
    ],
    duration: "10 días",
    difficulty: "Intermedio-Avanzado", 
    bestTime: "Noviembre a Marzo"
  },
  "lottery-morocco-magic": {
    includes: [
      "12 días en riads de lujo",
      "Guía cultural especializado",
      "Transporte privado en 4x4",
      "Experiencia en el desierto del Sahara",
      "Clases de cocina marroquí",
      "Espectáculos folclóricos tradicionales"
    ],
    highlights: [
      "Medina de Marrakech y Fez",
      "Campamento luxury en el Sahara",
      "Paseo en camello al atardecer",
      "Mercados de especias y artesanías",
      "Hammam tradicional y spa"
    ],
    duration: "12 días",
    difficulty: "Fácil-Intermedio",
    bestTime: "Octubre a Abril"
  },
  "lottery-bali-adventure": {
    includes: [
      "8 días en villa de lujo privada",
      "Guía cultural balinés",
      "Clases de yoga y meditación",
      "Ceremonias tradicionales balinesas",
      "Tratamientos de spa naturales",
      "Excursiones a templos antiguos"
    ],
    highlights: [
      "Templos de Ubud y Tanah Lot",
      "Terrazas de arroz de Jatiluwih",
      "Volcán Mount Batur al amanecer",
      "Playas vírgenes de Nusa Penida",
      "Mercados locales y artesanos"
    ],
    duration: "8 días",
    difficulty: "Fácil",
    bestTime: "Abril a Octubre"
  },
  "lottery-vip-ultimate-world": {
    includes: [
      "30 días de lujo absoluto",
      "Jet privado para todos los traslados",
      "Suites presidenciales en hoteles 5 estrellas",
      "Mayordomo personal las 24 horas",
      "Acceso VIP a sitios exclusivos",
      "Experiencias gastronómicas Michelin"
    ],
    highlights: [
      "12 destinos de ensueño",
      "Safaris privados en África",
      "Crucero de lujo en el Mediterráneo",
      "Experiencias gastronómicas únicas",
      "Acceso exclusivo a eventos privados"
    ],
    duration: "30 días",
    difficulty: "Lujo Total",
    bestTime: "Todo el año"
  }
};

// Componente de cuenta regresiva
const CountdownTimer = ({ drawDate }: { drawDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const targetDate = new Date(drawDate).getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [drawDate]);

  return (
    <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg p-4 text-white">
      <div className="text-center">
        <p className="text-sm font-medium mb-2">⏰ Próximo sorteo en:</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-white/20 rounded p-2">
            <div className="text-xl font-bold">{timeLeft.days}</div>
            <div className="text-xs">Días</div>
          </div>
          <div className="bg-white/20 rounded p-2">
            <div className="text-xl font-bold">{timeLeft.hours}</div>
            <div className="text-xs">Hrs</div>
          </div>
          <div className="bg-white/20 rounded p-2">
            <div className="text-xl font-bold">{timeLeft.minutes}</div>
            <div className="text-xs">Min</div>
          </div>
          <div className="bg-white/20 rounded p-2">
            <div className="text-xl font-bold">{timeLeft.seconds}</div>
            <div className="text-xs">Seg</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de cofre sorpresa
const SurpriseChest = ({ isOpen, onOpen }: { isOpen: boolean; onOpen: () => void }) => {
  return (
    <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg border-2 border-yellow-300">
      <div className="text-4xl mb-2 animate-pulse">
        {isOpen ? "🎁" : "📦"}
      </div>
      <p className="text-sm font-medium text-yellow-800 mb-2">
        {isOpen ? "¡Cofre abierto!" : "Cofre Sorpresa"}
      </p>
      {!isOpen ? (
        <Button
          size="sm"
          variant="outline"
          onClick={onOpen}
          className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600"
        >
          Abrir
        </Button>
      ) : (
        <div className="space-y-1">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            +50 XP Bonus
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            NFT Destino
          </Badge>
        </div>
      )}
    </div>
  );
};

// Componente de historial de ganadores
const WinnersHistory = () => {
  const mockWinners = [
    { name: "María C.", country: "🇪🇸 España", lottery: "Bali Adventure", date: "15 Dic 2024" },
    { name: "Carlos M.", country: "🇲🇽 México", lottery: "Patagonia Trek", date: "8 Dic 2024" },
    { name: "Ana L.", country: "🇦🇷 Argentina", lottery: "Morocco Magic", date: "1 Dic 2024" },
  ];

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-600" />
        Ganadores Recientes
      </h3>
      <div className="space-y-3">
        {mockWinners.map((winner, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {winner.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-sm">{winner.name}</p>
                <p className="text-xs text-muted-foreground">{winner.country}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">{winner.lottery}</p>
              <p className="text-xs text-muted-foreground">{winner.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de misiones temáticas
const ThematicMissions = ({ lotteryTheme }: { lotteryTheme: string }) => {
  const missionsByTheme: Record<string, { title: string; reward: string; icon: string }[]> = {
    "bali": [
      { title: "Aprende sobre templos balineses", reward: "+25% chances", icon: "🛕" },
      { title: "Descubre la cultura local", reward: "+1 Boleto gratis", icon: "🎭" }
    ],
    "patagonia": [
      { title: "Completa desafío de montaña", reward: "+30% chances", icon: "🏔️" },
      { title: "Fotografía vida silvestre", reward: "+1 Boleto gratis", icon: "📸" }
    ],
    "morocco": [
      { title: "Explora mercados tradicionales", reward: "+25% chances", icon: "🏺" },
      { title: "Aprende sobre cultura bereber", reward: "+1 Boleto gratis", icon: "🐪" }
    ],
    "vip": [
      { title: "Completa experiencia VIP", reward: "+50% chances", icon: "✨" },
      { title: "Colecciona NFTs premium", reward: "+2 Boletos gratis", icon: "💎" }
    ]
  };

  const missions = missionsByTheme[lotteryTheme] || [];

  if (missions.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 border-2 border-purple-200">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-800">
        <Target className="h-4 w-4" />
        Misiones Temáticas
      </h4>
      <div className="space-y-2">
        {missions.map((mission, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-white/70 rounded">
            <div className="flex items-center gap-2">
              <span className="text-lg">{mission.icon}</span>
              <span className="text-sm font-medium">{mission.title}</span>
            </div>
            <Badge variant="secondary" className="bg-purple-200 text-purple-800 text-xs">
              {mission.reward}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de selección de números
const NumberSelector = ({ 
  selectedNumbers, 
  onNumberToggle, 
  onQuickPick, 
  onClear 
}: {
  selectedNumbers: number[];
  onNumberToggle: (num: number) => void;
  onQuickPick: () => void;
  onClear: () => void;
}) => {
  const numbers = Array.from({ length: 49 }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Selecciona 6 números (1-49)</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onQuickPick}
            disabled={selectedNumbers.length === 6}
            data-testid="button-quick-pick"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Selección Automática
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            disabled={selectedNumbers.length === 0}
            data-testid="button-clear-numbers"
          >
            Limpiar
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Números seleccionados: {selectedNumbers.length}/6
        {selectedNumbers.length > 0 && (
          <span className="ml-2 font-medium">
            [{selectedNumbers.sort((a, b) => a - b).join(", ")}]
          </span>
        )}
      </div>

      <div className="grid grid-cols-7 gap-2 max-w-lg">
        {numbers.map((num) => (
          <Button
            key={num}
            variant={selectedNumbers.includes(num) ? "default" : "outline"}
            size="sm"
            onClick={() => onNumberToggle(num)}
            disabled={selectedNumbers.length >= 6 && !selectedNumbers.includes(num)}
            className={cn(
              "h-10 w-10 p-0 text-sm font-semibold",
              selectedNumbers.includes(num) && "bg-orange-500 hover:bg-orange-600 text-white"
            )}
            data-testid={`number-${num}`}
          >
            {num}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default function LotteriesRestructured() {
  const [selectedLottery, setSelectedLottery] = useState<string | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openChests, setOpenChests] = useState<Set<string>>(new Set());
  const { toast } = useLocaleSafeToast();
  const queryClient = useQueryClient();

  // Consultas para obtener datos
  const { data: lotteries, isLoading: lotteriesLoading } = useQuery<Lottery[]>({
    queryKey: ["/api/lotteries"],
  });

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", "sample-user"],
  });

  // Mutación para comprar boleto
  const purchaseTicket = useMutation({
    mutationFn: async ({ lotteryId, selectedNumbers, isAutoGenerated }: {
      lotteryId: string;
      selectedNumbers: number[];
      isAutoGenerated: boolean;
    }) => {
      const response = await fetch(`/api/lotteries/${lotteryId}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedNumbers, isAutoGenerated }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al comprar boleto");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: "¡Éxito!", description: "Boleto comprado exitosamente" });
      setSelectedNumbers([]);
      setSelectedLottery(null);
      queryClient.invalidateQueries({ queryKey: ["/api/lotteries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleNumberToggle = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(prev => prev.filter(n => n !== num));
    } else if (selectedNumbers.length < 6) {
      setSelectedNumbers(prev => [...prev, num]);
    }
  };

  const handleQuickPick = () => {
    const availableNumbers = Array.from({ length: 49 }, (_, i) => i + 1);
    const randomNumbers: number[] = [];
    
    while (randomNumbers.length < 6) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const randomNumber = availableNumbers[randomIndex];
      if (!randomNumbers.includes(randomNumber)) {
        randomNumbers.push(randomNumber);
      }
    }
    
    setSelectedNumbers(randomNumbers.sort((a, b) => a - b));
  };

  const handleClearNumbers = () => {
    setSelectedNumbers([]);
  };

  const handleOpenChest = (lotteryId: string) => {
    setOpenChests(prev => new Set(Array.from(prev).concat(lotteryId)));
    toast({ title: "¡Cofre abierto!", description: "Has ganado XP bonus y un NFT del destino" });
  };

  const handlePurchase = async (lotteryId: string, isAutoGenerated: boolean = false) => {
    if (!user) {
      toast({ title: "Error", description: "Usuario no encontrado", variant: "destructive" });
      return;
    }

    const lottery = lotteries?.find(l => l.id === lotteryId);
    if (!lottery) {
      toast({ title: "Error", description: "Lotería no encontrada", variant: "destructive" });
      return;
    }

    if (user.kairosTokens < lottery.ticketPrice) {
      toast({ title: "Error", description: "No tienes suficientes tokens Kairos", variant: "destructive" });
      return;
    }

    let numbersToUse = selectedNumbers;
    if (isAutoGenerated || selectedNumbers.length === 0) {
      const availableNumbers = Array.from({ length: 49 }, (_, i) => i + 1);
      const randomNumbers: number[] = [];
      
      while (randomNumbers.length < 6) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const randomNumber = availableNumbers[randomIndex];
        if (!randomNumbers.includes(randomNumber)) {
          randomNumbers.push(randomNumber);
        }
      }
      numbersToUse = randomNumbers;
    }

    if (numbersToUse.length !== 6) {
      toast({ title: "Error", description: "Debes seleccionar exactamente 6 números", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await purchaseTicket.mutateAsync({
        lotteryId,
        selectedNumbers: numbersToUse,
        isAutoGenerated: isAutoGenerated || selectedNumbers.length === 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toLocaleString("es-ES")} USD`;
  };

  if (lotteriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando loterías...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dark">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gradient-primary mb-4 shimmer">
            🌍 Loterías de Viajes TravelLotto
          </h1>
          <p className="text-2xl text-white/90 mb-2">
            Cada boleto es una posibilidad. Cada destino es real.
          </p>
          <p className="text-lg text-white/70 mb-6">
            ✨ <em>"Participa en loterías temáticas y desbloquea la oportunidad de viajar por el mundo"</em>
          </p>
          {user && (
            <div className="flex justify-center gap-6 mt-6">
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                <Sparkles className="h-5 w-5 mr-2" />
                {user.kairosTokens} Tokens Kairos
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 border-2">
                <Zap className="h-5 w-5 mr-2" />
                {user.raivanTokens} Tokens Raivan
              </Badge>
            </div>
          )}
        </div>

        {/* Historial de ganadores */}
        <div className="mb-8">
          <WinnersHistory />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {lotteries?.map((lottery) => {
            const details = lotteryDetails[lottery.id];
            const imageUrl = lotteryImages[lottery.id];
            const progress = (lottery.soldTickets / lottery.maxTickets) * 100;
            const lotteryTheme = lottery.id.split("-")[1]; // Extract theme from ID
            const isChestOpen = openChests.has(lottery.id);
            
            return (
              <Card key={lottery.id} className="overflow-hidden glass-dark hover:glow-primary transition-all duration-300 hover:scale-[1.02] border-2 border-white/20 hover:border-white/40">
                <div className="relative h-64">
                  <img
                    src={imageUrl}
                    alt={lottery.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-orange-500 text-white text-sm px-3 py-1">
                      {lottery.lotteryCode}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900 text-sm px-3 py-1">
                      <Ticket className="h-4 w-4 mr-1" />
                      {lottery.ticketPrice} Kairos
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-white text-xl font-bold mb-1">{lottery.title}</h2>
                    <p className="text-white/90 text-sm">✈️ Este destino puede ser tuyo</p>
                  </div>
                </div>

                <CardContent className="space-y-6 p-6">
                  {/* Fecha del sorteo */}
                  <div className="text-center p-4 gradient-primary rounded-lg border-2 border-white/20 glow-primary">
                    <div className="flex items-center justify-center gap-2 text-white mb-2">
                      <Calendar className="h-5 w-5" />
                      <span className="font-semibold">Fecha del Sorteo</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {formatDate(lottery.drawDate)}
                    </p>
                  </div>

                  {/* Cuenta regresiva */}
                  <CountdownTimer drawDate={lottery.drawDate} />

                  {/* Descripción del premio */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">{lottery.prizeTitle}</h3>
                    <p className="text-muted-foreground mb-3">{lottery.prizeDescription}</p>
                    <p className="text-3xl font-bold text-gradient-gold">
                      Valor: {formatPrice(lottery.prizeValue)}
                    </p>
                  </div>

                  <Separator />

                  {/* Misiones temáticas */}
                  <ThematicMissions lotteryTheme={lotteryTheme} />

                  <Separator />

                  {/* Cofre sorpresa */}
                  <div className="grid grid-cols-2 gap-4">
                    <SurpriseChest 
                      isOpen={isChestOpen} 
                      onOpen={() => handleOpenChest(lottery.id)} 
                    />
                    <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border-2 border-blue-200">
                      <div className="text-3xl mb-2">🎯</div>
                      <p className="text-sm font-medium text-blue-800 mb-1">Probabilidades</p>
                      <p className="text-lg font-bold text-blue-600">
                        1 en {lottery.maxTickets}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {details && (
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold mb-2">¿Qué incluye?</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {details.includes.slice(0, 3).map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-orange-500">•</span>
                              {item}
                            </li>
                          ))}
                          {details.includes.length > 3 && (
                            <li className="text-orange-500 font-medium">
                              +{details.includes.length - 3} beneficios más...
                            </li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold mb-2">Highlights del viaje</h5>
                        <div className="flex flex-wrap gap-2">
                          {details.highlights.slice(0, 3).map((highlight, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Boletos vendidos</span>
                      <span className="text-sm text-muted-foreground">
                        {lottery.soldTickets} / {lottery.maxTickets}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    {selectedLottery === lottery.id ? (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <NumberSelector
                          selectedNumbers={selectedNumbers}
                          onNumberToggle={handleNumberToggle}
                          onQuickPick={handleQuickPick}
                          onClear={handleClearNumbers}
                        />
                        
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handlePurchase(lottery.id, false)}
                            disabled={selectedNumbers.length !== 6 || isLoading}
                            className="flex-1"
                            data-testid={`button-purchase-manual-${lottery.id}`}
                          >
                            Comprar Boleto Manual
                          </Button>
                          <Button
                            onClick={() => handlePurchase(lottery.id, true)}
                            disabled={isLoading}
                            variant="outline"
                            className="flex-1"
                            data-testid={`button-purchase-auto-${lottery.id}`}
                          >
                            Comprar Boleto Automático
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedLottery(null);
                            setSelectedNumbers([]);
                          }}
                          className="w-full"
                          data-testid={`button-cancel-${lottery.id}`}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setSelectedLottery(lottery.id)}
                        size="lg"
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                        data-testid={`button-select-lottery-${lottery.id}`}
                      >
                        <Ticket className="h-5 w-5 mr-2" />
                        Participar en esta Lotería
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}