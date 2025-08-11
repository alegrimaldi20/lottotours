import { useState, useEffect, createContext, useContext, createElement } from 'react';

export type Language = 'en' | 'es' | 'pt';

export interface Translations {
  // Navigation
  dashboard: string;
  lotteries: string;
  ticketHistory: string;
  marketplace: string;
  missions: string;
  tokenManagement: string;
  profile: string;
  myPrizes: string;
  affiliateProgram: string;
  countryOperations: string;
  uniqueIds: string;
  menu: string;
  
  // Common actions
  loading: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  view: string;
  back: string;
  next: string;
  previous: string;
  close: string;
  
  // Dashboard
  welcomeBack: string;
  readyForAdventure: string;
  totalTokens: string;
  level: string;
  missionsCompleted: string;
  activeLotteries: string;
  quickActions: string;
  
  // Lotteries
  activeTravelLotteries: string;
  enterLotteries: string;
  ticketsAvailable: string;
  drawDate: string;
  prizeValue: string;
  buyTicket: string;
  insufficientTokens: string;
  ticketPurchased: string;
  
  // Marketplace
  prizeMarketplace: string;
  redeemTokens: string;
  tokensAvailable: string;
  tokensRequired: string;
  availability: string;
  soldOut: string;
  redeem: string;
  
  // Missions
  missionControl: string;
  completeMissions: string;
  missionsAvailable: string;
  startMission: string;
  completeMission: string;
  missionCompleted: string;
  tokensEarned: string;
  
  // Profile
  userProfile: string;
  personalInfo: string;
  accountSettings: string;
  language: string;
  favorites: string;
  statistics: string;
  tokenHistory: string;
  
  // Languages
  english: string;
  spanish: string;
  portuguese: string;
  
  // Profile dropdown
  viewProfile: string;
  settings: string;
  help: string;
  logout: string;
  
  // Favorites
  addedToFavorites: string;
  removedFromFavorites: string;
  myFavorites: string;
  
  // Countries
  colombia: string;
  peru: string;
  ecuador: string;
  bolivia: string;
  chile: string;
  uruguay: string;
  paraguay: string;
  argentina: string;
  brazil: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    lotteries: 'Lotteries',
    ticketHistory: 'My Tickets',
    marketplace: 'Marketplace',
    missions: 'Missions',
    tokenManagement: 'Token Management',
    profile: 'Profile',
    myPrizes: 'My Prizes',
    affiliateProgram: 'Affiliate Program',
    countryOperations: 'Country Operations',
    uniqueIds: 'Unique IDs',
    menu: 'Menu',
    
    // Common actions
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    
    // Dashboard
    welcomeBack: 'Welcome back',
    readyForAdventure: 'Ready for your next adventure? Complete missions and enter lotteries to win amazing prizes!',
    totalTokens: 'Total Tokens',
    level: 'Level',
    missionsCompleted: 'Missions Completed',
    activeLotteries: 'Active Lotteries',
    quickActions: 'Quick Actions',
    
    // Lotteries
    activeTravelLotteries: 'Active Travel Lotteries',
    enterLotteries: 'Enter exciting lotteries for a chance to win amazing travel packages and experiences',
    ticketsAvailable: 'tickets available',
    drawDate: 'Draw Date',
    prizeValue: 'Prize Value',
    buyTicket: 'Buy Ticket',
    insufficientTokens: 'Insufficient tokens',
    ticketPurchased: 'Ticket purchased successfully!',
    
    // Marketplace
    prizeMarketplace: 'Prize Marketplace',
    redeemTokens: 'Redeem your hard-earned tokens for amazing travel packages, experiences, and exclusive rewards',
    tokensAvailable: 'Tokens Available',
    tokensRequired: 'tokens required',
    availability: 'left',
    soldOut: 'Sold Out',
    redeem: 'Redeem',
    
    // Missions
    missionControl: 'Mission Control',
    completeMissions: 'Complete missions with advanced verification systems to earn tokens and unlock travel rewards',
    missionsAvailable: 'missions available',
    startMission: 'Start Mission',
    completeMission: 'Complete Mission',
    missionCompleted: 'Mission Completed!',
    tokensEarned: 'tokens earned',
    
