"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/ladyStatue.png",
    title: "Your Legal Success is Our Mission",
    subtitle: "Expert Legal Solutions for Complex Issues",
  },
  {
    id: 2,
    image: "/orderhammer.png",
    title: "Trusted Legal Advisors Since 2003",
    subtitle: "Providing Exceptional Legal Services",
  },
  {
    id: 3,
    image: "/clientLawyer.png",
    title: "Protecting Your Rights & Interests",
    subtitle: "Dedicated to Achieving the Best Outcomes",
  },
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent): void => {
    setIsDragging(true);
    setStartX('touches' in e ? e.touches[0].clientX : e.clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent): void => {
    if (!isDragging) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = startX - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      } else {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      }
      setIsDragging(false);
    }
  };

  const handleDragEnd = (): void => {
    setIsDragging(false);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      <div
        ref={sliderRef}
        className="absolute inset-0 transition-transform duration-500 ease-out"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative w-full h-full inset-0 bg-black opacity-40">
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="object-cover"
                fill
                sizes="100vw"
                priority={currentSlide === 0}
                quality={90}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-4 max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center text-white"
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-serif">
                    {slides[currentSlide].title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-8">
                    {slides[currentSlide].subtitle}
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#b78c4e] text-white rounded-md hover:bg-[#9a7339] transition-colors duration-300 font-medium"
                  >
                    Get Started
                    <ArrowRight className="ml-2" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-[#b78c4e]" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;