import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SiteSetting } from "@shared/schema";

interface SettingsContextType {
  settings: SiteSetting | null;
  isLoading: boolean;
  error: Error | null;
  refreshSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const {
    data: settings,
    isLoading,
    error,
    refetch: refreshSettings,
  } = useQuery<SiteSetting>({
    queryKey: ["/api/site-settings"],
    queryFn: async () => {
      const response = await fetch("/api/site-settings");
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  return (
    <SettingsContext.Provider
      value={{
        settings: settings || null,
        isLoading,
        error: error as Error | null,
        refreshSettings,
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