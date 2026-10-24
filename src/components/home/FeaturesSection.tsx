'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, BedDouble, Headphones, ReceiptIndianRupee, ShieldCheck, Users } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { fadeUp, revealOnce, stagger } from './motion';

const features = [
  { icon: BedDouble, title: 'Handpicked hotels', desc: 'Every stay is chosen and checked by our team — see the exact hotels, photos and locations before you book.' },
  { icon: Users, title: 'Tour coordinator on every trip', desc: 'A dedicated coordinator travels with the group and handles check-ins, transfers and sightseeing for you.' },
  { icon: ReceiptIndianRupee, title: 'Clear, honest pricing', desc: 'Per-person prices for 2, 3 or 4 in a room with a full breakdown — no hidden charges added later.' },
  { icon: ShieldCheck, title: 'No payment to reserve', desc: 'Reserve your seats for free. We confirm within 24 hours and only then share payment details.' },
  { icon: BadgeCheck, title: 'Fixed departures, small groups', desc: 'Planned dates and limited seats per departure, so the trip stays comfortable and personal.' },
  { icon: Headphones, title: 'Support before & during the trip', desc: 'Questions about dates, rooms or a custom plan? Call, WhatsApp or raise a query — a real person replies.' },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-20 md:py-28 dark:bg-stone-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why choose us"
          title={<>Tours you can <em className="italic text-gradient-warm pr-1">trust</em></>}
          description="We plan, book and run every tour ourselves — so all you have to do is enjoy the journey."
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
