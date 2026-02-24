import React from 'react';
import { motion } from 'framer-motion';

const TermsAndConditions = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-20 px-6">
    <h1 className="text-4xl font-black mb-8">Terms & Conditions</h1>
    <div className="space-y-6 text-neutral-600 dark:text-neutral-400">
      <p>By using our website, you agree to comply with and be bound by the following terms and conditions.</p>
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Product Information</h2>
      <p>While we strive for accuracy, we do not warrant that product descriptions or other content are error-free. Prices are subject to change without notice.</p>
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Governing Law</h2>
      <p>These terms are governed by the laws of India, and any disputes will be subject to the exclusive jurisdiction of the courts in West Bengal.</p>
    </div>
  </motion.div>
);

export default TermsAndConditions;
