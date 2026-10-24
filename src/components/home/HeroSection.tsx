'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Clock, MapPin, MessageSquareText, ShieldCheck, Star } from 'lucide-react';
import { useBookTour } from '@/components/booking/BookTourProvider';
import { useAgency } from '@/lib/hooks';
import { optimizeImage } from '@/lib/utils';
import { EASE_OUT } from './motion';

// WebGL only runs in the browser, so the particle layer is loaded client-side after the hero renders.
const HeroParticles = dynamic(() => import('./HeroParticles'), { ssr: false });

const SLIDE_MS = 7000;

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523',
    tag: 'Heritage',
    place: 'Taj Mahal, Agra',
    title: (<>India&apos;s Best Tours, <em className="italic text-orange-300">Planned</em> for You</>),
    subtitle: 'Group tours and custom holidays across India — handpicked hotels, comfortable transport and a tour coordinator, all taken care of by us.',
  },
  {
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
    tag: 'Mountains',
    place: 'The Himalayas',
    title: (<>Himalayan Tours, <em className="italic text-orange-300">Done Right</em></>),
    subtitle: 'Kashmir, Ladakh, Sikkim and beyond — fixed departures with acclimatised itineraries, permits arranged and stays you can trust.',
  },
  {
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
    tag: 'Beaches',
    place: 'Goa',
    title: (<>Holidays Without the <em className="italic text-orange-300">Hassle</em></>),
    subtitle: 'You choose the dates and the rooms — we handle the bookings, transfers and every detail in between.',
  },
  {
    image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e',
    tag: 'Backwaters',
    place: 'Alleppey, Kerala',
    title: (<>Travel More, <em className="italic text-orange-300">Worry</em> Less</>),
    subtitle: 'Clear per-person prices, no payment to reserve and your seats confirmed within 24 hours.',
  },
];

const popularTours = [
  { label: 'Kashmir & Vaishno Devi', slug: 'kashmir-vaishno-devi-amritsar' },
  { label: 'Rajasthan Desert', slug: 'rajasthan-desert-safari-mount-abu' },
  { label: 'Kerala', slug: 'kerala-backwaters-and-hills' },
  { label: 'Ladakh', slug: 'ladakh-adventure-leh-nubra-pangong' },
  { label: 'Gujarat', slug: 'gujarat-rann-dwarka-somnath-gir' },
];

const trustPoints = [
  { icon: ShieldCheck, label: 'No payment to reserve' },
  { icon: Clock, label: 'Confirmed within 24 hours' },
  { icon: BadgeCheck, label: 'Handpicked hotels' },
];

const stats = [
  { value: '50K+', label: 'Happy travellers' },
  { value: '4.8★', label: 'Avg. rating' },
  { value: '500+', label: 'Destinations' },
  { value: '28', label: 'States covered' },
];

export default function HeroSection() {
  const agency = useAgency();
  const { openBooking } = useBookTour();
  const [current, setCurrent] = useState(0);
  const [showParticles, setShowParticles] = useState(false);

  // Restart the timer whenever the slide changes so manual navigation gets a full interval.
  // Skips ticks while the tab is hidden instead of piling up transitions in the background.
  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.hidden) setCurrent((c) => (c + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, [current]);

  // Skip the WebGL layer for users who prefer reduced motion.
  useEffect(() => {
    setShowParticles(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Warm the cache for the next slide so the crossfade never shows a half-loaded image.
  useEffect(() => {
    const next = new Image();
    next.src = optimizeImage(slides[(current + 1) % slides.length].image, 1920);
  }, [current]);

  const slide = slides[current];

  return (
    <section className="relative isolate flex min-h-[680px] h-[100svh] items-center overflow-hidden bg-stone-950">
      {/* Background */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <img
            src={optimizeImage(slide.image, 1920)}
            alt={slide.place}
            fetchPriority={current === 0 ? 'high' : 'auto'}
            decoding="async"
            className="h-full w-full object-cover animate-kenburns"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
      {showParticles && (
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <HeroParticles />
        </div>
      )}

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-36">
        <div className="max-w-3xl text-white">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium"
          >
            <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
            {agency.name} · Trusted tour &amp; travel company
          </motion.div>

          <div className="min-h-[9.5rem] sm:min-h-[11rem] md:min-h-[13rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              >
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-xl text-base sm:text-lg text-white/80 leading-relaxed">
                  {slide.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Calls to action */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/tours"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-orange-500/30 transition-[transform,filter] duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              Explore our tours
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              type="button"
              onClick={() => openBooking()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <MessageSquareText className="h-4 w-4" />
              Plan a custom trip
            </button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85"
          >
            {trustPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-emerald-300" />
                {label}
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 flex flex-wrap items-center gap-2 text-sm"
          >
            <span className="text-white/60">Popular tours:</span>
            {popularTours.map((t) => (
              <Link
                key={t.slug}
                href={`/tours/${t.slug}`}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/85 transition-colors hover:bg-white/15 hover:text-white"
              >
                {t.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom bar: stats + slide controls */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-4 pb-8 sm:px-6 lg:px-8">
          <dl className="hidden md:flex divide-x divide-white/15 rounded-2xl border border-white/15 bg-black/25 backdrop-blur-md">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-4">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-2xl font-semibold lining-nums text-white">{s.value}</dd>
                <dd className="text-xs uppercase tracking-wider text-white/55">{s.label}</dd>
              </div>
            ))}
          </dl>

          <div className="flex w-full flex-col gap-3 md:w-auto">
            <p className="flex items-center gap-1.5 text-sm text-white/70">
              <MapPin className="h-3.5 w-3.5" />
              {slide.place}
            </p>
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.tag}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Show ${s.tag}`}
                  aria-current={i === current}
                  className="group flex-1 md:w-24 md:flex-none text-left"
                >
                  <span className="block h-[3px] overflow-hidden rounded-full bg-white/25">
                    {i === current && (
                      <motion.span
                        key={current}
                        className="block h-full origin-left bg-white"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                      />
                    )}
                  </span>
                  <span
                    className={`mt-2 hidden text-xs font-medium transition-colors md:block ${
                      i === current ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                    }`}
                  >
                    {s.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
