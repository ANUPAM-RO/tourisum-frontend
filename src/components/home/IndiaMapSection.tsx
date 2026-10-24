'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import type { ThreeEvent } from '@react-three/fiber';
import { ArrowRight, MapPin, MousePointer2, Star } from 'lucide-react';
import { useMapPlaces } from '@/lib/hooks';
import { cn, optimizeImage } from '@/lib/utils';
import type { MapPlace } from '@/types';
import SectionHeading from './SectionHeading';
import { EASE_OUT } from './motion';
import type { MapHover } from './india-map/IndiaMapCanvas';
import type { StatesGeoJSON } from './india-map/geo';
import { CATEGORY_COLORS } from './india-map/categoryColors';

const IndiaMapCanvas = dynamic(() => import('./india-map/IndiaMapCanvas'), {
  ssr: false,
  loading: () => <MapLoading />,
});

function MapLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-40 w-40 animate-pulse rounded-full bg-orange-500/10 blur-2xl" />
    </div>
  );
}

const placeCount = (n: number) => `${n} place${n === 1 ? '' : 's'}`;

const keyOf = (item: MapHover | null) =>
  !item ? '' : item.kind === 'state' ? `s:${item.slug}` : `p:${item.place._id}`;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export default function IndiaMapSection() {
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState<MapHover | null>(null);
  const [focused, setFocused] = useState<MapHover | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const { data: geo } = useQuery({
    queryKey: ['india-states-geo'],
    queryFn: async () => (await fetch('/data/india-states.json')).json() as Promise<StatesGeoJSON>,
    staleTime: Infinity,
  });
  const { data: places = [] } = useMapPlaces();

  // Only render frames while the section is on screen.
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    places.forEach((p) => p.category.forEach((c) => counts.set(c, (counts.get(c) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
  }, [places]);

  const filtered = useMemo(
    () => (category ? places.filter((p) => p.category.includes(category)) : places),
    [places, category]
  );
  const visiblePlaces = useMemo(() => new Set(filtered.map((p) => p._id)), [filtered]);
  const activeStates = useMemo(
    () => new Set(filtered.map((p) => p.state?.slug).filter((s): s is string => !!s)),
    [filtered]
  );
  const placesByState = useMemo(() => {
    const map = new Map<string, MapPlace[]>();
    filtered.forEach((p) => {
      if (!p.state) return;
      map.set(p.state.slug, [...(map.get(p.state.slug) ?? []), p]);
    });
    map.forEach((list) => list.sort((a, b) => b.rating - a.rating));
    return map;
  }, [filtered]);

  const moveTooltip = (e?: ThreeEvent<PointerEvent | MouseEvent>) => {
    if (!e || !tooltip.current || !container.current) return;
    const rect = container.current.getBoundingClientRect();
    tooltip.current.style.transform = `translate(${e.nativeEvent.clientX - rect.left + 16}px, ${e.nativeEvent.clientY - rect.top + 16}px)`;
  };

  const handleHover = useCallback((item: MapHover | null, e?: ThreeEvent<PointerEvent>) => {
    moveTooltip(e);
    setHovered((prev) => (keyOf(prev) === keyOf(item) ? prev : item));
    if (item) setFocused((prev) => (keyOf(prev) === keyOf(item) ? prev : item));
  }, []);

  const handleSelect = useCallback(
    (item: MapHover, e: ThreeEvent<MouseEvent>) => {
      // On touch screens the first tap shows details; a second tap opens the page.
      const isTouch = (e.nativeEvent as PointerEvent).pointerType === 'touch';
      if (isTouch && keyOf(focused) !== keyOf(item)) {
        setFocused(item);
        return;
      }
      if (item.kind === 'place') router.push(`/places/${item.place.slug}`);
      else if (activeStates.has(item.slug)) router.push(`/states/${item.slug}`);
    },
    [focused, activeStates, router]
  );

  const totalStates = useMemo(() => new Set(places.map((p) => p.state?.slug)).size, [places]);

  return (
    <section className="relative overflow-hidden bg-stone-950 py-20 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="dark"
          eyebrow="Interactive map"
          title={<>Explore India in <em className="italic text-orange-300">3D</em></>}
          description="Hover over a state or a glowing pin to discover places — click to dive in."
        />

        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {[null, ...categories].map((c) => (
              <button
                key={c ?? 'all'}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                  category === c
                    ? 'border-orange-400 bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'border-white/15 text-white/70 hover:border-orange-400/60 hover:text-white'
                )}
              >
                {c && (
                  <span
                    className="h-2.5 w-2.5 rounded-full ring-2 ring-white/20"
                    style={{ backgroundColor: CATEGORY_COLORS[c] }}
                  />
                )}
                {c ?? 'All places'}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div
            ref={container}
            className={cn(
              'relative h-[440px] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-stone-900/80 to-stone-950 sm:h-[560px] lg:h-[640px]',
              hovered && 'cursor-pointer'
            )}
          >
            {geo && places.length > 0 ? (
              <IndiaMapCanvas
                geo={geo}
                places={places}
                activeStates={activeStates}
                visiblePlaces={visiblePlaces}
                hovered={hovered}
                running={inView}
                reducedMotion={reducedMotion}
                onHover={handleHover}
                onSelect={handleSelect}
              />
            ) : (
              <MapLoading />
            )}

            {/* Cursor tooltip (positioned directly via ref to avoid re-rendering the scene) */}
            <div ref={tooltip} className="pointer-events-none absolute left-0 top-0 z-10">
              <AnimatePresence>
                {hovered && (
                  <motion.div
                    key={keyOf(hovered)}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.15 }}
                    className="rounded-xl border border-white/10 bg-stone-900/90 px-3 py-2 text-sm text-white shadow-xl backdrop-blur-md"
                  >
                    {hovered.kind === 'state' ? (
                      <>
                        <p className="font-semibold">{hovered.name}</p>
                        <p className="text-xs text-white/60">
                          {placeCount(placesByState.get(hovered.slug)?.length ?? 0)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">{hovered.place.name}</p>
                        <p className="text-xs text-white/60">{hovered.place.state?.name}</p>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-1.5 text-xs text-white/40">
              <MousePointer2 className="h-3.5 w-3.5" />
              Hover or tap to explore
            </p>
          </div>

          <InfoPanel
            focused={focused}
            places={filtered}
            placesByState={placesByState}
            totalStates={totalStates}
            category={category}
          />
        </div>
      </div>
    </section>
  );
}

function InfoPanel({
  focused,
  places,
  placesByState,
  totalStates,
  category,
}: {
  focused: MapHover | null;
  places: MapPlace[];
  placesByState: Map<string, MapPlace[]>;
  totalStates: number;
  category: string | null;
}) {
  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 text-white backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={keyOf(focused)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          {focused?.kind === 'place' ? (
            <PlaceDetails place={focused.place} />
          ) : focused?.kind === 'state' ? (
            <StateDetails name={focused.name} slug={focused.slug} places={placesByState.get(focused.slug) ?? []} />
          ) : (
            <Overview places={places} totalStates={totalStates} category={category} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PlaceDetails({ place }: { place: MapPlace }) {
  return (
    <div>
      {place.image && (
        <img
          src={optimizeImage(place.image, 500)}
          alt={place.name}
          className="mb-5 aspect-[4/3] w-full rounded-2xl object-cover"
        />
      )}
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">
        <MapPin className="h-3.5 w-3.5" />
        {place.state?.name}
      </p>
      <h3 className="mt-2 font-display text-2xl font-semibold">{place.name}</h3>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 text-sm text-amber-300">
          <Star className="h-4 w-4 fill-current" />
          {place.rating.toFixed(1)}
        </span>
        {place.category.slice(0, 3).map((c) => (
          <span key={c} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/75">
            {c}
          </span>
        ))}
      </div>
      <Link
        href={`/places/${place.slug}`}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-orange-500/25 transition-[filter] hover:brightness-110"
      >
        View place
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function StateDetails({ name, slug, places }: { name: string; slug: string; places: MapPlace[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">State</p>
      <h3 className="mt-2 font-display text-3xl font-semibold">{name}</h3>
      <p className="mt-1 text-sm text-white/60">
        {places.length ? `${placeCount(places.length)} to explore` : 'No places added yet'}
      </p>
      {places.length > 0 && (
        <>
          <ul className="mt-5 space-y-2">
            {places.slice(0, 5).map((p) => (
              <li key={p._id}>
                <Link
                  href={`/places/${p.slug}`}
                  className="group flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-white/5"
                >
                  {p.image && (
                    <img src={optimizeImage(p.image, 120)} alt="" className="h-11 w-11 rounded-lg object-cover" />
                  )}
                  <span className="min-w-0 flex-1 truncate text-sm font-medium group-hover:text-orange-300">{p.name}</span>
                  <span className="text-xs text-amber-300">★ {p.rating.toFixed(1)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/states/${slug}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-300 hover:text-orange-200"
          >
            Explore {name}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      )}
    </div>
  );
}

function Overview({ places, totalStates, category }: { places: MapPlace[]; totalStates: number; category: string | null }) {
  const top = [...places].sort((a, b) => b.rating - a.rating).slice(0, 4);
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="font-display text-3xl font-semibold text-orange-300">{places.length}</p>
          <p className="text-xs text-white/60">{category ? `${category} places` : 'Places on the map'}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="font-display text-3xl font-semibold text-orange-300">{totalStates}</p>
          <p className="text-xs text-white/60">States & UTs</p>
        </div>
      </div>
      <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-white/50">Top rated</h3>
      <ul className="mt-3 space-y-2">
        {top.map((p) => (
          <li key={p._id}>
            <Link href={`/places/${p.slug}`} className="group flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-white/5">
              {p.image && <img src={optimizeImage(p.image, 120)} alt="" className="h-11 w-11 rounded-lg object-cover" />}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium group-hover:text-orange-300">{p.name}</span>
                <span className="block text-xs text-white/50">{p.state?.name}</span>
              </span>
              <span className="text-xs text-amber-300">★ {p.rating.toFixed(1)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-white/50">Hover over the map to see what each state has to offer.</p>
    </div>
  );
}
