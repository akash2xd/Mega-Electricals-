import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-20 px-6">
    <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
    <div className="space-y-6 text-neutral-600 dark:text-neutral-400">
      <p>Mega Electricals ("we", "our", "us") is committed to protecting your privacy. This policy explains how we collect, use, and disclose your personal information.</p>
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Information We Collect</h2>
      <p>We collect information such as your name, email address, phone number, and shipping address when you make a purchase or create an account.</p>
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Payment Security</h2>
      <p>We do not store your credit/debit card information. All payments are processed securely through Razorpay.</p>
    </div>
  </motion.div>
);

export default PrivacyPolicy;
