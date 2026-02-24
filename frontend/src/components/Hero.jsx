import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    id: 1,
    productId: "SCFZ101948",
    brand: "Goldmedal Luxury",
    title: "Fabia Series",
    subtitle: "A symphony of elegance and performance. 3-colour LED integration with near-silent operation.",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070",
    color: "text-amber-400",
    btnColor: "bg-white text-black hover:bg-amber-500 hover:text-white"
  },
  {
    id: 2,
    productId: "MUR-TEJAS-FAN",
    brand: "Murugappa Group",
    title: "Tejas Performance",
    subtitle: "Engineered for the heavy-duty demands of the modern Indian home. Power meets durability.",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=2070",
    color: "text-amber-500",
    btnColor: "bg-black text-white hover:bg-amber-500 hover:text-white"
  },
  {
    id: 3,
    productId: "GL9C0307109X",
    brand: "Architectural Lighting",
    title: "Orzo Precision",
    subtitle: "Experience the art of illumination. High-lumen PDC Aluminium body for sophisticated interiors.",
    image: "https://media.istockphoto.com/id/1177589023/photo/light-bulb-hanging-by-the-ceiling-in-a-restaurant.jpg?s=612x612&w=0&k=20&c=q42ID3IKtlhQbY8UquTIkIwqKeJB42kLgjr7KW83ZxE=",
    color: "text-amber-300",
    btnColor: "bg-white text-black hover:bg-amber-500 hover:text-white"
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  const handleShopNow = () => {
    if (slides[current].id === 1) {
      navigate('/store', { state: { filterBrand: 'Goldmedal', filterCategory: 'Fans' } });
    } else {
      navigate(`/product/${slides[current].productId}`);
    }
  };

  return (
    <div className="relative h-screen min-h-[700px] w-full overflow-hidden bg-neutral-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          </motion.div>

          <div className="relative h-full flex items-center justify-center text-center px-6">
            <div className="max-w-4xl">
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`inline-block mb-4 text-xs font-black uppercase tracking-[0.4em] ${slides[current].color}`}
              >
                {slides[current].brand}
              </motion.span>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-6xl md:text-8xl font-light mb-8 text-white tracking-tighter leading-none"
              >
                {slides[current].title}
              </motion.h1>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg md:text-xl text-neutral-200 mb-12 max-w-2xl mx-auto font-light leading-relaxed tracking-wide"
              >
                {slides[current].subtitle}
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={handleShopNow}
                  className={`group px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 shadow-2xl flex items-center gap-2 ${slides[current].btnColor}`}
                >
                  Shop Now <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/store')}
                  className="px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest text-white border border-white/30 hover:bg-white/10 hover:border-amber-400/50 backdrop-blur-sm transition-all duration-500"
                >
                  Explore Catalog
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-4">
        <button onClick={prevSlide} className="p-4 text-white/40 hover:text-amber-400 pointer-events-auto transition-colors">
          <ChevronLeft size={48} strokeWidth={1} />
        </button>
        <button onClick={nextSlide} className="p-4 text-white/40 hover:text-amber-400 pointer-events-auto transition-colors">
          <ChevronRight size={48} strokeWidth={1} />
        </button>
      </div>

      <div className="absolute bottom-12 right-12 flex items-end gap-2 text-white">
        <span className="text-3xl font-light">0{current + 1}</span>
        <div className="h-px w-12 bg-amber-500/50 mb-3" />
        <span className="text-sm font-light text-white/40 mb-1">0{slides.length}</span>
      </div>
    </div>
  );
};

export default Hero;