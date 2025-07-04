import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Star,
  Award,
  ArrowLeft,
  Newspaper
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import type { Business } from "@shared/schema";
import { useLocation } from "wouter";

export default function BusinessDetail() {
  const [, params] = useRoute("/business/:id");
  const [, setLocation] = useLocation();
  const businessId = params?.id;

  const { data: business, isLoading } = useQuery<Business>({
    queryKey: ["/api/businesses", businessId],
    queryFn: async () => {
      const res = await fetch(`/api/businesses/${businessId}`);
      if (!res.ok) throw new Error("Business not found");
      return res.json();
    },
    enabled: !!businessId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-offwhite py-8">
        <div className="responsive-container">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-offwhite py-8">
        <div className="responsive-container text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            Negócio não encontrado
          </h1>
          <Button onClick={() => setLocation("/")}>
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  const handleWhatsAppContact = () => {
    const message = `Olá! Vi seu negócio "${business.name}" no Rota Caiçara e gostaria de mais informações.`;
    const whatsappNumber = business.whatsapp?.replace(/\D/g, '');
    window.open(`https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handlePhoneCall = () => {
    window.open(`tel:${business.phone}`, "_blank");
  };

  const handleEmailContact = () => {
    window.open(`mailto:${business.email}`, "_blank");
  };

  const handleJournalView = () => {
    if (business.journalLink) {
      window.open(business.journalLink, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-offwhite py-8">
      <div className="responsive-container">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6 text-petroleo hover:text-petroleo-dark"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Business Info */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative h-64 bg-gradient-to-r from-petroleo to-petroleo-dark">
                {business.imageUrl && (
                  <img
                    src={business.imageUrl}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    {business.featured && (
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
                    {business.certified && (
                      <Badge className="bg-green-500 text-white">
                        <Award className="w-3 h-3 mr-1" />
                        Certificado
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {business.name}
                  </h1>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Description */}
                  {business.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-petroleo-dark mb-3">
                        Sobre o Negócio
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {business.description}
                      </p>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-petroleo-dark mb-3">
                      Informações de Contato
                    </h3>
                    <div className="space-y-3">
                      {business.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-petroleo" />
                          <span className="text-gray-700">{business.phone}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handlePhoneCall}
                            className="ml-auto"
                          >
                            Ligar
                          </Button>
                        </div>
                      )}

                      {business.whatsapp && (
                        <div className="flex items-center gap-3">
                          <FaWhatsapp className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{business.whatsapp}</span>
                          <Button
                            size="sm"
                            onClick={handleWhatsAppContact}
                            className="ml-auto bg-green-500 hover:bg-green-600"
                          >
                            WhatsApp
                          </Button>
                        </div>
                      )}

                      {business.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-petroleo" />
                          <span className="text-gray-700">{business.email}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEmailContact}
                            className="ml-auto"
                          >
                            Email
                          </Button>
                        </div>
                      )}

                      {business.address && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-petroleo" />
                          <span className="text-gray-700">{business.address}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`https://maps.google.com?q=${encodeURIComponent(business.address!)}`)}
                            className="ml-auto"
                          >
                            Ver no Mapa
                          </Button>
                        </div>
                      )}

                      {business.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-petroleo" />
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-petroleo hover:underline"
                          >
                            {business.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Media Links */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-petroleo-dark mb-4">
                  Redes Sociais
                </h3>
                <div className="space-y-3">
                  {business.instagram && (
                    <a
                      href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FaInstagram className="w-5 h-5 text-pink-500" />
                      <span>@{business.instagram.replace('@', '')}</span>
                    </a>
                  )}

                  {business.facebook && (
                    <a
                      href={business.facebook.startsWith('http') ? business.facebook : `https://facebook.com/${business.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FaFacebook className="w-5 h-5 text-blue-500" />
                      <span>Facebook</span>
                    </a>
                  )}

                  {!business.instagram && !business.facebook && (
                    <p className="text-gray-500 text-sm">
                      Nenhuma rede social cadastrada
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-petroleo-dark mb-4">
                  Ações Rápidas
                </h3>
                <div className="space-y-3">
                  {business.whatsapp && (
                    <Button
                      onClick={handleWhatsAppContact}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      <FaWhatsapp className="w-4 h-4 mr-2" />
                      Conversar no WhatsApp
                    </Button>
                  )}

                  {business.phone && (
                    <Button
                      variant="outline"
                      onClick={handlePhoneCall}
                      className="w-full"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Ligar Agora
                    </Button>
                  )}

                  {business.email && (
                    <Button
                      variant="outline"
                      onClick={handleEmailContact}
                      className="w-full"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar Email
                    </Button>
                  )}

                  {business.journalLink && (
                    <Button
                      variant="outline"
                      onClick={handleJournalView}
                      className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
                    >
                      <Newspaper className="w-4 h-4 mr-2" />
                      Ver no Jornal
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}