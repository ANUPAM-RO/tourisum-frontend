'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import SafeImage from '@/components/shared/SafeImage';
import { useTestimonials } from '@/lib/hooks';
import SectionHeading from './SectionHeading';
import { fadeUp, revealOnce, stagger } from './motion';

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

/** Customer reviews, managed in Admin → Reviews. Hidden until at least one is published. */
export default function TestimonialsSection() {
  const { data: testimonials } = useTestimonials(8);

  if (!testimonials?.length) return null;

  return (
    <section className="relative isolate overflow-hidden bg-stone-950 py-20 md:py-28">
      <div className="pointer-events-none absolute -left-40 top-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-orange-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-rose-500/15 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="dark"
          eyebrow="Traveller stories"
          title={<>Loved by <em className="italic text-orange-300">our travellers</em></>}
          description="Real experiences from people who toured India with us."
        />

        <motion.div {...revealOnce} variants={stagger} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <motion.figure
              key={t._id}
              variants={fadeUp}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <Quote className="mb-4 h-7 w-7 text-orange-400/70" />
              <blockquote className="flex-1 leading-relaxed text-white/85">{t.text}</blockquote>
              <div className="mt-5 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
                ))}
              </div>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                {t.photo ? (
                  <SafeImage src={t.photo} width={96} alt={t.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-sm font-semibold text-white">
                    {initialsOf(t.name)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{t.name}</p>
                  {(t.trip || t.location) && (
                    <p className="truncate text-sm text-white/50">{[t.trip, t.location].filter(Boolean).join(' · ')}</p>
                  )}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
