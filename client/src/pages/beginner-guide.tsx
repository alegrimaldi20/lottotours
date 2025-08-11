import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InteractiveGuide from '@/components/InteractiveGuide';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  ArrowRight, 
  Lightbulb,
  Users,
  Trophy,
  Coins,
  Store,
  Map,
  Star,
  Gift,
  Globe,
  Zap
} from 'lucide-react';

const quickStartSteps = [
  {
    icon: <Coins className="w-6 h-6" />,
    title: 'Conecta tu Billetera',
    description: 'Usa MetaMask o cualquier billetera Web3 compatible',
    time: '2 min',
    difficulty: 'Fácil'
  },
  {
    icon: <Gift className="w-6 h-6" />,
    title: 'Compra tu Primer Pack',
    description: 'Comienza con el Starter Pack (3 Viator = $3 USD)',
    time: '3 min',
    difficulty: 'Fácil'
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Participa en Loterías',
    description: 'Usa tus tokens Kairos para comprar tickets',
    time: '5 min',
    difficulty: 'Medio'
  },
  {
    icon: <Store className="w-6 h-6" />,
    title: 'Explora el Marketplace',
    description: 'Compra y vende premios de otros usuarios',
    time: '10 min',
    difficulty: 'Medio'
  }
];

const faqs = [
  {
    question: '¿Qué hace único a TravelLotto?',
    answer: 'Somos la primera plataforma que combina loterías verificadas en blockchain con experiencias de viaje reales. Todos nuestros premios son experiencias auténticas, no solo tokens.'
  },
  {
    question: '¿Cómo funciona el sistema de tres tokens?',
    answer: 'Viator ($1 USD) se usa para comprar packs. Kairos son tickets de lotería. Raivan son recompensas por actividades. 18 Raivan = 1 Kairos para máxima flexibilidad.'
  },
  {
    question: '¿Los sorteos son realmente justos?',
    answer: 'Sí, todos los sorteos usan tecnología blockchain con algoritmos verificables. Cada sorteo tiene un ID único que puedes verificar en la blockchain.'
  },
  {
    question: '¿Puedo vender mis premios si no los uso?',
    answer: 'Absolutamente. Nuestro marketplace permite vender premios no utilizados a otros usuarios, manteniendo el valor de tu inversión.'
  },
  {
    question: '¿Cómo funciona el programa de referidos?',
    answer: 'Ganas comisiones de 10-28% dependiendo de tu nivel. Comparte tu código único y gana por cada usuario que invites y realice compras.'
  },
  {
    question: '¿En qué países operamos principalmente?',
    answer: 'Nos enfocamos en Sudamérica: Colombia, Perú, Ecuador, Bolivia, Chile, Uruguay, Paraguay, Argentina y Brasil, con planes de expansión global.'
  }
];

const platformBenefits = [
  {
    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
    title: 'Sorteos Verificables',
    description: 'Tecnología blockchain garantiza transparencia total'
  },
  {
    icon: <Globe className="w-8 h-8 text-blue-500" />,
    title: 'Experiencias Reales',
    description: 'Premios de viaje auténticos con agencias verificadas'
  },
  {
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
    title: 'Economía de Tokens',
    description: 'Sistema de tres tokens para máxima flexibilidad'
  },
  {
    icon: <Users className="w-8 h-8 text-purple-500" />,
    title: 'Programa de Afiliados',
    description: 'Gana hasta 28% de comisión invitando amigos'
  }
];

