import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Fan, Server, Home, Shield, Sun, Battery } from 'lucide-react';
import { categories } from '../data/itemsData';

const categoryConfig = {
  "LED Lighting": {
    icon: <Sun size={24} />,
    desc: "Energy-efficient panels, downlights, and lamps.",
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=800&auto=format&fit=crop"
  },
  "Switchgear": {
    icon: <Shield size={24} />,
    desc: "MCBs, RCCBs, and circuit protection.",
    image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=800&auto=format&fit=crop"
  },
  "Switches & Sockets": {
    icon: <Zap size={24} />,
    desc: "Premium modular switches and sockets.",
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800&auto=format&fit=crop"
  },
  "Fans": {
    icon: <Fan size={24} />,
    desc: "Decorative, BLDC, and exhaust fans.",
    image: "https://tse3.mm.bing.net/th/id/OIP.mss4uFLbv791JfvRh0uH8QHaEO?rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  "Distribution Boards": {
    icon: <Server size={24} />,
    desc: "SPN, TPN, and Vertical DBs.",
    image: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=800&auto=format&fit=crop"
  },
  "Smart Home": {
    icon: <Home size={24} />,
    desc: "WiFi bulbs, smart plugs, and sensors.",
    image: "https://tse3.mm.bing.net/th/id/OIP.JyzY8HlMntCk4AVUqNxL1AHaE8?rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  "Industrial": {
    icon: <Server size={24} />,
    desc: "Heavy-duty plugs, sockets, and gear.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop"
  },
  "Outdoor Lighting": {
    icon: <Sun size={24} />,
    desc: "Floodlights, street lights, and garden lights.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvBoY_dZ24ba1nHeaVrfrbhAWqcL7gfHDzDQ&s"
  }
};

const Categories = () => {
  const navigate = useNavigate();
  const displayCategories = categories.filter(cat => cat !== "All");

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-16 py-24">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-6"
            >
              Curation & Design
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-light text-neutral-900 dark:text-white uppercase tracking-tighter leading-none"
            >
              Explore our <span className="font-black italic text-amber-500">Collections</span>
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="hidden lg:block w-32 h-px bg-stone-300 dark:bg-neutral-800 mb-4"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
          {displayCategories.map((cat, index) => {
            const config = categoryConfig[cat] || { icon: <Zap />, desc: "Electrical essentials.", image: "" };

            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.8 }}
                onClick={() => navigate('/store', { state: { selectedCategory: cat } })}
                className="group cursor-pointer"
              >
                {/* Portrait Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 dark:bg-neutral-900 mb-8 rounded-sm shadow-sm group-hover:shadow-2xl transition-all duration-700">
                  <img
                    src={config.image}
                    alt={cat}
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

                  {/* Floating Icon revealed on hover */}
                  <div className="absolute top-6 right-6 p-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-full text-neutral-900 dark:text-white transform scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                    {config.icon}
                  </div>
                </div>

                {/* Typography and Reveal Line */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white uppercase tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                      {cat}
                    </h3>
                    <div className="h-px flex-1 bg-stone-200 dark:bg-neutral-800 mx-6 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                    <ArrowRight size={20} className="text-neutral-300 dark:text-neutral-600 group-hover:text-amber-500 transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm font-light leading-relaxed max-w-[90%]">
                    {config.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;