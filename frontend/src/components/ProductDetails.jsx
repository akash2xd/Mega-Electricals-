import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Truck, Shield, RefreshCcw, Minus, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

import { itemsData as staticItems } from '../data/itemsData';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        let foundProduct = null;

        try {
          const res = await fetch(`${API_BASE_URL}/api/admin/inventory`);
          if (res.ok) {
            const dbData = await res.json();
            foundProduct = dbData.find(p => p._id === id || p.id === id);
          }
        } catch (apiError) {
          console.warn("API unavailable, switching to local data fallback.");
        }

        if (!foundProduct) {
          foundProduct = staticItems.find(p => p.id === id);
        }

        if (foundProduct) {
          const localMatch = staticItems.find(
            local => local.name.trim().toLowerCase() === foundProduct.name.trim().toLowerCase()
          );

          if (localMatch) {
            foundProduct = {
              ...foundProduct,
              image: localMatch.image,
              specifications: foundProduct.specifications || localMatch.specifications
            };
          }
        }

        setProduct(foundProduct);

      } catch (error) {
        console.error("Critical Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, API_BASE_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-neutral-950">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="font-black uppercase tracking-widest text-neutral-400 text-xs">Loading Product Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-neutral-950 dark:text-white">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Product Not Available</h2>
        <p className="text-neutral-500 mb-6">ID: {id}</p>
        <button
          onClick={() => navigate('/store')}
          className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-all"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        <button
          onClick={() => navigate('/store')}
          className="flex items-center gap-2 text-neutral-400 hover:text-amber-600 mb-8 transition-colors font-bold uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={18} /> Back to Catalogue
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* --- LEFT: Image Gallery --- */}
          <div className="space-y-4">
            <div className="aspect-square bg-stone-100 dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-stone-200 dark:border-neutral-800 shadow-sm relative group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  src={productImages[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>

            {productImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all 
                      ${activeImage === index
                        ? 'border-amber-500 shadow-lg shadow-amber-500/20'
                        : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: Product Info --- */}
          <div className="flex flex-col">
            <div className="mb-4">
              <span className="px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                {product.brand}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white mb-4 leading-[1.1] tracking-tighter uppercase italic">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-8">
              <div className="flex text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} className={i < Math.floor(product.rating || 5) ? "" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-xs text-neutral-400 font-black uppercase tracking-widest">
                {product.reviews ? product.reviews.length : 12} Authentic Reviews
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-10">
              <span className="text-6xl font-black text-neutral-900 dark:text-white tracking-tighter">
                ₹{Number(product.price).toLocaleString()}
              </span>
              <span className="text-xl text-neutral-400 line-through font-bold">
                ₹{(product.price * 1.2).toFixed(0)}
              </span>
            </div>

            <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed mb-10 font-medium">
              {product.description || product.details || "Experience unparalleled performance with this premium electrical solution, designed for safety, durability, and high efficiency."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="flex items-center bg-stone-100 dark:bg-neutral-900 rounded-2xl px-6 py-4 border border-stone-200 dark:border-neutral-800">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-amber-600 text-neutral-600 transition-colors">
                  <Minus size={24} />
                </button>
                <span className="mx-8 font-black text-xl text-neutral-900 dark:text-white min-w-[2ch] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-amber-600 text-neutral-600 transition-colors">
                  <Plus size={24} />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-black text-sm uppercase tracking-[0.2em] py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl hover:scale-[1.02] active:scale-95"
              >
                <ShoppingCart size={20} /> Add to Collection
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 border-t border-stone-100 dark:border-neutral-800 pt-10">
              {[
                { icon: <Truck size={24} />, label: "Express Delivery", color: "text-blue-500" },
                { icon: <Shield size={24} />, label: "Certified Safety", color: "text-amber-500" },
                { icon: <RefreshCcw size={24} />, label: "Instant Returns", color: "text-orange-500" }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className={`p-4 bg-stone-50 dark:bg-neutral-900 rounded-2xl ${feature.color} border border-stone-100 dark:border-neutral-800`}>
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Specs Section */}
        <div className="mt-24 max-w-3xl">
          <h3 className="font-black text-2xl text-neutral-900 dark:text-white mb-8 uppercase tracking-tighter italic">Technical Specifications</h3>
          <div className="bg-stone-50 dark:bg-neutral-900 rounded-[2rem] border border-stone-100 dark:border-neutral-800 overflow-hidden">
            {product.specifications ? Object.entries(product.specifications).map(([key, value], index) => (
              <div key={key} className={`flex justify-between p-6 ${index % 2 === 0 ? 'bg-white dark:bg-neutral-800/30' : ''}`}>
                <span className="text-neutral-500 dark:text-neutral-400 font-bold uppercase text-[10px] tracking-widest">{key}</span>
                <span className="text-neutral-900 dark:text-white font-black">{value}</span>
              </div>
            )) : (
              <div className="p-12 text-center text-neutral-400 font-bold uppercase text-xs tracking-widest italic">
                Standard {product.category || "General"} Compliance Specifications Included
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;