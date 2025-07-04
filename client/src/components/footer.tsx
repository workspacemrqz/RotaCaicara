import { Leaf, Phone, Mail, MapPin } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { useLocation } from "wouter";
import { useSettings } from "@/context/SettingsContext";

export default function Footer() {
  const [, setLocation] = useLocation();
  const { settings } = useSettings();

  const handleLogoClick = () => {
    setLocation("/admin");
  };

  return (
    <footer className="bg-white text-black py-8 sm:py-12 fade-in w-full overflow-hidden border-t border-gray-200">
      <div className="responsive-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="fade-in animate-stagger-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <button
                onClick={handleLogoClick}
                className="flex-shrink-0 hover:scale-110 cursor-pointer transition-transform"
                aria-label="Acessar painel administrativo"
              >
                <img
                  id="footer-logo-image"
                  src="/android-chrome-512x512.png"
                  alt={settings?.siteName || "Rota Caiçara"}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full shadow-lg"
                />
              </button>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold transition-smooth text-responsive text-black">
                  {settings?.siteName || "Rota Caiçara"}
                </h3>
                <p className="text-xs sm:text-sm transition-smooth text-responsive" style={{ color: "#005A6A" }}>
                  {settings?.locality || "São Sebastião"}
                </p>
              </div>
            </div>
            <p className="transition-smooth text-sm sm:text-base text-responsive leading-relaxed text-black">
              {settings?.footerDescription?.trim()
                ? settings.footerDescription
                : "Conectando você às melhores empresas da cidade com sustentabilidade e qualidade."}
            </p>
          </div>

          <div className="fade-in animate-stagger-2">
            <h4 className="font-bold mb-3 sm:mb-4 transition-smooth text-sm sm:text-base text-black">
              CONTATO
            </h4>
            <div className="space-y-2">
              {settings?.phone && (
                <p className="flex items-center transition-smooth text-sm sm:text-base" style={{ color: "#005A6A" }}>
                  <Phone className="mr-2 flex-shrink-0" size={14} />
                  <span className="text-responsive">{settings.phone}</span>
                </p>
              )}
              {settings?.email && (
                <p className="flex items-center transition-smooth text-sm sm:text-base" style={{ color: "#005A6A" }}>
                  <Mail className="mr-2 flex-shrink-0" size={14} />
                  <span className="text-responsive break-all">
                    {settings.email}
                  </span>
                </p>
              )}
              <p className="flex items-center transition-smooth text-sm sm:text-base" style={{ color: "#005A6A" }}>
                <MapPin className="mr-2 flex-shrink-0" size={14} />
                <span className="text-responsive">
                  {settings?.address ||
                    `${settings?.locality || "São Sebastião"} - SP`}
                </span>
              </p>
            </div>
          </div>

          <div className="fade-in animate-stagger-3 sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold mb-3 sm:mb-4 transition-smooth text-sm sm:text-base text-black">
              REDES SOCIAIS
            </h4>
            <div className="flex space-x-4">
              {settings?.whatsappUrl && (
                <button
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shine-effect hover:scale-110"
                  onClick={() => window.open(settings.whatsappUrl, "_blank")}
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="w-5 h-5" style={{ color: "#005A6A" }} />
                </button>
              )}
              {settings?.instagramUrl && (
                <button
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shine-effect hover:scale-110"
                  onClick={() => window.open(settings.instagramUrl, "_blank")}
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5" style={{ color: "#005A6A" }} />
                </button>
              )}
              {settings?.facebookUrl && (
                <button
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shine-effect hover:scale-110"
                  onClick={() => window.open(settings.facebookUrl, "_blank")}
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-5 h-5" style={{ color: "#005A6A" }} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center fade-in animate-stagger-4">
          <p className="transition-smooth text-xs sm:text-sm text-responsive" style={{ color: "#005A6A" }}>
            © 2025
            <button
              onClick={handleLogoClick}
              className="transition-smooth mx-1 underline cursor-pointer text-black hover:opacity-80"
            >
              {settings?.siteName || "Rota Caiçara"}
            </button>
            . Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}