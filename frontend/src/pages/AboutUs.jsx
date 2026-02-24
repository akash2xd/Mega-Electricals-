import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-20 px-6">
    <h1 className="text-4xl font-black mb-8">About Mega Electricals</h1>
    <div className="space-y-6 text-neutral-600 dark:text-neutral-400">
      <p className="text-lg">Founded on the principles of quality and reliability, Mega Electricals has been a trusted name in electrical supplies for years.</p>
      <p>We specialize in everything from industrial-grade Schneider Electric components to Goldmedal home automation. Our mission is to provide high-quality electrical solutions to every household and industry in India.</p>
      <div className="p-6 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <p className="font-bold text-neutral-900 dark:text-white">GSTIN: 19AJNPG1966F1ZZ</p>
        <p>Location: West Bengal, India</p>
      </div>
    </div>
  </motion.div>
);

export default AboutUs;
