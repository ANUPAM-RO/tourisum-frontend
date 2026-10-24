'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Search, Sparkles } from 'lucide-react';
import FancySelect from '@/components/shared/FancySelect';
import { useStates } from '@/lib/hooks';
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
    title: (<>Discover <em className="italic text-orange-300">Incredible</em> India</>),
    subtitle: 'Palaces, peaks, backwaters and beaches — 500+ destinations across 28 states, curated for you.',
  },
  {
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
    tag: 'Mountains',
    place: 'The Himalayas',
    title: (<>Where the <em className="italic text-orange-300">Himalayas</em> Begin</>),
    subtitle: 'Snow-capped trails, monasteries and quiet valleys waiting at the roof of the world.',
  },
  {
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
    tag: 'Beaches',
    place: 'Goa',
    title: (<>Sun, Sand & <em className="italic text-orange-300">Slow</em> Days</>),
    subtitle: 'Golden shores, Portuguese lanes and sunsets that make you forget the time.',
  },
  {
    image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e',
    tag: 'Backwaters',
    place: 'Alleppey, Kerala',
    title: (<>Drift Through <em className="italic text-orange-300">God&apos;s Own</em> Country</>),
    subtitle: 'Houseboats, coconut groves and the calm green waters of Kerala.',
  },
];

const quickSearches = ['Goa', 'Jaipur', 'Manali', 'Varanasi', 'Munnar'];

const stats = [
  { value: '500+', label: 'Destinations' },
  { value: '28', label: 'States' },
  { value: '50K+', label: 'Travelers' },
  { value: '4.8★', label: 'Avg. rating' },
];

export default function HeroSection() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [query, setQuery] = useState('');
  const [state, setState] = useState('');
  const { data: statesData } = useStates({ limit: 50 });
  const [showParticles, setShowParticles] = useState(false);
  const states = statesData?.data ?? [];

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (state) params.set('state', state);
    router.push(params.toString() ? `/search?${params}` : '/search');
  };

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
            <Sparkles className="h-4 w-4 text-amber-300" />
            Your guide to every corner of India
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

          {/* Search */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
            className="mt-8 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/30 sm:flex-row sm:items-center sm:gap-0"
          >
            <label className="flex flex-1 items-center gap-3 px-4 py-2.5">
              <Search className="h-5 w-5 shrink-0 text-orange-500" />
              <span className="sr-only">Destination</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Where do you want to go?"
                className="w-full bg-transparent text-[15px] text-stone-900 placeholder:text-stone-400 outline-none"
              />
            </label>
            <div className="hidden h-8 w-px bg-stone-200 sm:block" />
            <FancySelect
              label="State"
              icon={MapPin}
              value={state}
              onChange={setState}
              options={[{ value: '', label: 'All states' }, ...states.map((s) => ({ value: s.name, label: s.name }))]}
              className="sm:w-56"
              triggerClassName="h-12 rounded-xl border-transparent bg-transparent px-4 text-[15px] font-normal ring-0 hover:border-transparent sm:rounded-none [&>svg:first-child]:h-5 [&>svg:first-child]:w-5"
              panelClassName="text-left"
            />
            <button
              type="submit"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-7 font-semibold text-white shadow-lg shadow-orange-500/30 transition-[transform,filter] duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              <Search className="h-4 w-4" />
              Explore
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 flex flex-wrap items-center gap-2 text-sm"
          >
            <span className="text-white/60">Popular:</span>
            {quickSearches.map((q) => (
              <Link
                key={q}
                href={`/search?q=${encodeURIComponent(q)}`}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/85 transition-colors hover:bg-white/15 hover:text-white"
              >
                {q}
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
