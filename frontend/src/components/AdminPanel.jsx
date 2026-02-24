import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Trash2, Package, X, RefreshCw, LogOut,
  Loader2, RotateCcw, History, AlertTriangle,
  Edit, Search, Filter, Building2, Layers,
  Briefcase, Mail, Phone, MessageSquare, ExternalLink,
  ShoppingBag, Clock, Truck, CheckCircle2, Ban,
  FileText, Download, TrendingUp, DollarSign, FileSpreadsheet,
  Database, UploadCloud
} from 'lucide-react';
import * as XLSX from 'xlsx';
// IMPORT YOUR STATIC DATA FOR SEEDING
import { itemsData, categories as staticCategories } from '../data/itemsData';

// --- CONFIGURATION ---
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Hardcoded for safety, or use import.meta.env.VITE_API_URL

const AdminPanel = () => {
  // --- 1. PERSISTENCE & AUTH ---
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('bp_admin_auth') === 'true');
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false); // New state for seeding process

  // Data State
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [orders, setOrders] = useState([]);

  // UI State
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedBrand, setSelectedBrand] = useState('All Companies');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Forms
  const [credentials, setCredentials] = useState({ id: '', pw: '' });
  const [formData, setFormData] = useState({
    name: '', brand: '', category: '', price: '', stock: 10, image: '', description: ''
  });

  // --- 2. DATA INITIALIZATION ENGINES ---
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [invRes, inqRes, ordRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/inventory`),
        fetch(`${API_BASE_URL}/api/admin/inquiries`),
        fetch(`${API_BASE_URL}/api/admin/orders`)
      ]);
      const [inv, inq, ord] = await Promise.all([invRes.json(), inqRes.json(), ordRes.json()]);

      setProducts(Array.isArray(inv) ? inv : []);
      setInquiries(Array.isArray(inq) ? inq : []);
      setOrders(Array.isArray(ord) ? ord : []);
    } catch (err) {
      console.error("Critical Sync Error:", err);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (isAdmin) fetchAllData();
  }, [isAdmin]);

  // --- 3. SEEDING ENGINE (ONE-TIME MIGRATION) ---
  const handleSeedDatabase = async () => {
    if (!window.confirm(`This will upload ${itemsData.length} items from your local file to the database. Continue?`)) return;

    setSeeding(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // We loop through the local data and POST each one to the database
      for (const item of itemsData) {
        // Prepare the payload (Removing the local string 'id' so MongoDB creates a new '_id')
        const payload = {
          name: item.name,
          brand: item.brand,
          category: item.category,
          price: item.price,
          stock: 100, // Default stock for seeded items
          image: item.image, // This sends the resolved localhost URL
          description: item.details || item.description || "Standard Item",
          specifications: item.specifications || {}
        };

        const res = await fetch(`${API_BASE_URL}/api/admin/inventory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) successCount++;
        else failCount++;
      }

      alert(`Migration Complete!\nSuccess: ${successCount}\nFailed: ${failCount}`);
      fetchAllData(); // Refresh to see new DB items
    } catch (err) {
      alert("Seeding Error: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  // --- 4. ANALYTICS ENGINE (Strict Audit Logic) ---
  const auditStats = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== 'Cancelled');

    const monthlyMap = validOrders.reduce((acc, order) => {
      const date = new Date(order.createdAt);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[monthYear]) acc[monthYear] = { period: monthYear, revenue: 0, count: 0 };
      acc[monthYear].revenue += (Number(order.totalPrice) || 0);
      acc[monthYear].count += 1;
      return acc;
    }, {});

    const totalNetRevenue = validOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
    const totalLostValue = orders.filter(o => o.status === 'Cancelled').reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

    return {
      netRevenue: totalNetRevenue,
      lostRevenue: totalLostValue,
      totalFulfilled: validOrders.length,
      totalCancelled: orders.length - validOrders.length,
      monthlyBreakdown: Object.values(monthlyMap).reverse()
    };
  }, [orders]);

  // --- 5. EXCEL EXPORT ---
  const downloadAuditExcel = () => {
    const auditRows = orders.map((o) => {
      const itemDescription = o.items?.map(i => `${i.name} (x${i.qty})`).join(", ") || "N/A";
      return {
        "Date": new Date(o.createdAt).toLocaleDateString(),
        "Order ID": o._id.toUpperCase(),
        "Status": o.status,
        "Customer": o.shippingDetails?.fullName || 'Guest',
        "Location": `${o.shippingDetails?.city || ''}`,
        "Items": itemDescription,
        "Value (₹)": o.status === 'Cancelled' ? 0 : Number(o.totalPrice),
        "Payment": o.paymentMethod,
      };
    });

    const ws = XLSX.utils.json_to_sheet(auditRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financial Audit");
    XLSX.writeFile(wb, `BP_Audit_${new Date().getFullYear()}.xlsx`);
  };

  // --- 6. DATA HANDLERS ---
  const handleSoftDelete = async (id) => {
    if (window.confirm("Move this product to Recycle Bin?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/inventory/${id}`, { method: 'DELETE' });
        if (res.ok) fetchAllData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  const handleRestore = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/inventory/restore/${id}`, { method: 'PUT' });
      if (res.ok) fetchAllData();
    } catch (err) { alert("Restore failed"); }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm("PERMANENTLY DELETE? This cannot be undone.")) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/inventory/permanent/${id}`, { method: 'DELETE' });
        if (res.ok) fetchAllData();
      } catch (err) { alert("Permanent delete failed"); }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchAllData();
    } catch (err) { alert("Status Update Failed"); }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    // CRITICAL: Ensure we use the _id for updates
    const url = editingProduct
      ? `${API_BASE_URL}/api/admin/inventory/${editingProduct._id}`
      : `${API_BASE_URL}/api/admin/inventory`;

    try {
      const res = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) { fetchAllData(); closeModal(); }
      else { alert("Failed to save. Check server logs."); }
    } catch (err) { alert("Save failed: " + err.message); }
  };

  // [AUTH]
  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.id === 'id123' && credentials.pw === '1234') {
      setIsAdmin(true);
      sessionStorage.setItem('bp_admin_auth', 'true');
    } else { alert("Authentication Failed"); }
  };

  const handleLogout = () => { setIsAdmin(false); sessionStorage.removeItem('bp_admin_auth'); };

  // [UI Helpers]
  const startEditing = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || '',
      brand: p.brand || '',
      category: p.category || '',
      price: p.price || '',
      stock: p.stock || 10,
      image: p.image || '',
      description: p.description || ''
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingProduct(null); setFormData({ name: '', brand: '', category: '', price: '', stock: 10, image: '', description: '' }); };

  const filteredAndSortedItems = useMemo(() => {
    let result = products.filter(p => activeTab === 'inventory' ? !p.isDeleted : p.isDeleted);
    if (selectedBrand !== 'All Companies') result = result.filter(item => item.brand === selectedBrand);
    if (selectedCategory !== 'All Categories') result = result.filter(item => item.category === selectedCategory);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => item.name.toLowerCase().includes(query) || item.brand.toLowerCase().includes(query));
    }
    return result.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'stock') return a.stock - b.stock;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [products, activeTab, searchQuery, sortBy, selectedBrand, selectedCategory]);

  const uniqueBrands = useMemo(() => ['All Companies', ...new Set(products.map(p => p.brand))], [products]);
  const availableCategories = ['All Categories', ...staticCategories.filter(c => c !== 'All')];

  // --- 7. RENDER LOGIC ---
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] w-full max-w-md border border-slate-800 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-black mb-8 text-white uppercase tracking-tighter text-center italic">Mega <span className="text-emerald-500 text-xs block tracking-widest mt-1 not-italic">Admin Access</span></h2>
          <div className="space-y-4 mb-8">
            <input required type="text" placeholder="ID" className="w-full p-4 rounded-2xl bg-slate-800 text-white outline-none focus:ring-2 ring-emerald-500" onChange={(e) => setCredentials({ ...credentials, id: e.target.value })} />
            <input required type="password" placeholder="Password" className="w-full p-4 rounded-2xl bg-slate-800 text-white outline-none focus:ring-2 ring-emerald-500" onChange={(e) => setCredentials({ ...credentials, pw: e.target.value })} />
          </div>
          <button className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-500 transition-all">AUTHENTICATE</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-all duration-300 antialiased">
      <div className="max-w-7xl mx-auto">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 md:mb-12">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black dark:text-white uppercase tracking-tighter italic leading-none">BP <span className="text-emerald-500 not-italic">Control Hub</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 ml-1">Enterprise Asset Management</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchAllData} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 rounded-2xl hover:text-emerald-500 shadow-sm transition-all"><RefreshCw size={20} className={loading ? 'animate-spin' : ''} /></button>
            <button onClick={handleLogout} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-red-500 rounded-2xl shadow-sm hover:bg-red-500 hover:text-white transition-all"><LogOut size={20} /></button>
          </div>
        </div>

        {/* --- SEEDER NOTICE (Only if DB is empty) --- */}
        {products.length === 0 && !loading && (
          <div className="mb-8 p-6 bg-indigo-600 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-900/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl"><Database size={24} /></div>
              <div>
                <h3 className="font-black text-xl uppercase italic tracking-tighter">Database Empty</h3>
                <p className="text-xs font-medium opacity-80">Import {itemsData.length} items from your local static file?</p>
              </div>
            </div>
            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              {seeding ? <Loader2 className="animate-spin" /> : <UploadCloud size={16} />}
              {seeding ? "Importing..." : "Sync Local Data to DB"}
            </button>
          </div>
        )}

        {/* --- TOOLBAR (Responsive Grid) --- */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none text-sm font-bold shadow-sm focus:ring-2 ring-emerald-500/20" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            {/* Filters */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <Building2 size={18} className="text-emerald-500" />
              <select className="bg-transparent w-full text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 outline-none cursor-pointer" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                {uniqueBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <Layers size={18} className="text-blue-500" />
              <select className="bg-transparent w-full text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 outline-none cursor-pointer" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <Filter size={18} className="text-slate-400" />
              <select className="bg-transparent w-full text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 outline-none cursor-pointer" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Latest</option>
                <option value="price-high">Price: High</option>
                <option value="price-low">Price: Low</option>
                <option value="stock">Low Stock</option>
              </select>
            </div>
          </div>
        )}

        {/* --- TABS --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex flex-wrap justify-center md:justify-start gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full md:w-auto">
            {['inventory', 'orders', 'reports', 'inquiries', 'deleted'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab
                  ? (tab === 'deleted' ? 'bg-red-600 text-white' : tab === 'orders' ? 'bg-emerald-600 text-white' : tab === 'reports' ? 'bg-blue-600 text-white' : tab === 'inquiries' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-white')
                  : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab === 'deleted' ? 'Bin' : tab}
              </button>
            ))}
          </div>
          {activeTab === 'inventory' && (
            <button onClick={() => { setEditingProduct(null); setShowModal(true); }} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 transition-all active:scale-95">+ ADD PRODUCT</button>
          )}
        </div>

        {/* --- DYNAMIC VIEW --- */}
        {activeTab === 'reports' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-emerald-500"><TrendingUp size={24} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Realized Revenue</p>
                </div>
                <h3 className="text-3xl md:text-4xl font-black dark:text-white italic tracking-tighter">₹{auditStats.netRevenue.toLocaleString()}</h3>
                <p className="text-[10px] text-slate-400 mt-2 font-bold italic">* Excluding Cancelled</p>
              </div>
              {/* Card 2 */}
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-2xl text-blue-500"><ShoppingBag size={24} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orders Success</p>
                </div>
                <h3 className="text-3xl md:text-4xl font-black dark:text-white italic tracking-tighter">{auditStats.totalFulfilled} Fulfilled</h3>
                <p className="text-[10px] text-slate-400 mt-2 font-bold">{orders.length > 0 ? ((auditStats.totalFulfilled / orders.length) * 100).toFixed(1) : 0}% Conversion</p>
              </div>
              {/* Card 3 */}
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-2xl text-red-500"><Ban size={24} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cancelled Value</p>
                </div>
                <h3 className="text-3xl md:text-4xl font-black dark:text-white italic tracking-tighter text-red-500">₹{auditStats.lostRevenue.toLocaleString()}</h3>
                <p className="text-[10px] text-slate-400 mt-2 font-bold italic">Loss from {auditStats.totalCancelled} units</p>
              </div>
              {/* Export Button Card */}
              <div className="sm:col-span-2 lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                <button onClick={downloadAuditExcel} className="w-full flex items-center justify-center gap-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-6 rounded-3xl hover:scale-[1.01] transition-all shadow-xl">
                  <FileSpreadsheet size={32} />
                  <div className="text-left">
                    <p className="font-black text-xs uppercase tracking-widest leading-none">Download Granular</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mt-1">Full Transaction Audit (.XLSX)</p>
                  </div>
                </button>
              </div>
            </div>

            {/* MONTHLY TABLE */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <h3 className="text-xl font-black dark:text-white uppercase italic tracking-tight">Month-Wise Audit</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                    <tr><th className="p-6 md:p-8 text-left">Period</th><th className="p-6 md:p-8 text-center">Valid Orders</th><th className="p-6 md:p-8 text-right">Net Revenue (₹)</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {auditStats.monthlyBreakdown.map((m, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-6 md:p-8 font-black dark:text-white uppercase italic tracking-tighter text-lg">{m.period}</td>
                        <td className="p-6 md:p-8 text-center font-bold text-slate-500 dark:text-slate-400">{m.count} Invoices</td>
                        <td className="p-6 md:p-8 text-right font-black text-emerald-500 text-2xl tracking-tighter italic">₹{m.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* MAIN DATA TABLE */
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px] md:min-w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  {activeTab === 'orders' ? (
                    <tr><th className="p-6 md:p-8">Order ID & Client</th><th className="p-6 md:p-8 text-center">Amount</th><th className="p-6 md:p-8 text-center">Status</th><th className="p-6 md:p-8 text-center">Workflow Action</th></tr>
                  ) : activeTab === 'inquiries' ? (
                    <tr><th className="p-6 md:p-8">Lead Prospect</th><th className="p-6 md:p-8 text-center">Contact Info</th><th className="p-6 md:p-8 text-center">Interest</th><th className="p-6 md:p-8 text-center">Action</th></tr>
                  ) : (
                    <tr><th className="p-6 md:p-8">Asset Details</th><th className="p-6 md:p-8 text-center">Price</th><th className="p-6 md:p-8 text-center">{activeTab === 'deleted' ? 'Status' : 'Live Stock'}</th><th className="p-6 md:p-8 text-center">Manage</th></tr>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {/* ORDERS MAPPING */}
                  {activeTab === 'orders' && orders.map(order => (
                    <tr key={order._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                      <td className="p-6 md:p-8"><p className="font-black dark:text-white text-lg uppercase italic">{order.shippingDetails?.fullName}</p><p className="text-[10px] font-black text-slate-400 uppercase mt-1">ID: #{order._id.slice(-8).toUpperCase()}</p></td>
                      <td className="p-6 md:p-8 text-center font-black dark:text-white text-xl">₹{order.totalPrice?.toLocaleString()}</td>
                      <td className="p-6 md:p-8 text-center"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border shadow-sm ${order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{order.status}</span></td>
                      <td className="p-6 md:p-8">
                        <div className="flex items-center justify-center gap-3">
                          {order.status === 'Processing' && (
                            <><button onClick={() => handleUpdateOrderStatus(order._id, 'Shipped')} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white shadow-sm transition-all"><Truck size={18} /></button>
                              <button onClick={() => window.confirm("Void this order?") && handleUpdateOrderStatus(order._id, 'Cancelled')} className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white shadow-sm transition-all"><Ban size={18} /></button></>
                          )}
                          {order.status === 'Shipped' && <button onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')} className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white shadow-sm transition-all"><CheckCircle2 size={18} /></button>}
                          {(order.status === 'Delivered' || order.status === 'Cancelled') && <span className="text-[10px] font-black text-slate-300 uppercase italic">Archived</span>}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* INVENTORY MAPPING (Active Only) */}
                  {activeTab === 'inventory' && filteredAndSortedItems.map(p => (
                    <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-6 md:p-8"><div className="flex items-center gap-4"><img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt="" /><p className="font-bold dark:text-white uppercase">{p.name}</p></div></td>
                      <td className="p-6 md:p-8 text-center font-black dark:text-white">₹{p.price.toLocaleString()}</td>
                      <td className="p-6 md:p-8 text-center"><span className="px-4 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase">{p.stock} Units</span></td>
                      <td className="p-6 md:p-8 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => startEditing(p)} className="p-3 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all shadow-sm"><Edit size={20} /></button>
                          <button onClick={() => handleSoftDelete(p._id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm"><Trash2 size={20} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* INQUIRIES MAPPING */}
                  {activeTab === 'inquiries' && inquiries.map(iq => (
                    <tr key={iq._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                      <td className="p-6 md:p-8"><p className="font-bold dark:text-white text-lg">{iq.fullName}</p><p className="text-[10px] font-black text-emerald-600 uppercase mt-1.5">{iq.companyName || 'Retail Lead'}</p></td>
                      <td className="p-6 md:p-8 text-center text-xs font-bold text-slate-500 dark:text-slate-400 space-y-1"><p><Mail size={12} className="inline mr-1" /> {iq.email}</p><p><Phone size={12} className="inline mr-1" /> {iq.mobile}</p></td>
                      <td className="p-6 md:p-8 text-center"><span className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-600">{iq.category}</span></td>
                      <td className="p-6 md:p-8 text-center"><button onClick={() => alert(`MESSAGE:\n\n${iq.message}`)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all shadow-md">VIEW</button></td>
                    </tr>
                  ))}

                  {/* DELETED BIN MAPPING */}
                  {activeTab === 'deleted' && filteredAndSortedItems.map(p => (
                    <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-6 md:p-8"><div className="flex items-center gap-4 opacity-50"><img src={p.image} className="w-12 h-12 rounded-xl object-cover grayscale" alt="" /><p className="font-bold dark:text-white uppercase">{p.name}</p></div></td>
                      <td className="p-6 md:p-8 text-center font-black dark:text-white opacity-50">₹{p.price.toLocaleString()}</td>
                      <td className="p-6 md:p-8 text-center"><span className="px-4 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase">Deleted</span></td>
                      <td className="p-6 md:p-8 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => handleRestore(p._id)} className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg">Restore</button>
                          <button onClick={() => handlePermanentDelete(p._id)} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl"><AlertTriangle size={20} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] w-full max-w-2xl relative border border-white/5 max-h-[90vh] overflow-y-auto">
            <button type="button" onClick={closeModal} className="absolute top-6 right-6 md:top-10 md:right-10 text-slate-400 hover:text-red-500 transition-colors"><X size={28} /></button>
            <h2 className="text-3xl md:text-4xl font-black mb-8 dark:text-white uppercase tracking-tighter italic leading-none">{editingProduct ? 'Update' : 'New'} <span className="text-emerald-500 not-italic">Asset</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <input required value={formData.name} placeholder="Model Name" className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none" onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <input required value={formData.brand} placeholder="Brand" className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none" onChange={e => setFormData({ ...formData, brand: e.target.value })} />
              <input required type="number" value={formData.price} placeholder="Price (₹)" className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none" onChange={e => setFormData({ ...formData, price: e.target.value })} />
              <input required type="number" value={formData.stock} placeholder="Stock Units" className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none" onChange={e => setFormData({ ...formData, stock: e.target.value })} />
              <select required value={formData.category} className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none" onChange={e => setFormData({ ...formData, category: e.target.value })}>
                <option value="">Category</option>
                {staticCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input required value={formData.image} placeholder="Image URL" className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none" onChange={e => setFormData({ ...formData, image: e.target.value })} />
              <textarea rows="3" value={formData.description} placeholder="Asset Description" className="md:col-span-2 w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none resize-none" onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <button className="w-full mt-8 md:mt-10 bg-emerald-600 text-white font-black py-6 rounded-2xl shadow-xl uppercase tracking-widest text-xs">Commit Entry</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;