    // Profile
    userProfile: 'User Profile',
    personalInfo: 'Personal Information',
    accountSettings: 'Account Settings',
    language: 'Language',
    favorites: 'Favorites',
    statistics: 'Statistics',
    tokenHistory: 'Token History',
    
    // Languages
    english: 'English',
    spanish: 'Español',
    portuguese: 'Português',
    
    // Profile dropdown
    viewProfile: 'View Profile',
    settings: 'Settings',
    help: 'Help & Support',
    logout: 'Sign Out',
    
    // Favorites
    addedToFavorites: 'Added to favorites',
    removedFromFavorites: 'Removed from favorites',
    myFavorites: 'My Favorites',
    
    // Countries
    colombia: 'Colombia',
    peru: 'Peru',
    ecuador: 'Ecuador',
    bolivia: 'Bolivia',
    chile: 'Chile',
    uruguay: 'Uruguay',
    paraguay: 'Paraguay',
    argentina: 'Argentina',
    brazil: 'Brazil',
  },
  es: {
    // Navigation
    dashboard: 'Panel Principal',
    lotteries: 'Loterías',
    ticketHistory: 'Mis Boletos',
    marketplace: 'Mercado',
    missions: 'Misiones',
    tokenManagement: 'Gestión de Tokens',
    profile: 'Perfil',
    myPrizes: 'Mis Premios',
    affiliateProgram: 'Programa de Afiliados',
    countryOperations: 'Operaciones por País',
    uniqueIds: 'IDs Únicos',
    menu: 'Menú',
    
    // Common actions
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    view: 'Ver',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    close: 'Cerrar',
    
    // Dashboard
    welcomeBack: 'Bienvenido de vuelta',
    readyForAdventure: '¿Listo para tu próxima aventura? ¡Completa misiones y participa en loterías para ganar premios increíbles!',
    totalTokens: 'Tokens Totales',
    level: 'Nivel',
    missionsCompleted: 'Misiones Completadas',
    activeLotteries: 'Loterías Activas',
    quickActions: 'Acciones Rápidas',
    
    // Lotteries
    activeTravelLotteries: 'Loterías de Viaje Activas',
    enterLotteries: 'Participa en emocionantes loterías para ganar increíbles paquetes de viaje y experiencias',
    ticketsAvailable: 'boletos disponibles',
    drawDate: 'Fecha del Sorteo',
    prizeValue: 'Valor del Premio',
    buyTicket: 'Comprar Boleto',
    insufficientTokens: 'Tokens insuficientes',
    ticketPurchased: '¡Boleto comprado exitosamente!',
    
    // Marketplace
    prizeMarketplace: 'Mercado de Premios',
    redeemTokens: 'Canjea tus tokens ganados por increíbles paquetes de viaje, experiencias y recompensas exclusivas',
    tokensAvailable: 'Tokens Disponibles',
    tokensRequired: 'tokens requeridos',
    availability: 'disponibles',
    soldOut: 'Agotado',
    redeem: 'Canjear',
    
    // Missions
    missionControl: 'Control de Misiones',
    completeMissions: 'Completa misiones con sistemas de verificación avanzados para ganar tokens y desbloquear recompensas de viaje',
    missionsAvailable: 'misiones disponibles',
    startMission: 'Iniciar Misión',
    completeMission: 'Completar Misión',
    missionCompleted: '¡Misión Completada!',
    tokensEarned: 'tokens ganados',
    
    // Profile
    userProfile: 'Perfil de Usuario',
    personalInfo: 'Información Personal',
    accountSettings: 'Configuración de Cuenta',
    language: 'Idioma',
    favorites: 'Favoritos',
    statistics: 'Estadísticas',
    tokenHistory: 'Historial de Tokens',
    
    // Languages
    english: 'English',
    spanish: 'Español',
    portuguese: 'Português',
    
    // Profile dropdown
    viewProfile: 'Ver Perfil',
    settings: 'Configuración',
    help: 'Ayuda y Soporte',
    logout: 'Cerrar Sesión',
    
    // Favorites
    addedToFavorites: 'Agregado a favoritos',
    removedFromFavorites: 'Eliminado de favoritos',
    myFavorites: 'Mis Favoritos',
    
    // Countries
    colombia: 'Colombia',
    peru: 'Perú',
    ecuador: 'Ecuador',
    bolivia: 'Bolivia',
    chile: 'Chile',
    uruguay: 'Uruguay',
    paraguay: 'Paraguay',
    argentina: 'Argentina',
    brazil: 'Brasil',
  },
  pt: {
    // Navigation
    dashboard: 'Painel',
    lotteries: 'Loterias',
    ticketHistory: 'Meus Bilhetes',
    marketplace: 'Mercado',
    missions: 'Missões',
    tokenManagement: 'Gestão de Tokens',
    profile: 'Perfil',
    myPrizes: 'Meus Prêmios',
    affiliateProgram: 'Programa de Afiliados',
    countryOperations: 'Operações por País',
    uniqueIds: 'IDs Únicos',
    menu: 'Menu',
    
    // Common actions
    loading: 'Carregando...',
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    view: 'Visualizar',
    back: 'Voltar',
    next: 'Próximo',
    previous: 'Anterior',
    close: 'Fechar',
    
    // Dashboard
    welcomeBack: 'Bem-vindo de volta',
    readyForAdventure: 'Pronto para sua próxima aventura? Complete missões e participe de loterias para ganhar prêmios incríveis!',
    totalTokens: 'Tokens Totais',
    level: 'Nível',
    missionsCompleted: 'Missões Concluídas',
    activeLotteries: 'Loterias Ativas',
    quickActions: 'Ações Rápidas',
    
    // Loterias
    activeTravelLotteries: 'Loterias de Viagem Ativas',
    enterLotteries: 'Participe de loterias emocionantes para ganhar pacotes de viagem e experiências incríveis',
    ticketsAvailable: 'bilhetes disponíveis',
    drawDate: 'Data do Sorteio',
    prizeValue: 'Valor do Prêmio',
    buyTicket: 'Comprar Bilhete',
    insufficientTokens: 'Tokens insuficientes',
    ticketPurchased: 'Bilhete comprado com sucesso!',
    
    // Marketplace
    prizeMarketplace: 'Mercado de Prêmios',
    redeemTokens: 'Resgate seus tokens conquistados por incríveis pacotes de viagem, experiências e recompensas exclusivas',
    tokensAvailable: 'Tokens Disponíveis',
    tokensRequired: 'tokens necessários',
    availability: 'restantes',
    soldOut: 'Esgotado',
    redeem: 'Resgatar',
    
    // Missions
    missionControl: 'Controle de Missões',
    completeMissions: 'Complete missões com sistemas de verificação avançados para ganhar tokens e desbloquear recompensas de viagem',
    missionsAvailable: 'missões disponíveis',
    startMission: 'Iniciar Missão',
    completeMission: 'Completar Missão',
    missionCompleted: 'Missão Concluída!',
    tokensEarned: 'tokens ganhos',
    
    // Profile
    userProfile: 'Perfil do Usuário',
    personalInfo: 'Informações Pessoais',
    accountSettings: 'Configurações da Conta',
    language: 'Idioma',
    favorites: 'Favoritos',
    statistics: 'Estatísticas',
    tokenHistory: 'Histórico de Tokens',
    
    // Languages
    english: 'English',
    spanish: 'Español',
    portuguese: 'Português',
    
    // Profile dropdown
    viewProfile: 'Ver Perfil',
    settings: 'Configurações',
    help: 'Ajuda e Suporte',
    logout: 'Sair',
    
    // Favorites
    addedToFavorites: 'Adicionado aos favoritos',
    removedFromFavorites: 'Removido dos favoritos',
    myFavorites: 'Meus Favoritos',
    
    // Countries
    colombia: 'Colômbia',
    peru: 'Peru',
    ecuador: 'Equador',
    bolivia: 'Bolívia',
    chile: 'Chile',
    uruguay: 'Uruguai',
    paraguay: 'Paraguai',
    argentina: 'Argentina',
    brazil: 'Brasil',
  },
};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: any }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get from localStorage or default to English
    const saved = localStorage.getItem('travelotto-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('travelotto-language', language);
  }, [language]);

  const t = (key: keyof Translations): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export { LanguageContext, translations };