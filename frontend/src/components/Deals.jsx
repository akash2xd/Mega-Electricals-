import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { itemsData as staticItems } from '../data/itemsData';

const Deals = () => {
  const navigate = useNavigate();
  const [dealsData, setDealsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/inventory`);
      const dbData = await res.json();
      const activeProducts = dbData.filter(item => !item.isDeleted);

      const productsWithLocalImages = activeProducts.map(dbItem => {
        const localMatch = staticItems.find(s => s.name.trim().toLowerCase() === dbItem.name.trim().toLowerCase());
        return { ...dbItem, image: localMatch ? localMatch.image : dbItem.image };
      });

      const targetIds = ["SCFZ101948", "SCFP301050", "MUR-TEJAS-TFT18036", "GL9C0307136X"];
      let featuredDeals = targetIds.map(id => productsWithLocalImages.find(p => p.id === id || p._id === id)).filter(Boolean);
      setDealsData(featuredDeals.length > 0 ? featuredDeals : productsWithLocalImages.slice(0, 4));
    } catch (err) {
      setDealsData(staticItems.slice(0, 4));
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDeals(); }, [API_BASE_URL]);

  if (loading) return <div className="py-24 flex justify-center bg-stone-50 dark:bg-neutral-950"><Loader2 className="w-6 h-6 animate-spin dark:text-white" /></div>;

  return (
    <section className="py-24 bg-stone-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center mb-20 text-center">
          <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Limited Edition</span>
          <h2 className="text-3xl lg:text-4xl font-light text-neutral-900 dark:text-white uppercase tracking-tighter">
            Weekly <span className="font-black italic text-amber-500">Exclusives</span>
          </h2>
          <div className="w-16 h-px bg-stone-200 dark:bg-neutral-800 mt-8" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
          {dealsData.map((product, idx) => (
            <motion.div key={product._id || product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              onClick={() => navigate(`/product/${product._id || product.id}`)} className="group cursor-pointer flex flex-col items-center text-center">
              <div className="relative w-full aspect-[4/5] mb-10 overflow-hidden bg-stone-100 dark:bg-neutral-900 rounded-lg shadow-inner">
                <div className="absolute top-4 left-4 z-10"><span className="bg-rose-600 text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-widest rounded-sm">Sale</span></div>
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-10 transition-transform duration-1000 ease-out group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <button className="w-full bg-neutral-950 dark:bg-white dark:text-neutral-950 text-white text-[10px] font-black uppercase py-4 tracking-widest shadow-2xl rounded-lg">Explore Details</button>
                </div>
              </div>
              <div className="space-y-3 w-full">
                <p className="text-neutral-400 dark:text-neutral-500 text-[9px] font-bold uppercase tracking-[0.2em]">{product.brand}</p>
                <h3 className="text-neutral-900 dark:text-white font-bold text-sm uppercase tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{product.name}</h3>
                <div className="flex items-center justify-center gap-4 pt-2">
                  <span className="text-base font-black text-neutral-950 dark:text-amber-400">₹{Number(product.price).toLocaleString()}</span>
                  <span className="text-xs text-neutral-300 dark:text-neutral-700 line-through font-light italic">₹{(Number(product.price) * 1.3).toFixed(0)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Deals;