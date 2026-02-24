import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Provider
import { CartProvider } from './context/CartContext';

// Component Imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Brands from './components/Brands';
import Deals from './components/Deals';
import Categories from './components/Categories';
import Featured from './components/Featured';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Contact from './components/Contact';
import Store from './components/Store';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import BulkInquiry from './components/BulkInquiry';
import AdminPanel from './components/AdminPanel';
import MyOrders from './components/MyOrders';

// --- NEW POLICY IMPORTS ---
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import TestimonialsPage from './pages/TestimonialsPage';
import ShippingPolicy from './pages/ShippingPolicy'; // Added for Razorpay compliance

const PageLayout = ({ children, darkMode, setDarkMode }) => (
  <>
    <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
    {children}
    <Footer />
  </>
);

const Home = () => (
  <>
    <Hero />
    <Brands />
    <main className="pb-20">
      <Deals />
      <Categories />
      <Featured />
      <Testimonials />
    </main>
  </>
);

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300 antialiased pt-[80px] lg:pt-[140px]">
          <Routes>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/login" element={<Auth />} />

            <Route path="/" element={<PageLayout darkMode={darkMode} setDarkMode={setDarkMode}><Home /></PageLayout>} />
            <Route path="/store" element={<PageLayout darkMode={darkMode} setDarkMode={setDarkMode}><Store /></PageLayout>} />
            <Route path="/product/:id" element={<PageLayout darkMode={darkMode} setDarkMode={setDarkMode}><ProductDetails /></PageLayout>} />
            <Route path="/cart" element={<PageLayout darkMode={darkMode} setDarkMode={setDarkMode}><Cart /></PageLayout>} />
            <Route path="/my-orders" element={<PageLayout darkMode={darkMode} setDarkMode={setDarkMode}><MyOrders /></PageLayout>} />
            <Route path="/categories" element={<PageLayout darkMode={darkMode} setDarkMode={setDarkMode}><Categories /></PageLayout>} />
            <Route path="/bulk-inquiry" element={<PageLayout darkMode={darkMode} setDarkMode={setDarkMode}><BulkInquiry /></PageLayout>} />
            <Route path="/contact" element={<PageLayout darkMode={darkMode} setDarkMode={setDarkMode}><Contact /></PageLayout>} />

            {/* --- POLICY ROUTES --- */}
            <Route path="/about" element={<PageLayout darkMode={darkMode} setDarkMode={setDarkMode}><AboutUs /></PageLayout>} />
            <Route path="/testimonials" element={<PageLayout darkMode={darkMode} setDarkMode={setDarkMode}><TestimonialsPage /></PageLayout>} />
            <Route path="/privacy-policy" element={<PageLayout darkMode={darkMode} setDarkMode={setDarkMode}><PrivacyPolicy /></PageLayout>} />
            <Route path="/return-policy" element={<PageLayout darkMode={darkMode} setDarkMode={setDarkMode}><ReturnPolicy /></PageLayout>} />
            <Route path="/shipping-policy" element={<PageLayout darkMode={darkMode} setDarkMode={setDarkMode}><ShippingPolicy /></PageLayout>} />
            <Route path="/terms" element={<PageLayout darkMode={darkMode} setDarkMode={setDarkMode}><TermsAndConditions /></PageLayout>} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;