import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

interface SiteSettings {
  id: number;
  siteName: string;
  locality: string;
  headline1: string;
  headline2: string;
  headline3: string;
  headline4: string;
  tagline1: string;
  tagline2: string;
  tagline3: string;
  tagline4: string;
  phone: string;
  email: string;
  address: string;
  logoUrl?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  facebookUrl?: string;
  footerDescription?: string;
  advertiseHeadline?: string;
  advertiseSubtitle1?: string;
  advertiseSubtitle2?: string;
  faq1Question?: string;
  faq1Answer?: string;
  faq2Question?: string;
  faq2Answer?: string;
  faq3Question?: string;
  faq3Answer?: string;
  faq4Question?: string;
  faq4Answer?: string;
  updatedAt: string;
}

interface SettingsContextType {
  settings: SiteSettings | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/admin/settings"],
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        isLoading, 
        error: error as Error | null, 
        refetch 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}