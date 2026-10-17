'use client';

import { motion } from 'framer-motion';
import { Calendar, Camera, MapPin, Shield, Star, Wallet } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { fadeUp, revealOnce, stagger } from './motion';

const features = [
  { icon: MapPin, title: 'Detailed guides', desc: 'History, timings, entry fees and how to get there — everything about a place on one page.' },
  { icon: Calendar, title: 'Day-wise itineraries', desc: 'Morning, afternoon and evening plans so you spend time exploring, not planning.' },
  { icon: Wallet, title: 'Cost estimates', desc: 'Budget, standard and luxury breakdowns for hotels, food, travel and tickets.' },
  { icon: Star, title: 'Honest reviews', desc: 'Ratings and stories from real travellers to help you choose with confidence.' },
  { icon: Shield, title: 'Safety first', desc: 'Emergency numbers, local tips and safety guidance for every destination.' },
  { icon: Camera, title: 'Photos & videos', desc: 'See a place before you go with curated galleries and travel videos.' },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-20 md:py-28 dark:bg-stone-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why travel with us"
          title={<>Plan your trip, <em className="italic text-gradient-warm pr-1">effortlessly</em></>}
          description="Everything you need for the perfect Indian holiday, all in one place."
        />

        <motion.div
          {...revealOnce}
          variants={stagger}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-3 dark:border-stone-800 dark:bg-stone-800"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className="group bg-white p-8 transition-colors duration-300 hover:bg-orange-50/50 dark:bg-stone-950 dark:hover:bg-stone-900"
            >
              <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-6 w-6" />
              </span>
              <h3 className="mb-2 text-lg font-semibold text-stone-900 dark:text-white">{feature.title}</h3>
              <p className="leading-relaxed text-stone-600 dark:text-stone-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
