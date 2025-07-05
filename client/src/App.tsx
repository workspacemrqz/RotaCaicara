import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/context/SettingsContext";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Category from "@/pages/category";
import BusinessDetail from "@/pages/business-detail";
import Advertise from "@/pages/advertise";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  useScrollToTop(); // Automatically scroll to top on route changes

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:slug" component={Category} />
      <Route path="/business/:id" component={BusinessDetail} />
      <Route path="/advertise" component={Advertise} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;