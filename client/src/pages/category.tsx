import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Phone, ExternalLink } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BusinessCard from "@/components/business-card";
import type { Business, Category } from "@shared/schema";

export default function CategoryPage() {
  const { slug } = useParams();

  // Query for category businesses with proper error handling
  const { data: businesses = [], isLoading, error } = useQuery<Business[]>({
    queryKey: ["/api/categories", slug, "businesses"],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${slug}/businesses`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Category not found");
        }
        throw new Error("Failed to fetch businesses");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const category = categories.find(c => c.slug === slug);

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006C84] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando negócios...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Categoria não encontrada
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            A categoria que você está procurando não existe ou foi removida.
          </p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-[#006C84] hover:bg-[#005A6A]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="responsive-container py-8">
        {/* Header with category info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4 text-[#006C84] hover:text-[#005A6A]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {category.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Descubra os melhores negócios em {category.name.toLowerCase()} na região de São Sebastião
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1 bg-[#006C84] mx-auto mt-4 rounded"
            />
          </div>
        </motion.div>

        {/* Business listings */}
        {businesses.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {businesses.map((business) => (
              <motion.div key={business.id} variants={itemVariants}>
                <BusinessCard business={business} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum negócio encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Ainda não temos negócios cadastrados nesta categoria. Seja o primeiro a se cadastrar!
              </p>
              <Button 
                onClick={() => window.location.href = "/advertise"}
                className="bg-[#006C84] hover:bg-[#005A6A]"
              >
                Anunciar Meu Negócio
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}