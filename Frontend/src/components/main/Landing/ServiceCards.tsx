"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Service {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface ServiceCardsProps {
  services: Service[];
}

const ServiceCards: React.FC<ServiceCardsProps> = ({ services }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5">
      {services.map((service, index) => (
        <motion.div
          key={index}
          className="group relative h-[400px] overflow-hidden cursor-pointer text-center"
          whileHover="hover"
          initial="initial"
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${service.image})` }}
          />

          <motion.div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 opacity-70 group-hover:opacity-85 transition-opacity duration-500" />

          <motion.div
            className="absolute inset-0 flex flex-col justify-end p-8 text-white"
            variants={{
              initial: { opacity: 1 },
              hover: { opacity: 0, transition: { duration: 0.3 } },
            }}
          >
            <h4 className="text-2xl font-bold mb-2 text-[#b78c4e]">{service.title}</h4>
            <p className="text-sm text-white/80 text-center">
              {service.subtitle}
            </p>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex flex-col justify-center items-center p-8 text-white"
            variants={{
              initial: { opacity: 0, y: 20 },
              hover: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
          >
            <h3 className="text-3xl font-bold mb-4 text-[#b78c4e]">{service.title}</h3>
            <p className="text-lg mb-4 text-white/90">{service.subtitle}</p>
            <p className="text-center text-white/80 mb-6 max-w-xs">{service.description}</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center px-6 py-2 bg-[#b78c4e] text-white rounded-md hover:bg-[#9a7339] transition-colors duration-300"
              >
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default ServiceCards;
