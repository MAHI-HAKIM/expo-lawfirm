"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  image: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Christine Eve",
    position: "Business Client",
    image: "/testimonal1.png",
    text: "The legal expertise provided by this firm was exceptional. They handled my complex business case with professionalism and achieved results that exceeded my expectations.",
    rating: 5,
  },
  {
    id: 2,
    name: "Alesha Brown",
    position: "Family Law Client",
    image: "/testimonal2.png",
    text: "During a difficult divorce, this team provided not only legal guidance but also emotional support. Their compassionate approach made a challenging time much more manageable.",
    rating: 5,
  },
  {
    id: 3,
    name: "David Cooper",
    position: "Criminal Defense Client",
    image: "/testimonal3.png",
    text: "When facing serious charges, I needed the best defense possible. This firm delivered with strategic thinking and aggressive representation that ultimately led to my case being dismissed.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Cooper",
    position: "Criminal Defense Client",
    image: "/testimonal3.png",
    text: "When facing serious charges, I needed the best defense possible. This firm delivered with strategic thinking and aggressive representation that ultimately led to my case being dismissed.",
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

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
        nextSlide();
      } else {
        prevSlide();
      }
      setIsDragging(false);
    }
  };

  const handleDragEnd = (): void => {
    setIsDragging(false);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-[#1a1a1a] text-white overflow-hidden" id="testimonials" ref={ref}>
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#b78c4e] font-medium tracking-wider mb-3">/ TESTIMONIALS</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-serif">
            What Our <span className="text-[#b78c4e]">Clients Say</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Hear from our satisfied clients about their experiences with our legal services.
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            className="relative overflow-hidden"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <motion.div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="bg-[#212121] rounded-lg p-8 border border-[#333333] hover:border-[#b78c4e] transition-all duration-300">
                    <div className="flex items-center mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{testimonial.name}</h3>
                        <p className="text-[#b78c4e]">{testimonial.position}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-[#b78c4e] fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-400">{testimonial.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#b78c4e] text-white p-2 rounded-full hover:bg-[#9a7339] transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#b78c4e] text-white p-2 rounded-full hover:bg-[#9a7339] transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
