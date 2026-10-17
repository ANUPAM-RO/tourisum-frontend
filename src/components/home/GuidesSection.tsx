'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import SafeImage from '@/components/shared/SafeImage';
import SectionHeading from './SectionHeading';
import { fadeUp, revealOnce, stagger } from './motion';

const guides = [
  { title: 'The complete guide to visiting the Taj Mahal', category: 'Heritage', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523', readTime: '8 min read', author: 'Rahul Sharma' },
  { title: 'Goa beyond the crowds: 10 quieter beaches', category: 'Beach', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2', readTime: '6 min read', author: 'Priya Patel' },
  { title: 'Kerala backwaters: a slow travel itinerary', category: 'Nature', image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3', readTime: '10 min read', author: 'Amit Kumar' },
];

export default function GuidesSection() {
  return (
    <section className="bg-stone-50 py-20 md:py-28 dark:bg-stone-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Travel journal"
          title={<>Stories to <em className="italic text-gradient-warm pr-1">inspire</em> your next trip</>}
        />

        <motion.div {...revealOnce} variants={stagger} className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {guides.map((guide) => (
            <motion.article key={guide.title} variants={fadeUp} className="group">
              <div className="relative mb-5 aspect-[16/11] overflow-hidden rounded-2xl bg-stone-200 dark:bg-stone-800">
                <SafeImage
                  src={guide.image}
                  width={640}
                  alt={guide.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-stone-800 shadow-sm">
                  {guide.category}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold leading-snug text-stone-900 transition-colors group-hover:text-orange-600 dark:text-white">
                {guide.title}
              </h3>
              <div className="mt-3 flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-[10px] font-bold text-white">
                  {guide.author.charAt(0)}
                </span>
                {guide.author}
                <span className="text-stone-300 dark:text-stone-600">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {guide.readTime}
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
