import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

interface SiteSettings {
  id: number;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  socialInstagram: string;
  socialFacebook: string;
  socialYoutube: string;
  heroTitle: string;
  heroDescription: string;
  announceTitle: string;
  announceDescription: string;
  announceFormUrl: string;
}

interface SettingsContextType {
  settings: SiteSettings | null;
  isLoading: boolean;
  error: Error | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

async function fetchSettings() {
  const response = await fetch('/api/admin/settings');
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  return response.json();
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <SettingsContext.Provider value={{ settings: settings || null, isLoading, error }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}