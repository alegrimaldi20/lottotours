import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useLocaleSafeToast } from "@/hooks/use-locale-safe-toast";
import { Calendar, Clock, MapPin, Users, Star, Ticket, Sparkles, Shuffle } from "lucide-react";
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Loterías de Viajes TravelLotto
        </h1>
        <p className="text-xl text-muted-foreground mt-2">
          Gana increíbles experiencias de viaje con nuestras loterías exclusivas
        </p>
        {user && (
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Sparkles className="h-4 w-4 mr-1" />
              {user.kairosTokens} Tokens Kairos
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {user.raivanTokens} Tokens Raivan
            </Badge>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {lotteries?.map((lottery) => {
          const details = lotteryDetails[lottery.id];
          const imageUrl = lotteryImages[lottery.id];
          const progress = (lottery.soldTickets / lottery.maxTickets) * 100;
          
          return (
            <Card key={lottery.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <img
                  src={imageUrl}
                  alt={lottery.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-orange-500 text-white">
                    {lottery.lotteryCode}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    <Ticket className="h-4 w-4 mr-1" />
                    {lottery.ticketPrice} Kairos
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-2xl">{lottery.title}</CardTitle>
                <CardDescription className="text-lg">
                  {lottery.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>Sorteo: {formatDate(lottery.drawDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>Duración: {details?.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-orange-500" />
                    <span>Dificultad: {details?.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span>Mejor época: {details?.bestTime}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2 text-lg">Premio: {lottery.prizeTitle}</h4>
                  <p className="text-muted-foreground mb-3">{lottery.prizeDescription}</p>
                  <p className="text-2xl font-bold text-orange-600">
                    Valor: {formatPrice(lottery.prizeValue)}
                  </p>
                </div>

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
  );
}