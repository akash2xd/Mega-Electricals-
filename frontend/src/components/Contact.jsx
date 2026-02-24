import React, { useState } from 'react';
import {
  MapPin, Phone, Mail, Clock, Send,
  Instagram, Linkedin, Twitter, Zap
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Inquiry Sent! Our team will contact you shortly.");
    setFormData({ name: '', email: '', message: '' });
  };

  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.123456789012!2d88.4273!3d22.5935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275b123456789%3A0x123456789abcdef!2sKestopur%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 transition-colors duration-500 font-sans selection:bg-amber-100">

      {/* --- Premium Hero Section --- */}
      <div className="relative bg-neutral-900 pt-24 pb-48 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#f59e0b 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px]"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.3em] uppercase text-amber-400 border border-amber-500/20 rounded-full bg-amber-500/5">
            <Zap size={12} className="fill-amber-400" /> Professional Electrical Solutions
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
            Powering Your <span className="italic text-amber-400 font-light underline decoration-amber-500/30 underline-offset-8">Vision.</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            From industrial bulk orders to precision consultancy, we provide the spark for your next project.
          </p>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 -mt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* --- Left Column: Info & Map --- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-100 dark:border-neutral-800">
              <h2 className="text-2xl font-serif dark:text-white text-neutral-900 mb-8 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-amber-500"></span>
                Headquarters
              </h2>

              <div className="grid gap-6">
                {[
                  { icon: <MapPin size={20} />, title: "Our Location", detail: "Mohisgote, Kestopur, Kolkata, 700102" },
                  { icon: <Phone size={20} />, title: "Support", detail: "+91 8240822977" },
                  { icon: <Mail size={20} />, title: "Email", detail: "exlucario2op@gmail.com" },
                  { icon: <Clock size={20} />, title: "Store Hours", detail: "Mon-Sat: 9AM - 8PM" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-5 group">
                    <div className="mt-1 w-10 h-10 flex items-center justify-center rounded-xl bg-stone-50 dark:bg-neutral-800 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-0.5">{item.title}</p>
                      <p className="text-md text-neutral-700 dark:text-neutral-300 font-medium">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* The Map */}
              <div className="mt-10 relative group rounded-3xl overflow-hidden shadow-inner border border-stone-100 dark:border-neutral-800 h-64 grayscale hover:grayscale-0 transition-all duration-700">
                <iframe
                  title="Mega Electricals Location Map"
                  src={mapUrl}
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Social Connection */}
            <div className="px-8 py-6 bg-amber-500 rounded-[2rem] flex items-center justify-between text-white shadow-lg shadow-amber-500/20">
              <span className="text-sm font-bold tracking-widest uppercase">Stay Connected</span>
              <div className="flex gap-4">
                {[<Instagram size={20} />, <Linkedin size={20} />, <Twitter size={20} />].map((social, i) => (
                  <button key={i} className="hover:scale-110 transition-transform">{social}</button>
                ))}
              </div>
            </div>
          </div>

          {/* --- Right Column: Contact Form --- */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-neutral-900 p-8 md:p-14 rounded-[3rem] shadow-2xl shadow-stone-200/60 dark:shadow-none border border-stone-50 dark:border-neutral-800">
              <div className="mb-12">
                <h3 className="text-3xl font-serif text-neutral-900 dark:text-white mb-3">Send a Message</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Have a specific requirement? Fill out the form below and our
                  technical lead will get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="relative group">
                  <input
                    type="text" required placeholder=" "
                    className="w-full bg-transparent border-b border-stone-200 dark:border-neutral-700 py-3 outline-none focus:border-amber-500 dark:text-white transition-all peer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <label className="absolute left-0 top-3 text-neutral-400 text-sm pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-xs">Full Name *</label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative group">
                    <input
                      type="email" required placeholder=" "
                      className="w-full bg-transparent border-b border-stone-200 dark:border-neutral-700 py-3 outline-none focus:border-amber-500 dark:text-white transition-all peer"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <label className="absolute left-0 top-3 text-neutral-400 text-sm pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-xs">Email Address *</label>
                  </div>
                  <div className="relative group">
                    <input
                      type="tel" placeholder=" "
                      className="w-full bg-transparent border-b border-stone-200 dark:border-neutral-700 py-3 outline-none focus:border-amber-500 dark:text-white transition-all peer"
                    />
                    <label className="absolute left-0 top-3 text-neutral-400 text-sm pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-xs">Phone (Optional)</label>
                  </div>
                </div>

                <div className="relative group">
                  <textarea
                    rows="4" required placeholder=" "
                    className="w-full bg-transparent border-b border-stone-200 dark:border-neutral-700 py-3 outline-none focus:border-amber-500 dark:text-white transition-all resize-none peer"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                  <label className="absolute left-0 top-3 text-neutral-400 text-sm pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-xs">Inquiry Details *</label>
                </div>

                <button className="group relative w-full overflow-hidden bg-neutral-900 dark:bg-amber-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl hover:shadow-amber-500/20 active:scale-[0.99]">
                  <span className="relative z-10 flex items-center justify-center gap-3 tracking-[0.2em] uppercase text-xs">
                    Dispatch Message <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                  <div className="absolute inset-0 bg-amber-500 transition-transform duration-500 translate-y-full group-hover:translate-y-0"></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;