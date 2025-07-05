import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Newspaper } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import type { Business } from "@shared/schema";

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const handleWhatsAppClick = () => {
    if (business.whatsapp) {
      window.open(`https://wa.me/55${business.whatsapp}`, "_blank");
    }
  };

  const handleFacebookClick = () => {
    if (business.facebook) {
      window.open(`https://facebook.com/${business.facebook}`, "_blank");
    }
  };

  const handleInstagramClick = () => {
    if (business.instagram) {
      window.open(`https://instagram.com/${business.instagram}`, "_blank");
    }
  };

  const handleLocationClick = () => {
    if (business.address) {
      const encodedAddress = encodeURIComponent(business.address);
      window.open(`https://maps.google.com/?q=${encodedAddress}`, "_blank");
    }
  };

  const handleJournalClick = () => {
    if (business.journalLink) {
      window.open(business.journalLink, "_blank");
    }
  };

  return (
    <Card className="bg-ffffff rounded-xl shadow-lg overflow-hidden w-full h-full flex flex-col">
      {/* Imagem */}
      {business.imageUrl && (
        <div className="w-full aspect-square overflow-hidden">
          <img 
            src={business.imageUrl} 
            alt={business.name} 
            className="w-full h-full object-cover"
            style={{ width: '945px', height: '945px', maxWidth: '100%', maxHeight: '100%' }}
          />
        </div>
      )}

      <CardContent className="p-4 sm:p-6 flex-grow flex flex-col">
        {/* Nome da Empresa */}
        <h4 className="font-bold text-petroleo text-2xl mb-2 text-center uppercase">
          {business.name}
        </h4>

        {/* Descrição */}
        {business.description && (
          <p className="text-gray-600 text-sm text-center mb-4 leading-relaxed">
            {business.description}
          </p>
        )}

        {/* Botões Sociais */}
        <div className="flex justify-center gap-3 mb-4 flex-wrap">
          {business.instagram && (
            <button 
              onClick={handleInstagramClick}
              className="social-icon-circle social-instagram"
              aria-label="Instagram"
            >
              <FaInstagram />
            </button>
          )}

          {business.facebook && (
            <button 
              onClick={handleFacebookClick}
              className="social-icon-circle social-facebook"
              aria-label="Facebook"
            >
              <FaFacebook />
            </button>
          )}

          {business.whatsapp && (
            <button 
              onClick={handleWhatsAppClick}
              className="social-icon-circle social-whatsapp"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </button>
          )}

          {business.address && (
            <button 
              onClick={handleLocationClick}
              className="social-icon-circle bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-800 transition-colors"
              aria-label="Ver localização no Google Maps"
              title={business.address}
            >
              <MapPin size={20} />
            </button>
          )}

          {business.journalLink && (
            <button 
              onClick={handleJournalClick}
              className="social-icon-circle bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-800 transition-colors"
              aria-label="Jornal"
            >
              <Newspaper />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}