import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SiteSetting } from "@shared/schema";

interface SettingsContextType {
  logoUrl: string;
  primaryColor: string;
  featuredEnabled: boolean;
  siteName: string;
  settings: SiteSetting | null;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Theme / basic values
  const [theme, setTheme] = useState({
    logoUrl: "",
    primaryColor: "#006C84",
    featuredEnabled: true,
    siteName: "Rota Caiçara",
  });
  // Full settings object from API
  const [settings, setSettings] = useState<SiteSetting | null>(null);

  // Fetch & refetch settings
  const { data, refetch } = useQuery<SiteSetting>({
    queryKey: ["/api/admin/settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Falha ao buscar configurações");
      return res.json();
    },
  });

  // Update settings when data changes
  useEffect(() => {
    if (data) {
      setSettings(data);

      // derive theme values
      const derived = {
        logoUrl: "",
        primaryColor: "#006C84",
        featuredEnabled: true,
        siteName: data.siteName ?? "Rota Caiçara",
      };
      setTheme(derived);

      // apply CSS vars
      document.documentElement.style.setProperty(
        "--color-primary",
        derived.primaryColor,
      );
      document.documentElement.style.setProperty(
        "--color-primary-light",
        adjustColor(derived.primaryColor, 20),
      );
      document.documentElement.style.setProperty(
        "--color-primary-dark",
        adjustColor(derived.primaryColor, -20),
      );
    }
  }, [data]);

  const refreshSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        console.warn("Failed to fetch settings, using defaults");
      }
    } catch (error) {
      console.error("Failed to refresh settings:", error);
      // Don't throw error, just log it and continue with defaults
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        logoUrl: theme.logoUrl,
        primaryColor: theme.primaryColor,
        featuredEnabled: theme.featuredEnabled,
        siteName: theme.siteName,
        settings,
        refreshSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

// simple hex brightness adjuster
function adjustColor(color: string, amount: number): string {
  const hex = color.replace("#", "");
  const num = parseInt(hex, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}