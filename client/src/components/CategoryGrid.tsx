import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import CategoryCard from "@/components/category-card";
import type { Category } from "@shared/schema";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CategoryGrid() {
  const [, setLocation] = useLocation();

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleCategoryClick = (categorySlug: string) => {
    setLocation(`/category/${categorySlug}`);
  };

  if (isLoading) {
    return (
      <section className="global-bg global-bg-light w-full py-8 overflow-hidden">
        <div className="responsive-container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Carregando categorias...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="global-bg global-bg-light w-full py-8 overflow-hidden"
    >
      <div className="responsive-container">
        <motion.h3
          variants={itemVariants}
          className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center text-responsive"
        >
          CATEGORIAS
        </motion.h3>

        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto px-6">
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
        </div>
      </div>
    </motion.section>
  );
}