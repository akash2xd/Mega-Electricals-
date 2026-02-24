import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Briefcase, ChevronDown, Clock, CheckCircle, 
  Loader2, ShoppingBag, MapPin, CreditCard, Truck, Ban, Timer
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

// FIXED: Importing the correct name 'itemsData' from your file
import { itemsData } from '../data/itemsData'; 

const MyOrders = () => {
  const { user } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('retail'); 
  const [retailOrders, setRetailOrders] = useState([]);
  const [b2bOrders, setB2bOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // --- ENVIRONMENT VARIABLE ---
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const getLocalImage = (productId) => {
    const staticItem = itemsData.find(item => item.id === productId);
    return staticItem && staticItem.images ? staticItem.images[0] : 'https://via.placeholder.com/150?text=Product';
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchAllOrders = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      try {
        // Constructing dynamic URLs using the environment variable
        const [retailRes, b2bRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/orders/my-orders`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/api/inquiry/my-inquiries?email=${user.email.toLowerCase().trim()}`)
        ]);

        if (retailRes.ok) {
          const retailData = await retailRes.json();
          setRetailOrders(Array.isArray(retailData) ? retailData : []);
        }
        if (b2bRes.ok) {
          const b2bData = await b2bRes.json();
          setB2bOrders(Array.isArray(b2bData) ? b2bData : []);
        }

      } catch (err) {
        console.error("Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [user, navigate, API_BASE_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-neutral-950">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="font-black uppercase tracking-[0.3em] text-neutral-400 text-[10px]">Syncing Personal Activity...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-8 xl:px-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="mb-12">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-black text-neutral-950 dark:text-white uppercase tracking-tighter italic leading-none">
              Your <span className="text-amber-500 not-italic">Activity</span>
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-3 font-medium">
              Manage your purchases and corporate enquiries in one central hub.
            </p>
          </motion.div>
        </div>

        {/* --- TAB SWITCHER --- */}
        <div className="flex bg-white dark:bg-neutral-900 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm mb-10 w-fit">
          <button 
            onClick={() => setActiveTab('retail')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'retail' ? 'bg-neutral-950 text-white shadow-lg' : 'text-neutral-400'}`}
          >
            <ShoppingBag size={14} /> Retail Orders
          </button>
          <button 
            onClick={() => setActiveTab('b2b')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'b2b' ? 'bg-amber-600 text-white shadow-lg' : 'text-neutral-400'}`}
          >
            <Briefcase size={14} /> B2B Leads
          </button>
        </div>

        {/* --- CONTENT AREA --- */}
        <AnimatePresence mode="wait">
          {activeTab === 'retail' ? (
            <motion.div key="retail" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
              {retailOrders.length === 0 ? (
                <EmptyState icon={<Package size={48} />} title="No Orders Found" subtitle="Visit our store to find premium components." />
              ) : (
                retailOrders.map(order => (
                  <RetailOrderCard 
                    key={order._id} 
                    order={order} 
                    isExpanded={expandedOrderId === order._id} 
                    onToggle={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)} 
                    renderImage={getLocalImage}
                  />
                ))
              )}
            </motion.div>
          ) : (
            <motion.div key="b2b" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              {b2bOrders.length === 0 ? (
                <EmptyState icon={<Briefcase size={48} />} title="No B2B Records" subtitle="Submit a bulk inquiry for project pricing." />
              ) : (
                b2bOrders.map(iq => <B2BOrderCard key={iq._id} inquiry={iq} />)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- RETAIL ORDER CARD ---
const RetailOrderCard = ({ order, isExpanded, onToggle, renderImage }) => {
  const getStatusStyles = (status) => {
    switch(status) {
      case 'Delivered':
        return { 
          bg: 'bg-amber-50 dark:bg-amber-950/40', 
          text: 'text-amber-600', 
          border: 'border-amber-100 dark:border-amber-800', 
          icon: <CheckCircle size={10} /> 
        };
      case 'Shipped':
        return { 
          bg: 'bg-blue-50 dark:bg-blue-950/40', 
          text: 'text-blue-600', 
          border: 'border-blue-100 dark:border-blue-800', 
          icon: <Truck size={10} /> 
        };
      case 'Cancelled':
        return { 
          bg: 'bg-red-50 dark:bg-red-950/40', 
          text: 'text-red-600', 
          border: 'border-red-100 dark:border-red-800', 
          icon: <Ban size={10} /> 
        };
      default: 
        return { 
          bg: 'bg-amber-50 dark:bg-amber-950/40', 
          text: 'text-amber-600', 
          border: 'border-amber-100 dark:border-amber-800', 
          icon: <Timer size={10} /> 
        };
    }
  };

  const statusStyle = getStatusStyles(order.status);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden transition-all">
      <div 
        className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${statusStyle.text} ${statusStyle.bg}`}>
            <Package size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">ORDER ID: {order._id.slice(-8).toUpperCase()}</p>
                <span className="text-[10px] font-bold text-neutral-300">|</span>
                <span className="text-[10px] font-bold text-neutral-400 flex items-center gap-1 italic"><Clock size={10} /> {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 className="font-black text-neutral-950 dark:text-white text-2xl italic tracking-tighter">₹{order.totalPrice?.toLocaleString()}</h3>
            <div className="flex items-center gap-3 mt-3">
              <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase px-3 py-1.5 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                {statusStyle.icon} {order.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className={`hidden md:block px-8 py-3.5 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-lg transition-all ${
            order.status === 'Shipped' 
              ? 'bg-blue-600 text-white animate-pulse' 
              : order.status === 'Delivered'
              ? 'bg-amber-600 text-white'
              : 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
          }`}>
            {order.status === 'Shipped' ? 'Track Package' : order.status === 'Delivered' ? 'Leave Review' : 'View Details'}
          </button>
          <ChevronDown className={`text-neutral-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden bg-neutral-50/30 dark:bg-neutral-950/20 border-t border-neutral-100 dark:border-neutral-800"
          >
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4 italic">Components Summary</p>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white dark:bg-neutral-900 p-5 rounded-[1.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                      <img src={renderImage(item.productId)} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-neutral-950 dark:text-white text-xs uppercase tracking-tighter leading-tight mb-1">{item.name}</p>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase italic">{item.qty} Unit(s) × ₹{item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-5 flex items-center gap-2 italic"><MapPin size={12}/> Delivery To</p>
                  <div className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 space-y-1.5 border-l-2 border-neutral-200 dark:border-neutral-800 pl-4">
                    <p className="text-neutral-900 dark:text-white font-black uppercase text-xs">{order.shippingDetails?.fullName || 'N/A'}</p>
                    <p className="leading-relaxed">{order.shippingDetails?.address || 'Address details missing'}</p>
                    <p>{order.shippingDetails?.city} - {order.shippingDetails?.pincode}</p>
                    <p className="pt-2 text-amber-600 font-black">Mob: {order.shippingDetails?.phone || 'No Contact'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-5 flex items-center gap-2 italic"><CreditCard size={12}/> Payment Details</p>
                  <div className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 space-y-2 border-l-2 border-neutral-200 dark:border-neutral-800 pl-4">
                    <p className="uppercase text-neutral-900 dark:text-white font-black">{order.paymentMethod || 'Method Pending'}</p>
                    <p className="text-[9px] text-neutral-400 font-medium tracking-[0.2em] leading-tight uppercase">Ref: {order.paymentId}</p>
                    <p className="text-[9px] text-neutral-400 font-medium italic mt-4">Verified via {order.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const B2BOrderCard = ({ inquiry }) => (
  <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm border-l-8 border-l-amber-500 hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md">{inquiry.category}</span>
          <span className="text-[10px] font-bold text-neutral-400 flex items-center gap-1 italic"><Clock size={10} /> {new Date(inquiry.createdAt).toLocaleDateString()}</span>
      </div>
      <h3 className="font-black text-neutral-950 dark:text-white text-xl uppercase tracking-tighter leading-none mb-2">{inquiry.companyName || 'Corporate Prospect'}</h3>
      <p className="text-neutral-500 dark:text-neutral-400 text-xs italic line-clamp-1 border-l-2 border-neutral-200 dark:border-neutral-700 pl-3">"{inquiry.message}"</p>
    </div>
    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-800 flex-shrink-0">
        <Briefcase size={24} />
    </div>
  </div>
);

const EmptyState = ({ icon, title, subtitle }) => (
  <div className="bg-white dark:bg-neutral-900 py-24 rounded-[3.5rem] border-2 border-dashed border-neutral-100 dark:border-neutral-800 flex flex-col items-center text-center px-6">
    <div className="text-neutral-200 dark:text-neutral-800 mb-6">{icon}</div>
    <h3 className="text-2xl font-black text-neutral-950 dark:text-white uppercase italic tracking-tighter mb-2 leading-none">{title}</h3>
    <p className="text-neutral-400 text-sm max-w-sm font-medium leading-relaxed">{subtitle}</p>
  </div>
);

export default MyOrders;