export default function BeginnerGuidePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [, setLocation] = useLocation();

  const markStepCompleted = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-teal-600 bg-clip-text text-transparent mb-4">
            Guía Completa para Principiantes
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Aprende todo lo que necesitas para empezar tu aventura en TravelLotto. 
            Desde conceptos básicos hasta estrategias avanzadas.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-purple-100 text-purple-700 px-4 py-2">
              ⏱️ 15 minutos para comenzar
            </Badge>
            <Badge className="bg-orange-100 text-orange-700 px-4 py-2">
              🎯 Paso a paso
            </Badge>
            <Badge className="bg-teal-100 text-teal-700 px-4 py-2">
              🚀 Interactivo
            </Badge>
          </div>
        </div>

        {/* Quick Start Section */}
        <Card className="mb-12 shadow-lg border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-orange-100">
            <CardTitle className="text-2xl text-purple-800 flex items-center gap-3">
              <Zap className="w-8 h-8" />
              Inicio Rápido - ¡Comienza en 15 Minutos!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStartSteps.map((step, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    completedSteps.includes(index) 
                      ? 'bg-green-50 border-green-300' 
                      : activeStep === index 
                        ? 'bg-purple-50 border-purple-300' 
                        : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveStep(index)}
                  data-testid={`quick-start-step-${index}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-full ${
                        completedSteps.includes(index) 
                          ? 'bg-green-500 text-white' 
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        {completedSteps.includes(index) ? <CheckCircle className="w-6 h-6" /> : step.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">{step.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                    <div className="flex justify-between items-center text-xs">
                      <Badge variant="outline" className="border-blue-300 text-blue-600">
                        {step.time}
                      </Badge>
                      <Badge variant="outline" className={
                        step.difficulty === 'Fácil' 
                          ? 'border-green-300 text-green-600' 
                          : 'border-yellow-300 text-yellow-600'
                      }>
                        {step.difficulty}
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        markStepCompleted(index);
                      }}
                      disabled={completedSteps.includes(index)}
                      data-testid={`mark-completed-${index}`}
                    >
                      {completedSteps.includes(index) ? 'Completado' : 'Marcar Completado'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="interactive" className="mb-12">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="interactive" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Guía Interactiva
            </TabsTrigger>
            <TabsTrigger value="concepts" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Conceptos Básicos
            </TabsTrigger>
            <TabsTrigger value="benefits" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Beneficios
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Preguntas Frecuentes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interactive" className="space-y-8">
            <InteractiveGuide />
          </TabsContent>

          <TabsContent value="concepts" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-purple-700">
                    <Coins className="w-6 h-6" />
                    Sistema de Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        V
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-800">Viator</h4>
                        <p className="text-sm text-yellow-700">Token principal - $1 USD cada uno</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        K
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-800">Kairos</h4>
                        <p className="text-sm text-purple-700">Tickets de lotería (18 Raivan = 1 Kairos)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        R
                      </div>
                      <div>
                        <h4 className="font-semibold text-teal-800">Raivan</h4>
                        <p className="text-sm text-teal-700">Recompensas por actividades y misiones</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-orange-700">
                    <Trophy className="w-6 h-6" />
                    Loterías Activas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-1">Bali Cultural Immersion</h4>
                      <p className="text-sm text-orange-700 mb-2">8 días de experiencia cultural auténtica</p>
                      <Badge className="bg-orange-200 text-orange-800">LT2025-101</Badge>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-1">Patagonia Wilderness</h4>
                      <p className="text-sm text-blue-700 mb-2">10 días de aventura extrema</p>
                      <Badge className="bg-blue-200 text-blue-800">LT2025-102</Badge>
                    </div>
                    
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-1">Morocco Desert & Cities</h4>
                      <p className="text-sm text-red-700 mb-2">12 días de cultura milenaria</p>
                      <Badge className="bg-red-200 text-red-800">LT2025-103</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {platformBenefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      {benefit.icon}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-600 via-orange-500 to-teal-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para Comenzar tu Aventura?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Ahora que conoces los conceptos básicos, es hora de vivir la experiencia TravelLotto
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100"
                data-testid="button-start-journey"
                onClick={() => setLocation('/dashboard')}
              >
                <Play className="w-5 h-5 mr-2" />
                Comenzar Ahora
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-purple-600"
                data-testid="button-explore-lotteries"
                onClick={() => setLocation('/lotteries')}
              >
                <Map className="w-5 h-5 mr-2" />
                Explorar Loterías
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}