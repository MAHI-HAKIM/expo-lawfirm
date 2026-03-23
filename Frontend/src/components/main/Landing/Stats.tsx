"use client";

import { useEffect, useRef, useState } from "react";
import { Users, CheckCircle, Award, BarChart, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

interface StatItem {
  id: number;
  title: string;
  value: number;
  suffix: string;
  icon: LucideIcon;
}

const stats: StatItem[] = [
  {
    id: 1,
    title: "Team members",
    value: 30,
    suffix: "+",
    icon: Users,
  },
  {
    id: 2,
    title: "Completed works",
    value: 142,
    suffix: "+",
    icon: CheckCircle,
  },
  {
    id: 3,
    title: "Satisfied clients",
    value: 500,
    suffix: "+",
    icon: Award,
  },
  {
    id: 4,
    title: "Success Rates",
    value: 98,
    suffix: "%",
    icon: BarChart,
  },
];

const Stats: React.FC = () => {
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (!isInView) return;

    const intervals = stats.map((stat, index) => {
      const duration = 2000; // 2 seconds
      const increment = stat.value / (duration / 16); // 60fps
      let count = 0;

      return setInterval(() => {
        count += increment;
        if (count >= stat.value) {
          count = stat.value;
          clearInterval(intervals[index]);
        }
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = Math.floor(count);
          return newCounts;
        });
      }, 16);
    });

    return () => intervals.forEach((interval) => clearInterval(interval));
  }, [isInView]);

  return (
    <section className="py-24 bg-[#1a1a1a] text-white overflow-hidden" id="stats" ref={ref}>
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#b78c4e] font-medium tracking-wider mb-3">/ OUR STATS</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-serif">
            Our <span className="text-[#b78c4e]">Achievements</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Numbers that speak for themselves. Our track record of success and client satisfaction.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                className="bg-[#212121] rounded-lg p-8 border border-[#333333] hover:border-[#b78c4e] transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-[#b78c4e] rounded-full mb-6 mx-auto">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-center mb-2">
                  {counts[index]}
                  {stat.suffix}
                </h3>
                <p className="text-gray-400 text-center">{stat.title}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
