import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";

import CategoryCard from "@/components/category-card";
import BusinessCard from "@/components/business-card";
import type { Category, Business } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const { featuredEnabled, settings } = useSettings();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["/api/categories", Date.now()],
  });

  const { data: featuredBusinesses = [], isLoading: businessesLoading } =
    useQuery<Business[]>({
      queryKey: ["/api/businesses/featured"],
    });

  const handleCategoryClick = (categorySlug: string) => {
    setLocation(`/category/${categorySlug}`);
  };

  if (categoriesLoading || businessesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petroleo mx-auto mb-4"></div>
          <p className="text-petroleo">Carregando...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div>
      {/* Hero Section and Categories - Unified Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full overflow-hidden"
        style={{ backgroundColor: "#00566A" }}
      >
        {/* Hero Section */}
        <div className="responsive-container text-center py-8 sm:py-12">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 text-responsive px-2"
          >
            {settings?.headline1?.trim()
              ? settings.headline1
              : "DESCUBRA AS MELHORES EMPRESAS DE SÃO SEBASTIÃO"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 text-responsive px-2"
          >
            {settings?.headline3?.trim()
              ? settings.headline3
              : "Conectando você aos melhores negócios da cidade"}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center px-2"
          >
            <Button
              onClick={() => setLocation("/advertise")}
              className="bg-white text-petroleo hover:bg-gray-100 px-4 sm:px-8 py-3 text-base sm:text-lg font-bold animate-pulse-button w-full sm:w-auto whitespace-nowrap"
            >
              <i className="fas fa-bullhorn mr-2 icon-hover"></i>ANUNCIE SUA
              EMPRESA
            </Button>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="responsive-container pb-8">
          <motion.h3
            variants={itemVariants}
            className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center text-responsive"
          >
            CATEGORIAS
          </motion.h3>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 max-w-4xl mx-auto px-6"
          >
            {categories.map((category: Category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className="w-full min-h-0"
              >
                <CategoryCard
                  category={category}
                  onClick={() => handleCategoryClick(category.slug)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Gazeta Costa Sul Banner */}
        <div className="responsive-container pb-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 max-w-4xl mx-auto px-6"
          >
            <motion.div
              variants={itemVariants}
              className="w-full min-h-0"
            >
              <a
                href="https://gazetacostasul.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full transition-transform hover:scale-105 duration-300"
              >
                <img
                  src="https://i.ibb.co/d0yv4tS7/Gazeta-logo-site.png"
                  alt="Gazeta Costa Sul"
                  className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Businesses with Scroll Loop Animation */}
      {featuredEnabled && featuredBusinesses.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-offwhite py-8 sm:py-12 w-full overflow-hidden"
        >
          <div className="responsive-container">
            <motion.h3
              variants={itemVariants}
              className="text-xl sm:text-2xl font-bold text-petroleo mb-6 sm:mb-8 text-center text-responsive"
            >
              EMPRESAS EM DESTAQUE
            </motion.h3>
            <div className="overflow-hidden">
              <div
                className="animate-slide-loop flex gap-4 sm:gap-6"
                style={{ width: "calc(200% + 1rem)" }}
              >
                {[...featuredBusinesses, ...featuredBusinesses].map(
                  (business: Business, index: number) => (
                    <motion.div
                      key={`${business.id}-${index}`}
                      variants={itemVariants}
                      className="flex-shrink-0 w-80 animate-fade-up"
                      style={{
                        animationDelay: `${(index % featuredBusinesses.length) * 0.1}s`,
                      }}
                    >
                      <BusinessCard business={business} />
                    </motion.div>
                  ),
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
