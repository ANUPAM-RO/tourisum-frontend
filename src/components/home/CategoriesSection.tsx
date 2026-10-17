'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Building2, Church, Heart, Mountain, Tent, Trees, Users, Waves } from 'lucide-react';
import { useCategories } from '@/lib/hooks';
import SectionHeading from './SectionHeading';
import { fadeUp, revealOnce, stagger } from './motion';

const categoryConfig = [
  { name: 'Hill Station', icon: Mountain, tint: 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300', description: 'Cool mountain retreats' },
  { name: 'Beach', icon: Waves, tint: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-300', description: 'Sun-kissed shorelines' },
  { name: 'Heritage', icon: Building2, tint: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300', description: 'Forts & monuments' },
  { name: 'Wildlife', icon: Trees, tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300', description: 'Safaris & national parks' },
  { name: 'Religious', icon: Church, tint: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300', description: 'Spiritual journeys' },
  { name: 'Adventure', icon: Tent, tint: 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300', description: 'Treks, rafting & more' },
  { name: 'Honeymoon', icon: Heart, tint: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300', description: 'Romantic getaways' },
  { name: 'Family Trip', icon: Users, tint: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300', description: 'Fun for every age' },
];

export default function CategoriesSection() {
  const { data: categoriesData } = useCategories();

  const categories = categoryConfig.map((config) => ({
    ...config,
    count: categoriesData?.data?.find((c) => c.name === config.name)?.count ?? 0,
  }));

  return (
    <section className="bg-stone-50 py-20 md:py-28 dark:bg-stone-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Explore by interest"
          title={<>Find your kind of <em className="italic text-gradient-warm pr-1">journey</em></>}
          description="From misty hill stations to sacred ghats — pick a mood and we'll show you where to go."
        />

        <motion.div {...revealOnce} variants={stagger} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <motion.div key={category.name} variants={fadeUp}>
              <Link
                href={`/search?category=${encodeURIComponent(category.name)}`}
                className="lift group relative flex h-full flex-col rounded-2xl border border-stone-200/80 bg-white p-5 hover:shadow-lg hover:shadow-stone-200/60 sm:p-6 dark:border-stone-800 dark:bg-stone-900 dark:hover:shadow-black/30"
              >
                <span className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${category.tint}`}>
                  <category.icon className="h-6 w-6" />
                </span>
                <h3 className="font-semibold text-stone-900 dark:text-white">{category.name}</h3>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{category.description}</p>
                <p className="mt-4 text-xs font-medium text-stone-400">
                  {category.count > 0 ? `${category.count} places` : 'Explore'}
                </p>
                <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-stone-300 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-500" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
