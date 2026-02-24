import React from 'react';
import { motion } from 'framer-motion';

const ReturnPolicy = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-20 px-6">
    <h1 className="text-4xl font-black mb-8">Return & Refund Policy</h1>
    <div className="space-y-6 text-neutral-600 dark:text-neutral-400 leading-relaxed">
      <section>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">1. Returns</h2>
        <p>We offer a 7-day return policy for most items. To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">2. Refunds</h2>
        <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">3. Shipping Returns</h2>
        <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.</p>
      </section>
    </div>
  </motion.div>
);

export default ReturnPolicy;
