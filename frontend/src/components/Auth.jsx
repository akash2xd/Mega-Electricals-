import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Auth = () => {
  const { setToken } = useCart();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();

  const [emailIdentifier, setEmailIdentifier] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    companyName: '',
    gst: ''
  });

  const [otp, setOtp] = useState('');

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = isLogin
      ? { email: emailIdentifier.toLowerCase(), isLogin: true }
      : { ...formData, email: formData.email.toLowerCase(), isLogin: false };

    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        console.log("🔑 [TEST MODE] OTP:", data.otp);
        setStep(2);
        setTimer(30);
      } else {
        alert(data.message || "Authentication failed.");
      }
    } catch (error) {
      alert("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) return;
    setLoading(true);

    const emailToVerify = isLogin ? emailIdentifier : formData.email;

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToVerify.toLowerCase(),
          otp
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        navigate('/store');
      } else {
        alert(data.message || "Invalid Verification Code");
      }
    } catch (error) {
      alert("Verification system encountered an error.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setLoading(true);
    const email = isLogin ? emailIdentifier : formData.email;
    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), isLogin }),
      });
      const data = await res.json();
      if (data.success) setTimer(30);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-neutral-950 px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-2xl border border-stone-100 dark:border-neutral-800 relative z-10 overflow-hidden">
        <div className="px-8 pt-12 pb-4 text-center">
          <div className="w-16 h-16 bg-neutral-950 dark:bg-white rounded-2xl mx-auto flex items-center justify-center text-white dark:text-neutral-950 font-black text-2xl shadow-xl mb-8">BE</div>
          <h2 className="text-4xl font-black text-neutral-900 dark:text-white mb-2 uppercase tracking-tighter italic leading-none">
            {step === 2 ? "Check Inbox" : (isLogin ? "Partner Login" : "BP Onboarding")}
          </h2>
          <p className="text-neutral-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
            {step === 2
              ? `Authorized link sent to ${isLogin ? emailIdentifier : formData.email}`
              : (isLogin ? "Access your BP business portal" : "Register for the BP distribution network")}
          </p>
        </div>

        <div className="px-8 pb-12 pt-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSubmit} className="space-y-4">
                {isLogin ? (
                  <div className="relative group">
                    <Mail className="absolute left-5 top-4.5 text-neutral-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                    <span className="absolute left-12 top-4.5 text-stone-200 font-bold text-sm">|</span>
                    <input type="email" placeholder="Business Email Address" value={emailIdentifier} onChange={(e) => setEmailIdentifier(e.target.value)} className="w-full bg-stone-50 dark:bg-neutral-800/50 border-2 border-transparent focus:border-amber-500 rounded-2xl py-4 pl-16 pr-4 outline-none dark:text-white transition-all font-bold shadow-inner" required />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} className="w-full bg-stone-50 dark:bg-neutral-800/50 border-2 border-transparent focus:border-amber-500 rounded-2xl py-4 px-6 outline-none dark:text-white font-bold" required />
                      <input name="companyName" placeholder="Business Name" value={formData.companyName} onChange={handleInputChange} className="w-full bg-stone-50 dark:bg-neutral-800/50 border-2 border-transparent focus:border-amber-500 rounded-2xl py-4 px-6 outline-none dark:text-white font-bold" required />
                    </div>
                    <input name="email" type="email" placeholder="Verification Email" value={formData.email} onChange={handleInputChange} className="w-full bg-stone-50 dark:bg-neutral-800/50 border-2 border-transparent focus:border-amber-500 rounded-2xl py-4 px-6 outline-none dark:text-white font-bold" required />
                    <input name="mobile" type="text" placeholder="Contact Phone" value={formData.mobile} onChange={handleInputChange} maxLength={10} className="w-full bg-stone-50 dark:bg-neutral-800/50 border-2 border-transparent focus:border-amber-500 rounded-2xl py-4 px-6 outline-none dark:text-white font-bold" required />
                    <input name="gst" placeholder="GSTIN (Optional)" value={formData.gst} onChange={handleInputChange} className="w-full bg-stone-50 dark:bg-neutral-800/50 border-2 border-transparent focus:border-amber-500 rounded-2xl py-4 px-6 outline-none dark:text-white font-bold uppercase" />
                  </div>
                )}
                <button disabled={loading} className="w-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95">
                  {loading ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <>{isLogin ? "Generate Access OTP" : "Initialize BP Account"} <ArrowRight size={16} /></>}
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onSubmit={handleVerifyOtp} className="space-y-8">
                <input type="text" maxLength={4} placeholder="0 0 0 0" value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} className="w-full text-center text-5xl font-black tracking-[0.5em] bg-transparent border-b-4 border-stone-100 dark:border-neutral-800 focus:border-amber-500 outline-none pb-4 dark:text-white" autoFocus />
                <div className="flex justify-between items-center">
                  <button type="button" onClick={() => setStep(1)} className="text-neutral-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:text-neutral-600 transition-colors"><ChevronLeft size={16} /> Edit Email</button>
                  <button type="button" onClick={handleResendOtp} disabled={timer > 0} className={`text-xs font-black uppercase tracking-widest ${timer > 0 ? 'text-neutral-300' : 'text-amber-500'}`}>{timer > 0 ? `Retry in ${timer}s` : "Resend Code"}</button>
                </div>
                <button disabled={loading || otp.length !== 4} className="w-full bg-amber-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-amber-500/20 flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-95">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Finalize Session <CheckCircle size={18} /></>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-10 pt-8 border-t border-stone-50 dark:border-neutral-800/50 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-amber-500 transition-colors">
              {isLogin ? "Become a BP Partner? Register" : "Returning Partner? Access Portal"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;