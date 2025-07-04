import { motion } from "framer-motion";

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

export default function LogoBanner() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="global-bg global-bg-light w-full py-12 sm:py-2 sm:pb-8 lg:pb-12 overflow-hidden"
    >
      <div className="responsive-container">
        <motion.div
          variants={itemVariants}
          className="flex justify-center"
        >
          <a
            href="https://gazetacostasul.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-4xl transition-transform hover:scale-105 duration-300"
          >
            <img
              src="https://i.ibb.co/d0yv4tS7/Gazeta-logo-site.png"
              alt="Gazeta Costa Sul"
              className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}