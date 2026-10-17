'use client';

import { motion } from 'framer-motion';
import { Star, Wallet } from 'lucide-react';
import { optimizeImage } from '@/lib/utils';
import SectionHeading from './SectionHeading';
import { EASE_OUT, revealOnce } from './motion';

const plans = [
  { label: 'Budget', price: '₹2,500', share: 21, items: 'Hostel ₹800 · Food ₹500 · Travel ₹400 · Tickets ₹300', bar: 'bg-emerald-500' },
  { label: 'Standard', price: '₹4,500', share: 38, items: 'Hotel ₹2,000 · Food ₹1,000 · Travel ₹800 · Tickets ₹500', bar: 'bg-orange-500' },
  { label: 'Luxury', price: '₹12,000', share: 100, items: 'Resort ₹8,000 · Dining ₹2,500 · Cab ₹2,000 · Tickets ₹1,000', bar: 'bg-rose-500' },
];

export default function BudgetSection() {
  return (
    <section className="overflow-hidden bg-white py-20 md:py-28 dark:bg-stone-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeading
            align="left"
            className="mb-8 md:mb-10"
            eyebrow="Budget planning"
            title={<>Know the cost <em className="italic text-gradient-warm pr-1">before</em> you go</>}
            description="Transparent per-day estimates for every travel style, so there are no surprises on the road."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
            className="space-y-3"
          >
            {plans.map((plan) => (
              <div key={plan.label} className="rounded-2xl border border-stone-200 p-5 dark:border-stone-800">
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="font-semibold text-stone-900 dark:text-white">{plan.label}</span>
                  <span className="text-lg font-bold text-stone-900 dark:text-white">
                    {plan.price}
                    <span className="text-sm font-normal text-stone-500"> / day</span>
                  </span>
                </div>
                <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                  <motion.div
                    className={`h-full origin-left rounded-full ${plan.bar}`}
                    style={{ width: `${plan.share}%` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2, ease: EASE_OUT }}
                  />
                </div>
                <p className="text-sm text-stone-500 dark:text-stone-400">{plan.items}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div {...revealOnce} variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_OUT } } }} className="relative">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-stone-300/50 dark:shadow-black/40">
            <img
              src={optimizeImage('https://images.unsplash.com/photo-1477587458883-47145ed94245', 900)}
              alt="Hawa Mahal, Jaipur"
              loading="lazy"
              decoding="async"
              className="h-[460px] w-full object-cover sm:h-[520px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/95 p-5 shadow-xl sm:inset-x-6 sm:bottom-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500">
                  <Wallet className="h-5 w-5 text-white" />
                </span>
                <div>
                  <p className="font-semibold text-stone-900">Jaipur weekend</p>
                  <p className="text-sm text-stone-500">3 days · Rajasthan</p>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-stone-200 text-center">
                {[
                  ['Budget', '₹7,500', 'text-emerald-600'],
                  ['Standard', '₹13,500', 'text-orange-600'],
                  ['Luxury', '₹36,000', 'text-rose-600'],
                ].map(([label, value, color]) => (
                  <div key={label}>
                    <p className="text-xs text-stone-500">{label}</p>
                    <p className={`font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="animate-float absolute -right-3 -top-5 rounded-2xl bg-white px-4 py-3 shadow-xl sm:-right-6 dark:bg-stone-800">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-900 dark:text-white">4.9</span>
              <span className="text-sm text-stone-500 dark:text-stone-400">12.5K reviews</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
