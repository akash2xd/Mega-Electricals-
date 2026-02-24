import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Aman Gupta",
    role: "Architect",
    text: "The selection of luxury lighting at Mega Electricals is unmatched. I always source my project fixtures from here for their quality and durability.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=aman"
  },
  {
    id: 2,
    name: "Sonia Chatterjee",
    role: "Interior Designer",
    text: "I highly recommend them for their professional service. Their collection of switches and modular plates perfectly complements modern home aesthetics.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sonia"
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    role: "Project Manager",
    text: "For industrial switchgear and heavy-duty cables, this is our go-to shop. Genuine products and very competitive pricing in the market.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=rajesh"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-stone-50 dark:bg-neutral-950 transition-colors duration-500 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col items-center mb-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4"
          >
            Voices of Trust
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-light text-neutral-900 dark:text-white uppercase tracking-tighter"
          >
            Client <span className="font-black italic text-amber-500">Perspectives</span>
          </motion.h2>
          <div className="w-16 h-px bg-stone-200 dark:bg-neutral-800 mt-8" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Elegant Quote Icon */}
              <div className="mb-8">
                <Quote
                  size={32}
                  className="text-stone-200 dark:text-neutral-800 group-hover:text-amber-500/20 transition-colors duration-500"
                  strokeWidth={1}
                />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={12} className="text-amber-500 fill-current" />
                ))}
              </div>

              {/* Content */}
              <div className="relative mb-10">
                <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed italic text-base lg:text-lg">
                  "{item.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-auto flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-14 h-14 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 border border-stone-200 dark:border-neutral-800"
                  />
                  <div className="absolute inset-0 rounded-full border border-amber-500/0 group-hover:border-amber-500/50 scale-125 transition-all duration-700" />
                </div>

                <h4 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-widest mb-1">
                  {item.name}
                </h4>
                <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em]">
                  {item.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;