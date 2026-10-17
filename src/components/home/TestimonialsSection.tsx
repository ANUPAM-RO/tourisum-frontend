'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { fadeUp, revealOnce, stagger } from './motion';

const testimonials = [
  { name: 'Rahul Sharma', role: 'Travel enthusiast', location: 'Delhi', initials: 'RS', rating: 5, text: 'Found the best hidden gems in Rajasthan. The itineraries were spot on and saved us hours of planning.' },
  { name: 'Priya Patel', role: 'Photographer', location: 'Mumbai', initials: 'PP', rating: 5, text: 'The detailed info on each place made my photography trip so much easier — the best-time-to-visit tips were accurate.' },
  { name: 'Amit Kumar', role: 'Family traveller', location: 'Bengaluru', initials: 'AK', rating: 5, text: 'The budget estimates helped us plan our Kerala vacation perfectly. Highly recommend for families!' },
  { name: 'Sneha Singh', role: 'Solo traveller', location: 'Pune', initials: 'SS', rating: 4, text: 'As a solo female traveller, the safety tips and emergency contacts were invaluable on my Himalayan trip.' },
];

export default function TestimonialsSection() {
  return (
    <section className="relative isolate overflow-hidden bg-stone-950 py-20 md:py-28">
      <div className="pointer-events-none absolute -left-40 top-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-orange-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-rose-500/15 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="dark"
          eyebrow="Traveller stories"
          title={<>Loved by <em className="italic text-orange-300">50,000+</em> travellers</>}
          description="Real experiences from people who explored India with us."
        />

        <motion.div {...revealOnce} variants={stagger} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <motion.figure
              key={t.name}
              variants={fadeUp}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <Quote className="mb-4 h-7 w-7 text-orange-400/70" />
              <blockquote className="flex-1 leading-relaxed text-white/85">{t.text}</blockquote>
              <div className="mt-5 flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
                ))}
              </div>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-sm font-semibold text-white">
                  {t.initials}
                </span>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-white/50">{t.role} · {t.location}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
