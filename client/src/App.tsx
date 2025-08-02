import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import { InlineToaster } from "@/components/inline-toast";
import { useLocaleSafeToast } from "@/hooks/use-locale-safe-toast";
import Landing from "./pages/landing";
import Dashboard from "./pages/dashboard";
import Marketplace from "./pages/marketplace";
import Lotteries from "./pages/lotteries";
import LotteryDetail from "./pages/lottery-detail";
import NotFound from "@/pages/not-found";

export const ToastContext = React.createContext<{
  toast: (options: { title?: string; description?: string; variant?: "default" | "destructive" }) => string;
} | null>(null);

function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, toast, removeToast } = useLocaleSafeToast();

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
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/lotteries" component={Lotteries} />
      <Route path="/lottery/:id" component={LotteryDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <ToastProvider>
            <Router />
          </ToastProvider>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
