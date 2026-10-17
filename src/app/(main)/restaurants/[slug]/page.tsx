'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  ChefHat,
  Clock,
  Globe,
  IndianRupee,
  Leaf,
  MapPin,
  Navigation,
  Phone,
  Star,
  UtensilsCrossed,
} from 'lucide-react';
import { InteractiveMap, MapMarker } from '@/components/map';
import { useRestaurantBySlug } from '@/lib/hooks';
import { cn, formatRating } from '@/lib/utils';
import EmptyState from '@/components/shared/EmptyState';
import {
  Breadcrumbs,
  ContactRow,
  DetailGallery,
  DetailSection,
  DetailSkeleton,
  FactsStrip,
  MobileActionBar,
  ShareButton,
  primaryCta,
  secondaryCta,
  type Fact,
} from '@/components/stays/DetailParts';
import { DietMarker, PriceLevel } from '@/components/stays/RestaurantCard';
import { EASE_OUT, dietLabel, directionsUrl, formatINR, uniqueCuisines } from '@/components/stays/utils';

/** Parses "9:00 AM", "21:30", "11 pm" into minutes after midnight. */
function toMinutes(time?: string) {
  if (!time) return null;
  const m = time.trim().match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const period = m[3]?.toLowerCase();
  if (period === 'pm' && h < 12) h += 12;
  if (period === 'am' && h === 12) h = 0;
  if (h > 24 || min > 59) return null;
  return h * 60 + min;
}

/** "Open now" pill — computed after mount so server and client markup always match. */
function OpenStatus({ opening, closing }: { opening?: string; closing?: string }) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const start = toMinutes(opening);
    const end = toMinutes(closing);
    if (start === null || end === null) return;
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    // Handles venues that close after midnight.
    setOpen(end > start ? mins >= start && mins < end : mins >= start || mins < end);
  }, [opening, closing]);

  if (open === null) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        open
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
          : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', open ? 'bg-emerald-500' : 'bg-stone-400')} />
      {open ? 'Open now' : 'Closed now'}
    </span>
  );
}

