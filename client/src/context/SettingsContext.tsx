
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

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
  instagramUrl: string;
  whatsappUrl: string;
  facebookUrl: string;
  whatsapp: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  faq1Question: string;
  faq1Answer: string;
  faq2Question: string;
  faq2Answer: string;
  faq3Question: string;
  faq3Answer: string;
  faq4Question: string;
  faq4Answer: string;
  createdAt: string;
  updatedAt: string;
}

interface SettingsContextType {
  settings: SiteSettings | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/site-settings'],
    queryFn: () => apiRequest('/api/site-settings'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  const value = {
    settings: settings || null,
    isLoading,
    error: error as Error | null,
    refetch,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
