'use client';

import Link from 'next/link';
import { BedDouble, CheckCircle2, Clock, Gauge, MapPin, Mountain, Users, Utensils, XCircle, Backpack, Sparkles } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import SafeImage from '@/components/shared/SafeImage';
import EmptyState from '@/components/shared/EmptyState';
import { useTour } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { DIFFICULTY_STYLES, durationLabel, formatINR } from '@/lib/tours';
import BookingPanel from './BookingPanel';

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200/70 sm:p-8 dark:bg-stone-900 dark:ring-stone-800">
      <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function TourDetail({ slug }: { slug: string }) {
  const { data: tour, isLoading, isError } = useTour(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-16 dark:bg-stone-950">
        <div className="h-80 animate-pulse bg-stone-200 dark:bg-stone-800" />
      </div>
    );
  }
  if (isError || !tour) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 dark:bg-stone-950">
        <EmptyState icon={Mountain} title="Tour not found" description="This tour may have ended or been removed." action={<Link href="/tours" className="font-semibold text-orange-600">See all tours</Link>} />
      </div>
    );
  }

  const facts = [
    { icon: Clock, label: 'Duration', value: durationLabel(tour) },
    { icon: MapPin, label: 'Starts / ends', value: tour.startCity === tour.endCity ? tour.startCity : `${tour.startCity} → ${tour.endCity}` },
    { icon: Users, label: 'Group size', value: `Max ${tour.groupSize}` },
    { icon: Gauge, label: 'Difficulty', value: tour.difficulty },
  ].filter((f) => f.value);

  return (
    <div className="min-h-screen bg-stone-50 pb-24 lg:pb-0 dark:bg-stone-950">
      <PageHeader
        eyebrow={`${durationLabel(tour)} · Group tour`}
        title={tour.title}
        description={tour.tagline}
        image={tour.coverImage}
        size="lg"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Tours', href: '/tours' }, { label: tour.title }]}
      >
        <div className="flex flex-wrap gap-2">
          {facts.map(({ icon: Icon, label, value }) => (
            <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm text-white backdrop-blur">
              <Icon className="h-4 w-4 text-orange-300" />
              <span className="text-white/60">{label}:</span> {value}
            </span>
          ))}
        </div>
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="space-y-6 lg:col-span-8">
          <Section title="Overview">
            <p className="text-lg leading-relaxed text-stone-600 dark:text-stone-300">{tour.description}</p>
            {tour.highlights.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 rounded-xl bg-orange-50/70 p-3.5 text-sm text-stone-700 dark:bg-orange-950/20 dark:text-stone-300">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {tour.itinerary.length > 0 && (
            <Section id="itinerary" title="Day-by-day itinerary">
              <ol className="relative space-y-6 border-l-2 border-dashed border-orange-200 pl-8 dark:border-orange-900/60">
                {tour.itinerary.map((d) => (
                  <li key={d.day} className="relative">
                    <span className="absolute -left-[3.05rem] flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-sm font-bold text-white shadow-md shadow-orange-500/25">
                      {d.day}
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600 dark:text-orange-400">Day {d.day}</p>
                    <h3 className="mt-1 text-lg font-semibold text-stone-900 dark:text-white">{d.title}</h3>
                    {d.description && <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-400">{d.description}</p>}
                    {(d.meals.length > 0 || d.stay) && (
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        {d.meals.length > 0 && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                            <Utensils className="h-3.5 w-3.5 text-orange-500" />
                            {d.meals.join(' · ')}
                          </span>
                        )}
                        {d.stay && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                            <BedDouble className="h-3.5 w-3.5 text-orange-500" />
                            {d.stay}
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {tour.places.length > 0 && (
            <Section title="Places you'll visit">
              <div className="grid gap-4 sm:grid-cols-2">
                {tour.places.map((p) => (
                  <Link key={p._id} href={`/places/${p.slug}`} className="group flex items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/60">
                    <SafeImage src={p.images?.[0]} width={250} alt={p.name} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-stone-900 group-hover:text-orange-600 dark:text-white">{p.name}</p>
                      <p className="text-sm text-stone-500 dark:text-stone-400">{p.state?.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Section>
          )}

          {(tour.inclusions.length > 0 || tour.exclusions.length > 0) && (
            <Section title="What's included">
              <div className="grid gap-8 sm:grid-cols-2">
                <ul className="space-y-2.5">
                  {tour.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-stone-700 dark:text-stone-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2.5">
                  {tour.exclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-stone-500 dark:text-stone-400">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Section>
          )}

          {tour.thingsToCarry.length > 0 && (
            <Section title="Things to carry">
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {tour.thingsToCarry.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-stone-700 dark:text-stone-300">
                    <Backpack className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {tour.gallery.length > 1 && (
            <Section title="Gallery">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {tour.gallery.map((src, i) => (
                  <SafeImage key={src + i} src={src} width={500} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                ))}
              </div>
            </Section>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="space-y-4 lg:sticky lg:top-24">
            <BookingPanel tour={tour} />
            <p className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', DIFFICULTY_STYLES[tour.difficulty])}>
              {tour.difficulty} difficulty
            </p>
          </div>
        </aside>
      </div>

      {/* Mobile booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden dark:border-stone-800 dark:bg-stone-950/95">
        <div>
          <p className="text-xs text-stone-500">From, per person</p>
          <p className="text-lg font-bold text-stone-900 dark:text-white">{formatINR(tour.price)}</p>
        </div>
        <a href="#book" className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/25">
          Book now
        </a>
      </div>
    </div>
  );
}