export default function RestaurantDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: restaurantResponse, isLoading } = useRestaurantBySlug(slug);
  const restaurant = restaurantResponse?.data;

  if (isLoading) return <DetailSkeleton />;

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 pt-32 dark:bg-stone-950">
        <div className="mx-auto max-w-xl">
          <EmptyState
            icon={UtensilsCrossed}
            title="Restaurant not found"
            description="This restaurant may have been removed or the link is incorrect."
            action={
              <Link href="/restaurants" className={`${primaryCta} h-11 text-sm`}>
                <ArrowLeft className="h-4 w-4" />
                Back to restaurants
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const cuisines = uniqueCuisines(restaurant.cuisine);

  const mapMarkers: MapMarker[] = [];
  if (restaurant.location?.latitude && restaurant.location?.longitude) {
    mapMarkers.push({
      id: restaurant._id,
      name: restaurant.name,
      lat: restaurant.location.latitude,
      lng: restaurant.location.longitude,
      type: 'restaurant',
      description: restaurant.address,
      extraInfo: {
        ...(cuisines.length > 0 && { Cuisine: cuisines.join(', ') }),
        ...(restaurant.averageCost && { 'Avg Cost': `₹${restaurant.averageCost}/person` }),
        ...(restaurant.rating && { Rating: `${restaurant.rating}/5` }),
      },
    });
  }

  const mapCenter: [number, number] =
    restaurant.location?.latitude && restaurant.location?.longitude
      ? [restaurant.location.latitude, restaurant.location.longitude]
      : [20.5937, 78.9629];

  const directions = directionsUrl(restaurant);
  const hours = [restaurant.openingTime, restaurant.closingTime].filter(Boolean).join(' – ');

  // No reservation system yet — reserve via phone first, then the restaurant's own site.
  const reserveAction = restaurant.phone
    ? { href: `tel:${restaurant.phone}`, label: 'Call to reserve', external: false }
    : restaurant.website
    ? { href: restaurant.website, label: 'Reserve online', external: true }
    : null;

  const facts: Fact[] = [
    { icon: Star, label: 'Rating', value: `${formatRating(restaurant.rating)} / 5` },
    ...(restaurant.averageCost ? [{ icon: IndianRupee, label: 'Average cost', value: `${formatINR(restaurant.averageCost)} for one` }] : []),
    ...(hours ? [{ icon: Clock, label: 'Hours', value: hours }] : []),
    ...(restaurant.vegNonVeg ? [{ icon: Leaf, label: 'Food type', value: dietLabel[restaurant.vegNonVeg] ?? restaurant.vegNonVeg }] : []),
  ];

  const contactRows = (
    <>
      {restaurant.phone && <ContactRow icon={Phone} label="Phone" value={restaurant.phone} href={`tel:${restaurant.phone}`} />}
      {restaurant.website && <ContactRow icon={Globe} label="Website" value="Visit website" href={restaurant.website} external />}
      {restaurant.distance && <ContactRow icon={MapPin} label="Distance" value={restaurant.distance} />}
    </>
  );
  const hasContact = !!(restaurant.phone || restaurant.website || restaurant.distance);

  return (
    <div className="min-h-screen bg-stone-50 pb-28 pt-16 dark:bg-stone-950 lg:pb-16 lg:pt-[68px]">
      {/* Title + gallery */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 md:pt-8 lg:px-8">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Restaurants', href: '/restaurants' }, { label: restaurant.name }]}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="mb-6 mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              {restaurant.vegNonVeg && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                    restaurant.vegNonVeg === 'veg'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : restaurant.vegNonVeg === 'non-veg'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                      : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200'
                  )}
                >
                  <DietMarker type={restaurant.vegNonVeg} />
                  {dietLabel[restaurant.vegNonVeg] ?? restaurant.vegNonVeg}
                </span>
              )}
              {cuisines.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300"
                >
                  {c}
                </span>
              ))}
            </div>
            <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-stone-900 dark:text-white md:text-5xl">
              {restaurant.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-600 dark:text-stone-400">
              <span className="flex items-center gap-1 font-semibold text-stone-900 dark:text-white">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {formatRating(restaurant.rating)}
              </span>
              <PriceLevel cost={restaurant.averageCost} />
              {restaurant.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
                  {restaurant.address}
                </span>
              )}
              <OpenStatus opening={restaurant.openingTime} closing={restaurant.closingTime} />
            </div>
          </div>
          <ShareButton title={restaurant.name} className="self-start md:self-auto" />
        </motion.div>

        <DetailGallery images={restaurant.images ?? []} alt={restaurant.name} />
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <FactsStrip facts={facts} />

            {restaurant.description && (
              <DetailSection eyebrow="Overview" title="About">
                <p className="whitespace-pre-line leading-relaxed text-stone-600 dark:text-stone-300">{restaurant.description}</p>
              </DetailSection>
            )}

            {cuisines.length > 0 && (
              <DetailSection eyebrow="On the menu" title="Cuisine">
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {cuisines.map((c) => (
                    <li
                      key={c}
                      className="flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-stone-50/60 p-3.5 dark:border-stone-800 dark:bg-stone-800/40"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm dark:bg-stone-900 dark:text-orange-400">
                        <ChefHat className="h-[18px] w-[18px]" />
                      </span>
                      <span className="text-sm font-medium text-stone-800 dark:text-stone-200">{c}</span>
                    </li>
                  ))}
                </ul>
              </DetailSection>
            )}

            {(restaurant.openingTime || restaurant.closingTime) && (
              <DetailSection eyebrow="Plan your visit" title="Timings">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {restaurant.openingTime && (
                    <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-800/40">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Opens</p>
                      <p className="text-lg font-semibold text-stone-900 dark:text-white">{restaurant.openingTime}</p>
                    </div>
                  )}
                  {restaurant.closingTime && (
                    <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-800/40">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Closes</p>
                      <p className="text-lg font-semibold text-stone-900 dark:text-white">{restaurant.closingTime}</p>
                    </div>
                  )}
                </div>
              </DetailSection>
            )}

            <DetailSection id="location" eyebrow="Getting there" title="Location">
              {restaurant.address && (
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-start gap-2 text-stone-600 dark:text-stone-300">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    {restaurant.address}
                  </p>
                  {directions && (
                    <a href={directions} target="_blank" rel="noopener noreferrer" className={`${secondaryCta} h-10 shrink-0 text-sm`}>
                      <Navigation className="h-4 w-4" />
                      Directions
                    </a>
                  )}
                </div>
              )}
              {mapMarkers.length > 0 ? (
                <div className="overflow-hidden rounded-2xl">
                  <InteractiveMap center={mapCenter} zoom={14} markers={mapMarkers} height="400px" showLegend={false} />
                </div>
              ) : (
                <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-2xl bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                  <MapPin className="h-6 w-6" />
                  <p className="text-sm">Map location not available</p>
                </div>
              )}
            </DetailSection>

            {hasContact && (
              <div className="rounded-3xl border border-stone-200/80 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 lg:hidden">
                <h3 className="mb-3 font-display text-xl font-semibold tracking-tight text-stone-900 dark:text-white">Contact</h3>
                <div className="space-y-1">{contactRows}</div>
              </div>
            )}
          </div>

          {/* Reservation summary */}
          <aside className="hidden lg:block">
            <div className="sticky top-[88px] rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xl shadow-stone-200/50 dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/30">
              {restaurant.averageCost > 0 && (
                <>
                  <p className="text-sm text-stone-500 dark:text-stone-400">Average cost</p>
                  <p className="mt-1 text-4xl font-bold tracking-tight text-stone-900 dark:text-white">
                    {formatINR(restaurant.averageCost)}
                    <span className="ml-1 text-base font-normal text-stone-500 dark:text-stone-400">for one</span>
                  </p>
                </>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {formatRating(restaurant.rating)}
                </span>
                <OpenStatus opening={restaurant.openingTime} closing={restaurant.closingTime} />
              </div>

              {hours && (
                <p className="mt-4 flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
                  <Clock className="h-4 w-4 text-stone-400" />
                  {hours}
                </p>
              )}

              <div className="mt-6 space-y-2.5">
                {reserveAction && (
                  <a
                    href={reserveAction.href}
                    {...(reserveAction.external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className={`${primaryCta} h-12 w-full text-base`}
                  >
                    <Calendar className="h-4 w-4" />
                    {reserveAction.label}
                  </a>
                )}
                {directions && (
                  <a href={directions} target="_blank" rel="noopener noreferrer" className={`${secondaryCta} h-12 w-full text-sm`}>
                    <Navigation className="h-4 w-4" />
                    Get directions
                  </a>
                )}
              </div>

              {hasContact && (
                <div className="mt-6 space-y-1 border-t border-stone-100 pt-5 dark:border-stone-800">{contactRows}</div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <MobileActionBar>
        <div className="min-w-0">
          {restaurant.averageCost > 0 ? (
            <p className="text-lg font-bold leading-tight text-stone-900 dark:text-white">
              {formatINR(restaurant.averageCost)}
              <span className="ml-1 text-sm font-normal text-stone-500 dark:text-stone-400">for one</span>
            </p>
          ) : (
            <p className="truncate text-sm font-semibold text-stone-900 dark:text-white">{restaurant.name}</p>
          )}
          <p className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {formatRating(restaurant.rating)}
            {hours && <span className="truncate">· {hours}</span>}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {directions && (
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get directions"
              className={`${secondaryCta} h-11 w-11 px-0`}
            >
              <Navigation className="h-4 w-4" />
            </a>
          )}
          {reserveAction && (
            <a
              href={reserveAction.href}
              {...(reserveAction.external && { target: '_blank', rel: 'noopener noreferrer' })}
              className={`${primaryCta} h-11 text-sm`}
            >
              Reserve
            </a>
          )}
        </div>
      </MobileActionBar>
    </div>
  );
}
