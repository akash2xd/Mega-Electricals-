import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Mail, CheckCircle, Send,
  Loader2, Building2, Briefcase,
  ShieldCheck, Truck, BarChart3
} from 'lucide-react';
import { categories as staticCategories } from '../data/itemsData';

const BulkInquiry = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', companyName: '', email: '', mobile: '', category: '', message: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inquiry/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSent(true);
        setFormData({ fullName: '', companyName: '', email: '', mobile: '', category: '', message: '' });
      }
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 py-20 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.3em] uppercase text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full bg-amber-500/5"
          >
            Institutional Sales
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif text-neutral-900 dark:text-white mb-6 leading-tight">
            Enterprise <span className="italic font-light text-amber-500">Solutions.</span>
          </h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Secure exclusive corporate pricing, dedicated account management, and priority logistics for your large-scale electrical projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-white/10">

          {/* Left Panel: Value Proposition */}
          <div className="lg:col-span-5 bg-neutral-900 p-10 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]"></div>

            <div className="relative z-10">
              <h3 className="text-sm font-bold mb-12 uppercase tracking-[0.3em] text-amber-400">The Partnership Edge</h3>

              <div className="space-y-10">
                {[
                  { icon: <BarChart3 size={24} />, title: "Wholesale Pricing", desc: "Tiered discount structures based on procurement volume." },
                  { icon: <ShieldCheck size={24} />, title: "Compliance Ready", desc: "Fully GST-compliant invoicing and technical certifications." },
                  { icon: <Truck size={24} />, title: "Priority Logistics", desc: "Dedicated shipping lanes for time-sensitive site deliveries." },
                  { icon: <Briefcase size={24} />, title: "Project Consulting", desc: "Expert technical guidance for large-scale electrical blueprints." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="text-amber-500 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 relative z-10 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-4">Direct B2B Desk</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-neutral-300">
                  <Phone size={18} className="text-amber-500" />
                  <span className="font-medium">+91 97110 90909</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-300">
                  <Mail size={18} className="text-amber-500" />
                  <span className="font-medium">b2b@megaelectricals.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: The Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[neutral-900/80] p-10 md:p-16">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="w-24 h-24 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <CheckCircle size={56} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif text-neutral-900 dark:text-white mb-2">Request Received</h2>
                    <p className="text-neutral-500 dark:text-neutral-400">Our enterprise team will prepare your custom quote within 4 business hours.</p>
                  </div>
                  <button
                    onClick={() => setSent(false)}
                    className="px-8 py-3 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                  >
                    Send Another Request
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="text-amber-500" size={24} />
                    <h3 className="text-2xl font-serif dark:text-white text-neutral-900">Inquiry Specifications</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative group">
                      <input
                        required placeholder=" "
                        className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-700 py-3 outline-none focus:border-amber-500 dark:text-white transition-all peer"
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      />
                      <label className="absolute left-0 top-3 text-neutral-400 text-sm pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-xs uppercase tracking-widest font-bold">Contact Name *</label>
                    </div>
                    <div className="relative group">
                      <input
                        placeholder=" "
                        className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-700 py-3 outline-none focus:border-amber-500 dark:text-white transition-all peer"
                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      />
                      <label className="absolute left-0 top-3 text-neutral-400 text-sm pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-xs uppercase tracking-widest font-bold">Company Name</label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative group">
                      <input
                        required type="email" placeholder=" "
                        className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-700 py-3 outline-none focus:border-amber-500 dark:text-white transition-all peer"
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                      <label className="absolute left-0 top-3 text-neutral-400 text-sm pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-xs uppercase tracking-widest font-bold">Work Email *</label>
                    </div>
                    <div className="relative group">
                      <input
                        required placeholder=" "
                        className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-700 py-3 outline-none focus:border-amber-500 dark:text-white transition-all peer"
                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                      />
                      <label className="absolute left-0 top-3 text-neutral-400 text-sm pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-xs uppercase tracking-widest font-bold">Mobile Number *</label>
                    </div>
                  </div>

                  <div className="relative group">
                    <select
                      required
                      className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-700 py-3 outline-none focus:border-amber-500 dark:text-white transition-all appearance-none"
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="" className="dark:bg-neutral-900">Interest Category</option>
                      {staticCategories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat} className="dark:bg-neutral-900">{cat}</option>
                      ))}
                      <option value="Complete Project" className="dark:bg-neutral-900">Complete Project Setup</option>
                    </select>
                    <div className="absolute right-0 bottom-3 pointer-events-none text-neutral-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>

                  <div className="relative group">
                    <textarea
                      required rows="3" placeholder=" "
                      className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-700 py-3 outline-none focus:border-amber-500 dark:text-white transition-all resize-none peer"
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                    <label className="absolute left-0 top-3 text-neutral-400 text-sm pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-xs uppercase tracking-widest font-bold">Requirements Summary *</label>
                  </div>

                  <button
                    disabled={loading}
                    className="group relative w-full overflow-hidden bg-neutral-900 dark:bg-amber-600 text-white font-black py-6 rounded-2xl transition-all shadow-xl hover:shadow-amber-500/20 active:scale-[0.99]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3 tracking-[0.3em] uppercase text-xs">
                      {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Request B2B Quote</>}
                    </span>
                    <div className="absolute inset-0 bg-amber-600 transition-transform duration-500 tranneutral-y-full group-hover:tranneutral-y-0"></div>
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkInquiry;
