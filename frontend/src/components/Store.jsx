import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Filter, X, ChevronDown, Check,
  ShoppingCart, ChevronRight,
  ArrowUpDown, RotateCcw, Loader2, History, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

import { categories, itemsData as staticItems } from '../data/itemsData';

const Store = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const searchRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);

  const [addedItemId, setAddedItemId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/admin/inventory`);
        if (!res.ok) throw new Error("API Error");
        const dbData = await res.json();

        const mergedFromDB = dbData
          .filter(item => !item.isDeleted)
          .map(dbItem => {
            const localMatch = staticItems.find(
              local => local.name.trim().toLowerCase() === dbItem.name.trim().toLowerCase()
            );
            return {
              ...dbItem,
              image: localMatch ? localMatch.image : dbItem.image,
              id: dbItem._id || localMatch?.id
            };
          });

        const localOnlyItems = staticItems.filter(local =>
          !dbData.some(dbItem => dbItem.name.trim().toLowerCase() === local.name.trim().toLowerCase())
        );

        setAllItems([...mergedFromDB, ...localOnlyItems]);

      } catch (err) {
        console.error("Using Local Fallback:", err);
        setAllItems(staticItems);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const savedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(savedHistory);

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [API_BASE_URL]);

  useEffect(() => {
    if (allItems.length > 0) {
      const highPrice = Math.max(...allItems.map(item => Number(item.price)));
      setMaxPrice(highPrice);
      setPriceRange([0, highPrice]);
    }
  }, [allItems]);

  const availableBrands = ["All", ...new Set(allItems.map(item => item.brand))];

  useEffect(() => {
    if (searchQuery.length > 1) {
      const q = searchQuery.toLowerCase();
      const matched = allItems
        .filter(item => item.name.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q))
        .slice(0, 6);
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, allItems]);

  const handleSearchSubmit = (query) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    setSearchQuery(cleanQuery);
    setShowSearchDropdown(false);
    const updatedHistory = [cleanQuery, ...searchHistory.filter(h => h !== cleanQuery)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const removeHistoryItem = (e, item) => {
    e.stopPropagation();
    const updated = searchHistory.filter(h => h !== item);
    setSearchHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  useEffect(() => {
    let result = [...allItems];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== "All") result = result.filter(item => item.category === activeCategory);
    if (activeBrand !== "All") result = result.filter(item => item.brand === activeBrand);
    result = result.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

    if (sortBy === "low-high") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "high-low") result.sort((a, b) => b.price - a.price);

    setFilteredItems(result);
  }, [activeCategory, activeBrand, searchQuery, priceRange, sortBy, allItems]);

  const resetFilters = () => {
    setActiveCategory("All");
    setActiveBrand("All");
    setPriceRange([0, maxPrice]);
    setSortBy("default");
    setSearchQuery("");
  };

  const handleAddToCart = async (e, item) => {
    e.stopPropagation();
    await addToCart(item);
    setAddedItemId(item._id || item.id);
    setTimeout(() => setAddedItemId(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-neutral-950">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="font-black uppercase tracking-[0.3em] text-neutral-400 text-xs text-center px-6">Syncing Inventory...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 transition-colors duration-300 pb-24 lg:pb-0 lg:overflow-x-hidden">
      <style>{`
        .filter-scrollbar::-webkit-scrollbar { width: 4px; }
        .filter-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .filter-scrollbar::-webkit-scrollbar-thumb { background: #f59e0b; border-radius: 20px; }
      `}</style>

      {/* HEADER & SEARCH UI */}
      <div className="bg-stone-100 dark:bg-neutral-900/50 border-b dark:border-neutral-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 py-8 lg:py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-black text-neutral-950 dark:text-white tracking-tighter uppercase mb-2 leading-none italic">
              PREMIUM <span className="text-amber-500 not-italic">CATALOGUE</span>
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm lg:text-base max-w-2xl font-medium">
              Enterprise electrical solutions engineered for precision.
            </p>
          </motion.div>

          <div className="mt-8 max-w-2xl relative" ref={searchRef}>
            <div className="relative group z-50">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search size={22} className="text-neutral-400 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search components or brands..."
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchQuery)}
                className="w-full bg-white dark:bg-neutral-800 border-2 border-transparent shadow-2xl focus:border-amber-500 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none text-neutral-900 dark:text-white transition-all font-bold text-base"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-rose-500">
                  <X size={20} />
                </button>
              )}
            </div>

            <AnimatePresence>
              {showSearchDropdown && (searchHistory.length > 0 || suggestions.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-[2rem] shadow-2xl z-[100] overflow-hidden"
                >
                  {searchQuery.length === 0 && searchHistory.length > 0 && (
                    <div className="p-4">
                      <p className="px-4 py-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 italic">
                        <History size={12} /> Recent
                      </p>
                      {searchHistory.map((item, idx) => (
                        <div key={idx} onClick={() => handleSearchSubmit(item)} className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer group">
                          <span className="text-sm font-bold text-neutral-600 dark:text-neutral-300">{item}</span>
                          <button onClick={(e) => removeHistoryItem(e, item)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchQuery.length > 0 && suggestions.length > 0 && (
                    <div className="p-4">
                      <p className="px-4 py-2 text-[10px] font-black text-amber-500 uppercase tracking-widest italic">Live Matches</p>
                      {suggestions.map((item) => (
                        <div key={item._id || item.id} onClick={() => { handleSearchSubmit(item.name); navigate(`/product/${item._id || item.id}`); }} className="flex items-center gap-4 px-4 py-3 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl cursor-pointer transition-colors">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0"><img src={item.image} alt="" className="w-full h-full object-cover" /></div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">{item.name}</span>
                            <span className="text-[10px] font-black text-neutral-400 uppercase">{item.brand}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 py-8 lg:h-[1150px]">
        <div className="flex flex-col lg:flex-row gap-12 h-full">
          {/* SIDEBAR FILTER */}
          <aside className="hidden lg:block w-80 shrink-0 h-full">
            <div className="h-full flex flex-col bg-white dark:bg-neutral-900/30 rounded-[2.5rem] border border-stone-200 dark:border-neutral-800 shadow-sm overflow-hidden">
              <div className="flex-1 overflow-y-auto filter-scrollbar p-8 space-y-12">
                <div>
                  <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-6 italic">Categories</h3>
                  <div className="space-y-1">
                    {categories.map(cat => (
                      <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full flex justify-between items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeCategory === cat ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-neutral-600 dark:text-neutral-400 hover:bg-stone-100 dark:hover:bg-neutral-800'}`}>
                        {cat} <ChevronRight size={14} className={activeCategory === cat ? 'opacity-100' : 'opacity-0'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-6 italic">Authorized Brands</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {availableBrands.map(brand => (
                      <button key={brand} onClick={() => setActiveBrand(brand)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeBrand === brand ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xl' : 'text-neutral-600 dark:text-neutral-400 hover:bg-stone-100 dark:hover:bg-neutral-800'}`}>
                        <div className={`w-2 h-2 rounded-full ${activeBrand === brand ? 'bg-amber-500 animate-pulse' : 'bg-neutral-300'}`} />
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Budget Limit</h3>
                    <span className="text-xs font-black text-amber-500">₹{priceRange[1]}</span>
                  </div>
                  <input type="range" min="0" max={maxPrice} value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="w-full h-1.5 bg-stone-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                </div>
              </div>
              <div className="p-6 border-t dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-900/50 backdrop-blur-md">
                <button onClick={resetFilters} className="w-full flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase text-neutral-400 hover:text-rose-500 transition-all border-2 border-dashed border-stone-200 dark:border-neutral-800 rounded-2xl">
                  <RotateCcw size={16} /> Wipe Filters
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN GRID */}
          <main className="flex-1 lg:overflow-y-auto lg:h-full filter-scrollbar lg:pr-6">
            <div className="sticky top-0 z-10 bg-stone-50/80 dark:bg-neutral-950/80 backdrop-blur-md flex items-center justify-between mb-8 py-4 px-1">
              <p className="text-neutral-950 dark:text-white font-black text-xs uppercase tracking-[0.2em]">
                Found <span className="text-amber-500">{filteredItems.length}</span> Masterpieces
              </p>
              <div className="hidden lg:block relative">
                <button onClick={() => setIsSortOpen(!isSortOpen)} className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isSortOpen ? 'bg-amber-500 text-white shadow-lg' : 'bg-stone-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'}`}>
                  <ArrowUpDown size={16} /> Sort <ChevronDown size={14} className={isSortOpen ? 'rotate-180' : ''} />
                </button>
                <AnimatePresence>
                  {isSortOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-3 w-64 bg-white dark:bg-neutral-900 border border-stone-100 dark:border-neutral-800 rounded-[2rem] shadow-2xl z-20 overflow-hidden p-2">
                        {[{ label: 'Recommended', value: 'default' }, { label: 'Price: Low to High', value: 'low-high' }, { label: 'Price: High to Low', value: 'high-low' }].map((option) => (
                          <button key={option.value} onClick={() => { setSortBy(option.value); setIsSortOpen(false); }} className="w-full flex justify-between items-center px-5 py-4 text-left text-xs font-black uppercase tracking-widest hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors rounded-2xl">
                            <span className={sortBy === option.value ? 'text-amber-500' : 'text-neutral-600 dark:text-neutral-300'}>{option.label}</span>
                            {sortBy === option.value && <Check size={16} className="text-amber-500" />}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8 pb-32 lg:pb-12">
              {filteredItems.map((item) => (
                <motion.div key={item._id || item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ y: -8 }} onClick={() => navigate(`/product/${item._id || item.id}`)} className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-stone-200 dark:border-neutral-800 overflow-hidden group shadow-sm hover:shadow-2xl transition-all flex flex-col">
                  <div className="aspect-square relative bg-stone-50 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-neutral-900 dark:text-white border border-white/20 shadow-sm">{item.brand}</span>
                  </div>
                  <div className="p-4 sm:p-7 flex flex-col flex-1">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">{item.category}</span>
                    <h3 className="font-black text-neutral-900 dark:text-white text-sm sm:text-base line-clamp-2 h-10 sm:h-12 uppercase tracking-tighter">{item.name}</h3>
                    <div className="mt-auto flex items-center justify-between pt-5 border-t border-stone-100 dark:border-neutral-800">
                      <div className="flex flex-col">
                        <span className="text-neutral-400 text-[10px] font-bold line-through italic">₹{(item.price * 1.25).toFixed(0)}</span>
                        <span className="text-lg sm:text-2xl font-black text-neutral-950 dark:text-white italic tracking-tighter">₹{Number(item.price).toLocaleString()}</span>
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg ${addedItemId === (item._id || item.id) ? 'bg-amber-500 text-white' : 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                          }`}
                      >
                        {addedItemId === (item._id || item.id) ? <Check size={24} /> : <ShoppingCart size={22} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* MOBILE UI */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1 p-1.5 bg-neutral-950/95 dark:bg-white/95 backdrop-blur-xl rounded-full shadow-2xl border border-white/10">
        <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center gap-2 px-8 py-3.5 text-white dark:text-neutral-950 font-black text-[11px] uppercase tracking-widest border-r border-white/10">Filter</button>
        <button onClick={() => setIsSortOpen(true)} className="flex items-center gap-2 px-8 py-3.5 text-white dark:text-neutral-950 font-black text-[11px] uppercase tracking-widest">Sort</button>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileFilterOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white dark:bg-neutral-950 z-[101] rounded-t-[3rem] p-8 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-10 border-b dark:border-neutral-800 pb-6">
                <span className="font-black text-xl dark:text-white tracking-tighter uppercase italic">Filters</span>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-3 bg-stone-100 dark:bg-neutral-800 rounded-2xl dark:text-white"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-12 pb-24">
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-6">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => <button key={cat} onClick={() => { setActiveCategory(cat); setIsMobileFilterOpen(false); }} className={`px-6 py-3 rounded-2xl text-xs font-black ${activeCategory === cat ? 'bg-amber-500 text-white' : 'bg-stone-50 dark:bg-neutral-900 border dark:border-neutral-800'}`}>{cat}</button>)}
                  </div>
                </div>
              </div>
              <button onClick={() => { resetFilters(); setIsMobileFilterOpen(false); }} className="w-full py-5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-black text-xs uppercase tracking-widest rounded-[1.5rem]">Reset All</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Store;