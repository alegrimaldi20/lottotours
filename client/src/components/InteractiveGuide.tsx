import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet, 
  Coins, 
  Trophy, 
  Store, 
  Users, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Play,
  Lightbulb,
  ArrowRight,
  Star,
  Gift
} from 'lucide-react';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  details: string[];
  tip: string;
}

const guideSteps: GuideStep[] = [
  {
    id: 'connect-wallet',
    title: 'Conecta tu Billetera',
    description: 'Conecta tu billetera Web3 para comenzar a usar VoyageLotto',
    icon: <Wallet className="w-8 h-8" />,
    color: 'from-purple-500 to-purple-600',
    details: [
      'Soportamos MetaMask, WalletConnect y más',
      'Conexión segura con tecnología blockchain',
      'Tu billetera es tu identidad en la plataforma'
    ],
    tip: 'Asegúrate de tener algo de ETH para las transacciones'
  },
  {
    id: 'get-tokens',
    title: 'Obtén Tokens Viator',
    description: 'Compra tokens Viator ($1 USD cada uno) para participar',
    icon: <Coins className="w-8 h-8" />,
    color: 'from-orange-500 to-orange-600',
    details: [
      'Viator: Token principal ($1 USD) para comprar packs',
      'Kairos: Tickets de lotería (18 Raivan = 1 Kairos)',
      'Raivan: Tokens de recompensa por actividades'
    ],
    tip: 'Empieza con el Starter Pack - solo 3 Viator'
  },
  {
    id: 'buy-lottery-tickets',
    title: 'Compra Tickets de Lotería',
    description: 'Usa tokens Kairos para participar en loterías de viaje',
    icon: <Trophy className="w-8 h-8" />,
    color: 'from-teal-500 to-teal-600',
    details: [
      'Elige entre 3 loterías activas permanentemente',
      'Bali Cultural (8 días), Patagonia (10 días), Morocco (12 días)',
      'Sorteos verificados en blockchain cada semana'
    ],
    tip: 'Cada Kairos = 1 ticket. Más tickets = más oportunidades'
  },
  {
    id: 'marketplace',
    title: 'Explora el Marketplace',
    description: 'Compra y vende premios de lotería, NFTs y vouchers',
    icon: <Store className="w-8 h-8" />,
    color: 'from-pink-500 to-pink-600',
    details: [
      'Solo artículos derivados de la plataforma',
      'Premios de lotería transferibles',
      'NFTs de experiencias de viaje únicas'
    ],
    tip: 'Los premios no utilizados pueden venderse a otros usuarios'
  },
  {
    id: 'referral-program',
    title: 'Programa de Referidos',
    description: 'Invita amigos y gana comisiones de hasta 28%',
    icon: <Users className="w-8 h-8" />,
    color: 'from-indigo-500 to-indigo-600',
    details: [
      'Afiliados individuales: 10-18% comisiones',
      'Agencias de viaje: 18-28% comisiones',
      'Seguimiento completo y analíticas'
    ],
    tip: 'Comparte tu código único para empezar a ganar'
  }
];

const platformFeatures = [
  {
    title: 'Sistema de Tokens',
    description: 'Economía de tres tokens integrada',
    icon: <Coins className="w-6 h-6" />,
    gradient: 'from-orange-400 to-orange-600'
  },
  {
    title: 'Loterías Verificadas',
    description: 'Sorteos transparentes en blockchain',
    icon: <Trophy className="w-6 h-6" />,
    gradient: 'from-teal-400 to-teal-600'
  },
  {
    title: 'Marketplace Seguro',
    description: 'Solo artículos de plataforma verificados',
    icon: <Store className="w-6 h-6" />,
    gradient: 'from-purple-400 to-purple-600'
  },
  {
    title: 'Programa de Afiliados',
    description: 'Gana hasta 28% de comisión',
    icon: <Users className="w-6 h-6" />,
    gradient: 'from-pink-400 to-pink-600'
  }
];

export default function InteractiveGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentGuideStep = guideSteps[currentStep];
  const progress = ((currentStep + 1) / guideSteps.length) * 100;

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const markCompleted = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const startInteractiveTour = () => {
    setIsPlaying(true);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (isPlaying && currentStep < guideSteps.length - 1) {
      const timer = setTimeout(() => {
        nextStep();
      }, 5000); // Auto-advance every 5 seconds during interactive tour
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep === guideSteps.length - 1) {
      setIsPlaying(false);
    }
  }, [currentStep, isPlaying]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-teal-600 bg-clip-text text-transparent mb-4">
          Guía Interactiva de VoyageLotto
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Aprende a usar nuestra plataforma paso a paso de manera dinámica y sencilla
        </p>
        <Button 
          onClick={startInteractiveTour}
          className="bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white"
          data-testid="button-start-tour"
        >
          <Play className="w-4 h-4 mr-2" />
          {isPlaying ? 'Tour en Progreso...' : 'Iniciar Tour Interactivo'}
        </Button>
      </div>

      {/* Platform Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {platformFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${feature.gradient} mb-4`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Step Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Steps Navigation */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Pasos de la Guía</h3>
          {guideSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-gradient-to-r from-purple-50 to-orange-50 border-2 border-purple-300' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => setCurrentStep(index)}
              data-testid={`guide-step-${step.id}`}
            >
              <div className={`flex-shrink-0 p-2 rounded-full bg-gradient-to-r ${step.color}`}>
                <div className="text-white">
                  {step.icon}
                </div>
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold text-gray-800">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              {completedSteps.includes(step.id) && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Details */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${currentGuideStep.color}`}>
                    <div className="text-white">
                      {currentGuideStep.icon}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-800">
                      {currentGuideStep.title}
                    </CardTitle>
                    <p className="text-gray-600">{currentGuideStep.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-purple-600 border-purple-300">
                  Paso {currentStep + 1} de {guideSteps.length}
                </Badge>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progreso</span>
                  <span className="text-sm font-semibold text-purple-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Step Details */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Detalles del Paso:</h4>
                <ul className="space-y-2">
                  {currentGuideStep.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <ArrowRight className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tip */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400 p-4 rounded">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-orange-800 mb-1">Consejo:</h5>
                    <p className="text-orange-700">{currentGuideStep.tip}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                  data-testid="button-prev-step"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => markCompleted(currentGuideStep.id)}
                    disabled={completedSteps.includes(currentGuideStep.id)}
                    className="flex items-center gap-2"
                    data-testid="button-mark-completed"
                  >
                    <Check className="w-4 h-4" />
                    {completedSteps.includes(currentGuideStep.id) ? 'Completado' : 'Marcar Completado'}
                  </Button>

                  <Button
                    onClick={nextStep}
                    disabled={currentStep === guideSteps.length - 1}
                    className="bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 flex items-center gap-2"
                    data-testid="button-next-step"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Completion Badge */}
      {completedSteps.length === guideSteps.length && (
        <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300">
          <CardContent className="p-6 text-center">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">¡Felicidades!</h3>
            <p className="text-green-700 mb-4">
              Has completado la guía interactiva. ¡Ahora estás listo para usar VoyageLotto al máximo!
            </p>
            <Button 
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              data-testid="button-start-journey"
            >
              <Star className="w-4 h-4 mr-2" />
              ¡Comenzar mi Viaje!
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}