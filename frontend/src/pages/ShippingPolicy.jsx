import React from 'react';
import { motion } from 'framer-motion';

const ShippingPolicy = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-24 px-6 min-h-screen">
    <h1 className="text-4xl font-black mb-8 uppercase tracking-tight">Shipping & Delivery Policy</h1>
    <div className="space-y-8 text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <section>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Order Processing</h2>
        <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or public holidays.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Shipping Rates & Delivery Estimates</h2>
        <p>Shipping charges for your order will be calculated and displayed at checkout. Standard delivery typically takes 3-7 business days across India.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">Shipment Confirmation & Order Tracking</h2>
        <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s).</p>
      </section>
    </div>
  </motion.div>
);

export default ShippingPolicy;
