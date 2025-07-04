
import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SiteSetting } from '@shared/schema';

interface SettingsContextType {
  settings: SiteSetting | null;
  isLoading: boolean;
  error: Error | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const { data: settings, isLoading, error } = useQuery<SiteSetting>({
    queryKey: ['/api/admin/settings'],
    staleTime: 1000 * 60 * 5,
  });

  const value: SettingsContextType = {
    settings: settings || null,
    isLoading,
    error: error as Error | null
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
