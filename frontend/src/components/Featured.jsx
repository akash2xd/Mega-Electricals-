import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Star, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { itemsData as staticItems } from '../data/itemsData';

const Featured = () => {
  const navigate = useNavigate();
  const [featuredData, setFeaturedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/inventory`);
      const data = await res.json();
      const activeProducts = data.filter(item => !item.isDeleted);

      const productsWithLocalImages = activeProducts.map(dbItem => {
        const localMatch = staticItems.find(
          s => s.name.trim().toLowerCase() === dbItem.name.trim().toLowerCase()
        );
        return {
          ...dbItem,
          image: localMatch ? localMatch.image : dbItem.image
        };
      });

      const targetIds = [
        "GL91285",
        "MUR-TEJAS-TFT18036",
        "SCFZ101948",
        "GL9C0307136X"
      ];

      let items = targetIds.map(id =>
        productsWithLocalImages.find(p => p.id === id || p._id === id)
      ).filter(Boolean);

      if (items.length === 0) {
        items = productsWithLocalImages.slice(4, 8);
      }

      setFeaturedData(items);
    } catch (err) {
      console.error("Using local fallback:", err);
      setFeaturedData(staticItems.slice(10, 14));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center bg-stone-50 dark:bg-neutral-950">
        <Loader2 className="w-6 h-6 text-neutral-900 dark:text-white animate-spin mb-4" />
        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Refining Collection</p>
      </div>
    );
  }

  if (featuredData.length === 0) return null;

  return (
    <section className="py-24 bg-stone-50 dark:bg-neutral-950 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-16">

        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-6">
          <div className="space-y-2">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-[0.6em]"
            >
              Masterpieces
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white uppercase tracking-tighter"
            >
              Curated <span className="font-black italic">Excellence</span>
            </motion.h2>
          </div>
          <motion.button
            onClick={() => navigate('/store')}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all"
          >
            View Entire Range <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </div>

        {/* Editorial Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
          {featuredData.map((product, idx) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              onClick={() => navigate(`/product/${product._id || product.id}`)}
              className="group cursor-pointer flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 dark:bg-neutral-900 rounded-sm mb-8">
                <div className="absolute top-6 left-6 z-10">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full border border-stone-200 dark:border-neutral-700">
                    <Star size={8} className="fill-amber-500 text-amber-500" />
                    <span className="text-[8px] font-black dark:text-white tracking-widest">{product.rating || "4.9"}</span>
                  </div>
                </div>

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-12 transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <button className="w-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-[10px] font-black uppercase py-5 tracking-[0.2em] shadow-2xl flex items-center justify-center gap-2 rounded-lg">
                    <Plus size={14} /> Product Details
                  </button>
                </div>
              </div>

              {/* Minimal Product Metadata */}
              <div className="space-y-2 px-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-neutral-400 dark:text-neutral-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-1">
                      {product.brand}
                    </p>
                    <h3 className="text-neutral-900 dark:text-white font-bold text-sm uppercase tracking-tight leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-base font-black text-neutral-900 dark:text-white italic tracking-tighter">
                    ₹{Number(product.price).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative Divider */}
        <div className="mt-32 flex justify-center">
          <div className="h-px w-24 bg-stone-200 dark:bg-neutral-900" />
        </div>
      </div>
    </section>
  );
};

export default Featured;