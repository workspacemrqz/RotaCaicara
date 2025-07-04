import { Link } from "wouter";
import { Leaf } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function Header() {
  const { settings } = useSettings();
  return (
    <nav className="bg-ffffff shadow-sm sticky top-0 z-50 fade-in w-full overflow-hidden">
      <div className="responsive-container">
        <div className="flex justify-between items-center h-20 sm:h-24 w-full py-3 sm:py-4">
          <Link
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0 flex-1"
          >
            <img
              id="header-logo-image"
              src="/android-chrome-512x512.png"
              alt={settings?.siteName || "Rota Caiçara"}
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full shadow-md flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h1
                id="site-logo-title"
                className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 transition-smooth text-responsive truncate"
              >
                {settings?.siteName || "Rota Caiçara"}
              </h1>
              <p
                id="site-subtitle"
                className="text-xs sm:text-sm text-gray-600 transition-smooth hidden sm:block truncate"
              >
                {settings?.locality || "São Sebastião"}
              </p>
            </div>
          </Link>

          <img
            src="https://i.ibb.co/WNSkYzRH/Bandeira-S-o-Sebasti-o-SP-svg.png"
            alt="Bandeira de São Sebastião"
            className="w-24 sm:w-14 h-auto flex-shrink-0 ml-2"
          />
        </div>
      </div>
    </nav>
  );
}