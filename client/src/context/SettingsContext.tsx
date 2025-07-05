import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface SiteSettings {
  siteName?: string;
  locality?: string;
  tagline1?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  logoUrl?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  facebookUrl?: string;
}

interface SettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/site-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data || {});
      } else {
        console.warn('Failed to fetch settings, using defaults');
        setSettings({});
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setSettings({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const contextValue = {
    settings: settings || {},
    isLoading,
    refreshSettings
  };

  return (
    <SettingsContext.Provider value={contextValue}>
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