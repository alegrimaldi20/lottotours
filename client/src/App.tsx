import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import { InlineToaster } from "@/components/inline-toast";
import { useLocaleSafeToast } from "@/hooks/use-locale-safe-toast";
import { LanguageProvider } from "@/lib/i18n";

import Landing from "./pages/landing";
import Dashboard from "./pages/dashboard";
import Marketplace from "./pages/marketplace";
import Lotteries from "./pages/lotteries";
import LotteryDetail from "./pages/lottery-detail";
import TokenShop from "./pages/token-shop";
import Missions from "./pages/missions";
import VerificationDemo from "./pages/verification-demo";
import Profile from "./pages/profile";
import TermsOfService from "./pages/terms-of-service";
import PrivacyPolicy from "./pages/privacy-policy";
import OperatingConditions from "./pages/operating-conditions";
import ServiceConditionsDashboard from "./pages/service-conditions-dashboard";
import WinnerDashboard from "./pages/winner-dashboard";
import AffiliateDashboard from "./pages/affiliate-dashboard";
import CountryOperations from "./pages/country-operations";
import UniqueIds from "./pages/unique-ids";
import LotteryVerification from "./pages/lottery-verification";
import NotFound from "@/pages/not-found";

export const ToastContext = React.createContext<{
  toast: (options: { title?: string; description?: string; variant?: "default" | "destructive" }) => string;
} | null>(null);

function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useLocaleSafeToast();

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
    </ToastContext.Provider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/lotteries" component={Lotteries} />
      <Route path="/lottery/:id" component={LotteryDetail} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/token-shop" component={TokenShop} />
      <Route path="/missions" component={Missions} />
      <Route path="/verification-demo" component={VerificationDemo} />
      <Route path="/profile" component={Profile} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/operating-conditions" component={OperatingConditions} />
      <Route path="/service-conditions" component={ServiceConditionsDashboard} />
      <Route path="/winner-dashboard" component={WinnerDashboard} />
      <Route path="/affiliate-dashboard" component={AffiliateDashboard} />
      <Route path="/country-operations" component={CountryOperations} />
      <Route path="/unique-ids" component={UniqueIds} />
      <Route path="/lottery-verification" component={LotteryVerification} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { toasts, removeToast } = useLocaleSafeToast();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <ToastProvider>
              <Router />
              <InlineToaster toasts={toasts} onRemove={removeToast} />
            </ToastProvider>
          </ErrorBoundary>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;