'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Compass, Send } from 'lucide-react';
import { optimizeImage } from '@/lib/utils';
import { fadeUp, revealOnce } from './motion';

export default function NewsletterCta() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success("You're subscribed! Watch your inbox for travel tips.");
    setEmail('');
  };

  return (
    <section className="bg-white py-20 md:py-28 dark:bg-stone-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...revealOnce} variants={fadeUp} className="relative isolate overflow-hidden rounded-[2rem] bg-stone-900">
          <img
            src={optimizeImage('https://images.unsplash.com/photo-1524492412937-b28074a5d7da', 1600)}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-orange-900/50" />

          <div className="grid grid-cols-1 items-center gap-10 px-6 py-14 sm:px-12 md:py-20 lg:grid-cols-2 lg:px-16">
            <div className="text-white">
              <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
                Ready to explore <em className="italic text-orange-300">Incredible India?</em>
              </h2>
              <p className="mt-5 max-w-lg text-lg text-white/70">
                Discover hidden gems, build your itinerary and create memories that last a lifetime.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/places"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/30 transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
                >
                  <Compass className="h-5 w-5" />
                  Start exploring
                </Link>
                <Link
                  href="/states"
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Browse states
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-white">Get travel tips in your inbox</h3>
              <p className="mt-2 text-sm text-white/60">
                New destinations, seasonal guides and exclusive offers — once a month. No spam.
              </p>
              <form onSubmit={handleSubscribe} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="newsletter-email">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 flex-1 rounded-xl border border-white/15 bg-white/10 px-4 text-white placeholder:text-white/40 outline-none transition-colors focus:border-orange-400 focus:bg-white/15"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 font-semibold text-stone-900 transition-colors hover:bg-orange-50"
                >
                  <Send className="h-4 w-4" />
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
