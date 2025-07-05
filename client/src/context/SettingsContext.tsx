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
  featuredEnabled?: boolean;
}

type SettingsContextType = {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  featuredEnabled: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    console.log('⚙️ SettingsContext: Fetching site settings...');
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/site-settings');
      if (!response.ok) {
        console.error('❌ Settings fetch failed:', response.status, response.statusText);
        setError(`Failed to fetch settings: ${response.status} ${response.statusText}`);
        return;
      }
      const data = await response.json();
      console.log('✅ Settings fetched successfully:', {
        siteName: data.siteName,
        locality: data.locality,
        fieldsCount: Object.keys(data).length
      });
      setSettings(data || {});
    } catch (e: any) {
      console.error('❌ Settings context error:', e);
      setError(e.message || 'An unexpected error occurred');
      setSettings({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  const contextValue = {
    settings: settings || null,
    loading: isLoading,
    error: error,
    refetch: refetch,
    featuredEnabled: settings?.featuredEnabled ?? false,
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