"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface SocialLinks {
  facebook: string;
  twitter: string;
  linkedin: string;
}

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  social: SocialLinks;
}

const team: TeamMember[] = [
  {
    id: 1,
    name: "Mohammed Fatih Yildirim",
    position: "Consultant",
    image: "/attoreny.png",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    id: 2,
    name: "Meaza Ashenafi",
    position: "Attoreny",
    image: "/MeazaAshenafi.png",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    id: 3,
    name: "Enes Smajli",
    position: "Legal Assistant",
    image: "/blackmanhammer.png",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    id: 4,
    name: "Eren Kara",
    position: "Pralegal",
    image: "/lawyerman.png",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
];

const Team: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-24 bg-[#1a1a1a] text-white overflow-hidden" id="team" ref={ref}>
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#b78c4e] font-medium tracking-wider mb-3">/ OUR TEAM</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-serif">
            Meet Our <span className="text-[#b78c4e]">Expert Team</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Our team of experienced attorneys and legal professionals is dedicated to providing you with the highest quality legal representation.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              className="bg-[#212121] rounded-lg overflow-hidden border border-[#333333] hover:border-[#b78c4e] transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div className="relative h-80">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-[#b78c4e] mb-4">{member.position}</p>
                <div className="flex space-x-4">
                  <Link href={member.social.facebook} className="text-gray-400 hover:text-[#b78c4e] transition-colors">
                    <Facebook size={20} />
                  </Link>
                  <Link href={member.social.twitter} className="text-gray-400 hover:text-[#b78c4e] transition-colors">
                    <Twitter size={20} />
                  </Link>
                  <Link href={member.social.linkedin} className="text-gray-400 hover:text-[#b78c4e] transition-colors">
                    <Linkedin size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="bg-[#212121] py-6 px-8 rounded-lg inline-block border border-[#333333]">
            <span className="font-medium text-white">
              Top Rated By Customers & Immigration Firms
            </span>
            <span className="text-[#b78c4e] font-medium ml-2">
              With 100% Success
            </span>
            <motion.div
              className="inline-block ml-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/team" 
                className="inline-flex h-12 bg-[#b78c4e] text-white px-6 rounded-md hover:bg-[#9a7339] transition-all duration-300 items-center justify-center font-medium"
              >
                EXPLORE NOW
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
