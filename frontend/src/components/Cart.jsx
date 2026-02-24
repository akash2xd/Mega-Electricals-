import React, { useState } from 'react';
import {
  Trash2, Plus, Minus, ArrowLeft, ShoppingBag,
  ArrowRight, MapPin, CreditCard, CheckCircle,
  Loader2, Wallet, ShoppingCart, Zap, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, user, setCart } = useCart();

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.fullName || '',
    phone: user?.mobile || '',
    address: '',
    city: '',
    pincode: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const gst = subtotal * 0.18;
  const shippingThreshold = 5000;
  const shippingCharge = 500;
  const shipping = (subtotal >= shippingThreshold || subtotal === 0) ? 0 : shippingCharge;
  const total = subtotal + gst + shipping;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOrderSuccess = async (paymentId, method) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: cart,
          shippingDetails,
          totalPrice: total,
          paymentMethod: method,
          paymentId: paymentId || 'COD_ORDER'
        })
      });

      if (response.ok) {
        setCart([]);
        navigate('/my-orders');
      } else {
        const error = await response.json();
        alert(error.message || "Order placement failed.");
      }
    } catch (err) {
      alert("Order placement failed. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpay = async () => {
    const res = await loadRazorpayScript();
    if (!res) return alert("Razorpay SDK failed to load.");

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(total * 100),
      currency: "INR",
      name: "Mega Electricals",
      description: "Secure Component Purchase",
      handler: (res) => handleOrderSuccess(res.razorpay_payment_id, 'Razorpay'),
      prefill: {
        name: shippingDetails.fullName,
        contact: shippingDetails.phone
      },
      theme: { color: "#f59e0b" }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const EmptyCartView = () => (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-32 h-32 bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center mx-auto mb-10 border border-stone-100 dark:border-white/5">
          <ShoppingBag size={48} className="text-stone-200 dark:text-neutral-700" />
        </div>
        <h2 className="text-4xl font-serif text-neutral-900 dark:text-white mb-4">Your bag is empty.</h2>
        <p className="text-neutral-400 max-w-xs mx-auto mb-10 font-light">Add premium components to your collection to proceed with an order.</p>
        <button onClick={() => navigate('/store')} className="px-12 py-5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all shadow-xl">
          Return to Catalog
        </button>
      </motion.div>
    </div>
  );

  if (cart.length === 0 && checkoutStep === 'cart') return <EmptyCartView />;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 pt-16 pb-24 px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">

        {/* --- Header Architecture --- */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 mb-4 text-[9px] font-black tracking-[0.3em] uppercase text-amber-500 border border-amber-500/20 rounded-full bg-amber-500/5">
                {checkoutStep === 'cart' ? 'Procurement' : 'Security'}
              </span>
              <h1 className="text-5xl md:text-6xl font-serif text-neutral-900 dark:text-white leading-none">
                {checkoutStep === 'cart' ? 'Your ' : 'Secure '}
                <span className="italic font-light text-amber-500">{checkoutStep === 'cart' ? 'Bag' : 'Checkout'}</span>
              </h1>
            </div>

            {checkoutStep !== 'cart' && (
              <button
                onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'details' : 'cart')}
                className="flex items-center gap-3 text-[10px] font-black tracking-widest text-neutral-400 hover:text-amber-500 uppercase transition-all"
              >
                <ArrowLeft size={14} /> Back to {checkoutStep === 'payment' ? 'Shipping' : 'Cart'}
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* --- Main Logistics Section --- */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {checkoutStep === 'cart' && (
                <motion.div key="cart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.productId || item.id} className="group bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-stone-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-stone-200/50 dark:hover:shadow-none transition-all duration-500 flex flex-col sm:flex-row items-center gap-8">
                      <div className="w-40 h-40 rounded-[2rem] overflow-hidden bg-stone-50 dark:bg-neutral-800 border dark:border-white/5 flex-shrink-0">
                        <img src={item.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em]">{item.brand}</span>
                        <h3 className="text-2xl font-serif text-neutral-900 dark:text-white mt-1">{item.name}</h3>
                        <p className="text-2xl font-light text-neutral-900 dark:text-white mt-4">₹{item.price.toLocaleString()}</p>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center gap-6">
                        <div className="flex items-center bg-stone-50 dark:bg-neutral-800/50 rounded-2xl p-1.5 border border-stone-100 dark:border-white/5">
                          <button onClick={() => updateQuantity(item.productId || item.id, -1)} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-neutral-700 rounded-xl disabled:opacity-20 shadow-sm" disabled={item.qty <= 1}><Minus size={16} /></button>
                          <span className="w-12 text-center font-bold dark:text-white text-sm">{item.qty}</span>
                          <button onClick={() => updateQuantity(item.productId || item.id, 1)} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-neutral-700 rounded-xl shadow-sm"><Plus size={16} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.productId || item.id)} className="p-3 text-stone-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {checkoutStep === 'details' && (
                <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-neutral-900 p-10 md:p-16 rounded-[3rem] border border-stone-100 dark:border-white/5 shadow-2xl shadow-stone-200/50 dark:shadow-none space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="relative group">
                      <input required className="w-full bg-transparent border-b border-stone-200 dark:border-neutral-800 py-3 outline-none focus:border-amber-500 dark:text-white transition-all peer" value={shippingDetails.fullName} onChange={e => setShippingDetails({ ...shippingDetails, fullName: e.target.value })} placeholder=" " />
                      <label className="absolute left-0 top-3 text-neutral-400 text-[10px] font-black uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:-top-4">Receiver Name *</label>
                    </div>
                    <div className="relative group">
                      <input required className="w-full bg-transparent border-b border-stone-200 dark:border-neutral-800 py-3 outline-none focus:border-amber-500 dark:text-white transition-all peer" value={shippingDetails.phone} onChange={e => setShippingDetails({ ...shippingDetails, phone: e.target.value })} placeholder=" " />
                      <label className="absolute left-0 top-3 text-neutral-400 text-[10px] font-black uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:-top-4">Mobile Number *</label>
                    </div>
                  </div>
                  <div className="relative group">
                    <textarea rows="3" className="w-full bg-transparent border-b border-stone-200 dark:border-neutral-800 py-3 outline-none focus:border-amber-500 dark:text-white transition-all resize-none peer" value={shippingDetails.address} onChange={e => setShippingDetails({ ...shippingDetails, address: e.target.value })} placeholder=" " />
                    <label className="absolute left-0 top-3 text-neutral-400 text-[10px] font-black uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:-top-4">Full Delivery Address *</label>
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <input placeholder="City" className="w-full bg-transparent border-b border-stone-200 dark:border-neutral-800 py-3 outline-none focus:border-amber-500 dark:text-white transition-all" value={shippingDetails.city} onChange={e => setShippingDetails({ ...shippingDetails, city: e.target.value })} />
                    <input placeholder="Pincode" className="w-full bg-transparent border-b border-stone-200 dark:border-neutral-800 py-3 outline-none focus:border-amber-500 dark:text-white transition-all" value={shippingDetails.pincode} onChange={e => setShippingDetails({ ...shippingDetails, pincode: e.target.value })} />
                  </div>
                  <button onClick={() => setCheckoutStep('payment')} disabled={!shippingDetails.address || !shippingDetails.phone} className="w-full bg-neutral-900 dark:bg-amber-500 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:shadow-amber-500/20 disabled:opacity-30 transition-all">
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {checkoutStep === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {[
                    { id: 'online', title: 'Online Payment', desc: 'UPI, Cards, NetBanking', icon: <CreditCard size={32} />, action: handleRazorpay, bgColor: 'bg-amber-50 dark:bg-amber-950/30', textColor: 'text-amber-600' },
                    { id: 'cod', title: 'Cash on Delivery', desc: 'Pay in cash upon delivery', icon: <Wallet size={32} />, action: () => handleOrderSuccess(null, 'COD'), bgColor: 'bg-blue-50 dark:bg-blue-950/30', textColor: 'text-blue-600' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={method.action}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-between p-10 bg-white dark:bg-neutral-900 border border-stone-100 dark:border-white/5 rounded-[3rem] hover:border-amber-500 transition-all group shadow-sm hover:shadow-2xl"
                    >
                      <div className="flex items-center gap-8">
                        <div className={`p-5 ${method.bgColor} ${method.textColor} rounded-3xl transition-transform group-hover:scale-110`}>
                          {isProcessing ? <Loader2 className="animate-spin" size={32} /> : method.icon}
                        </div>
                        <div className="text-left">
                          <p className="text-2xl font-serif dark:text-white">{method.title}</p>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">{method.desc}</p>
                        </div>
                      </div>
                      <ArrowRight size={24} className="text-stone-200 group-hover:text-amber-500 transition-all group-hover:translate-x-2" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- Sidebar Order Intelligence --- */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-neutral-900 text-white p-10 rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><ShoppingCart size={140} /></div>

              <h3 className="text-2xl font-serif italic mb-10 pb-6 border-b border-white/10">
                Order <span className="text-amber-400 not-italic font-sans font-black uppercase text-sm tracking-widest ml-2">Summary</span>
              </h3>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-neutral-400">
                  <span>Tax (GST 18%)</span>
                  <span className="text-white">₹{gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-neutral-400">
                  <span>Logistics</span>
                  <span className={shipping === 0 ? 'text-amber-400 flex items-center gap-2' : 'text-white'}>
                    {shipping === 0 && <CheckCircle size={14} />}
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
              </div>

              {/* Free Shipping Intelligence */}
              {subtotal < shippingThreshold && subtotal > 0 && (
                <div className="mb-12 p-5 bg-amber-500/5 border border-amber-500/10 rounded-3xl">
                  <p className="text-[9px] font-black text-amber-400 uppercase text-center tracking-[0.2em] mb-3">
                    Add ₹{(shippingThreshold - subtotal).toLocaleString()} for Free Logistics
                  </p>
                  <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(subtotal / shippingThreshold) * 100}%` }} className="bg-amber-500 h-full shadow-[0_0_10px_#f59e0b]" />
                  </div>
                </div>
              )}

              <div className="flex justify-between items-end mb-12 pt-8 border-t border-white/10">
                <div>
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Total Amount</p>
                  <p className="text-5xl font-serif text-white leading-none tracking-tighter italic">₹{total.toLocaleString()}</p>
                </div>
              </div>

              {checkoutStep === 'cart' && (
                <button onClick={() => setCheckoutStep('details')} className="group w-full bg-amber-500 hover:bg-amber-400 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-xl shadow-amber-500/20 active:scale-95">
                  Secure Checkout <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              )}

              <div className="mt-8 flex items-center justify-center gap-3 opacity-30">
                <ShieldCheck size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Encrypted Transaction</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;