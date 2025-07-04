import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useSettings } from "@/context/SettingsContext";

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const { settings } = useSettings();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="global-bg global-bg-hero py-8 sm:py-12 w-full overflow-hidden"
    >
      <div className="responsive-container text-center">
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
            className="bg-white text-petroleo hover:bg-gray-100 px-4 sm:px-8 py-3 text-base sm:text-lg font-bold transition-all duration-300 hover:scale-105 w-full sm:w-auto whitespace-nowrap"
          >
            <i className="fas fa-bullhorn mr-2"></i>ANUNCIE SUA EMPRESA
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}