import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MessageCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const linkStyle = "text-neutral-400 hover:text-amber-500 cursor-pointer transition-all duration-300 transform hover:translate-x-1";

  return (
    <footer className="bg-neutral-950 text-white pt-24 pb-12 border-t border-neutral-900 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-16">

        {/* Main Footer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">

          {/* Brand Philosophy */}
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                Mega <span className="text-amber-500 not-italic">Electricals</span>
              </h2>
              <div className="w-12 h-1 bg-amber-500 rounded-full" />
            </div>
            <p className="text-neutral-400 text-sm leading-loose font-light max-w-xs">
              Curating the world's finest electrical components. From industrial precision to the art of luxury lighting, we define the standards of excellence.
            </p>
          </div>

          {/* Navigation Directory */}
          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-10">Directory</h3>
            <ul className="space-y-4 text-xs uppercase tracking-widest font-bold">
              <li onClick={() => navigate('/')} className={linkStyle}>Home</li>
              <li onClick={() => navigate('/store')} className={linkStyle}>Collection</li>
              <li onClick={() => navigate('/categories')} className={linkStyle}>Categories</li>
              <li onClick={() => navigate('/contact')} className="text-amber-500 flex items-center gap-1 cursor-pointer hover:underline underline-offset-8">
                Request Consultation <ArrowUpRight size={12} />
              </li>
            </ul>
          </div>

          {/* Professional Standards */}
          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-10">Policy & Terms</h3>
            <ul className="space-y-4 text-xs uppercase tracking-widest font-bold">
              <li onClick={() => navigate('/about')} className={linkStyle}>Our Legacy</li>
              <li onClick={() => navigate('/privacy-policy')} className={linkStyle}>Privacy Standards</li>
              <li onClick={() => navigate('/return-policy')} className={linkStyle}>Exchange Policy</li>
              <li onClick={() => navigate('/terms')} className={linkStyle}>Terms of Service</li>
            </ul>
          </div>

          {/* Connection Hub */}
          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-10">Connect</h3>
            <div className="flex flex-wrap gap-6 mb-10">
              <Facebook size={18} className="text-neutral-500 hover:text-amber-500 cursor-pointer transition-colors" strokeWidth={1.5} />
              <Instagram size={18} className="text-neutral-500 hover:text-amber-500 cursor-pointer transition-colors" strokeWidth={1.5} />
              <Linkedin size={18} className="text-neutral-500 hover:text-amber-500 cursor-pointer transition-colors" strokeWidth={1.5} />
              <Twitter size={18} className="text-neutral-500 hover:text-amber-500 cursor-pointer transition-colors" strokeWidth={1.5} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-neutral-400 text-xs font-light">
                <Phone size={14} className="text-amber-500" />
                <span className="tracking-widest">+91 8240822977</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-400 text-xs font-light">
                <Mail size={14} className="text-amber-500" />
                <span className="tracking-widest">exlucario2op@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-12 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-[9px] text-neutral-500 uppercase tracking-[0.4em] font-medium text-center md:text-left">
              © 2026 Mega Electricals. All Rights Reserved.
            </p>
            <p className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em]">
              GSTIN: 19AJNPG1966F1ZZ
            </p>
          </div>

          <div className="flex items-center gap-8 opacity-20 grayscale">
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">Industrial Grade</span>
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">Premium QC</span>
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">Pan-India Reach</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;