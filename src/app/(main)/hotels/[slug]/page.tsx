'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BedDouble,
  CheckCircle2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Sparkles,
  Star,
  Wallet,
} from 'lucide-react';
import { InteractiveMap, MapMarker } from '@/components/map';
import { useHotelBySlug } from '@/lib/hooks';
import type { Hotel } from '@/types';
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
import { EASE_OUT, amenityIcon, directionsUrl, formatINR } from '@/components/stays/utils';

export default function HotelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: hotelResponse, isLoading } = useHotelBySlug(slug);
  const hotel = hotelResponse?.data;

  if (isLoading) return <DetailSkeleton />;

  if (!hotel) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 pt-32 dark:bg-stone-950">
        <div className="mx-auto max-w-xl">
          <EmptyState
            icon={BedDouble}
            title="Hotel not found"
            description="This stay may have been removed or the link is incorrect."
            action={
              <Link href="/hotels" className={`${primaryCta} h-11 text-sm`}>
                <ArrowLeft className="h-4 w-4" />
                Back to hotels
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const email = (hotel as Hotel & { email?: string }).email;

  const mapMarkers: MapMarker[] = [];
  if (hotel.location?.latitude && hotel.location?.longitude) {
    mapMarkers.push({
      id: hotel._id,
      name: hotel.name,
      lat: hotel.location.latitude,
      lng: hotel.location.longitude,
      type: 'hotel',
      description: hotel.address,
      extraInfo: {
        ...(hotel.starRating && { Stars: `${hotel.starRating}★` }),
        ...(hotel.pricePerNight && { 'Price/Night': `₹${hotel.pricePerNight}` }),
      },
    });
  }

  const mapCenter: [number, number] =
    hotel.location?.latitude && hotel.location?.longitude
      ? [hotel.location.latitude, hotel.location.longitude]
      : [20.5937, 78.9629];

  const directions = directionsUrl(hotel);

  // There is no booking engine yet, so "Book" routes to the most direct real channel.
  const bookAction = hotel.website
    ? { href: hotel.website, label: 'Book on hotel website', external: true, icon: ExternalLink }
    : hotel.phone
    ? { href: `tel:${hotel.phone}`, label: 'Call to book', external: false, icon: Phone }
    : null;

  const facts: Fact[] = [
    ...(hotel.starRating ? [{ icon: Star, label: 'Hotel class', value: `${hotel.starRating}-star` }] : []),
    { icon: Wallet, label: 'Price per night', value: `From ${formatINR(hotel.pricePerNight)}` },
    ...(hotel.distance ? [{ icon: Navigation, label: 'Distance', value: hotel.distance }] : []),
    ...(hotel.amenities?.length ? [{ icon: Sparkles, label: 'Amenities', value: `${hotel.amenities.length} included` }] : []),
  ];

  const BookIcon = bookAction?.icon;

  return (
    <div className="min-h-screen bg-stone-50 pb-28 pt-16 dark:bg-stone-950 lg:pb-16 lg:pt-[68px]">
      {/* Title + gallery */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 md:pt-8 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Hotels', href: '/hotels' }, { label: hotel.name }]} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="mb-6 mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="min-w-0">
            {hotel.category?.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {hotel.category.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-stone-900 dark:text-white md:text-5xl">
              {hotel.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-600 dark:text-stone-400">
              {hotel.starRating > 0 && (
                <span className="flex items-center gap-0.5" aria-label={`${hotel.starRating} star hotel`}>
                  {Array.from({ length: hotel.starRating }, (_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </span>
              )}
              {hotel.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
                  {hotel.address}
                </span>
              )}
            </div>
          </div>
          <ShareButton title={hotel.name} className="self-start md:self-auto" />
        </motion.div>

        <DetailGallery images={hotel.images ?? []} alt={hotel.name} />
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <FactsStrip facts={facts} />

            {hotel.description && (
              <DetailSection eyebrow="Overview" title="About this hotel">
                <p className="whitespace-pre-line leading-relaxed text-stone-600 dark:text-stone-300">{hotel.description}</p>
              </DetailSection>
            )}

            {hotel.amenities && hotel.amenities.length > 0 && (
              <DetailSection eyebrow="What's included" title="Amenities">
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {hotel.amenities.map((amenity) => {
                    const Icon = amenityIcon(amenity);
                    return (
                      <li
                        key={amenity}
                        className="flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-stone-50/60 p-3.5 dark:border-stone-800 dark:bg-stone-800/40"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm dark:bg-stone-900 dark:text-orange-400">
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="text-sm font-medium text-stone-800 dark:text-stone-200">{amenity}</span>
                      </li>
                    );
                  })}
                </ul>
              </DetailSection>
            )}

            <DetailSection id="location" eyebrow="Getting there" title="Location">
              {hotel.address && (
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-start gap-2 text-stone-600 dark:text-stone-300">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    {hotel.address}
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
          </div>

          {/* Booking summary */}
          <aside className="hidden lg:block">
            <div className="sticky top-[88px] space-y-4">
              <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xl shadow-stone-200/50 dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/30">
                <p className="text-sm text-stone-500 dark:text-stone-400">Starting from</p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-stone-900 dark:text-white">
                  {formatINR(hotel.pricePerNight)}
                  <span className="ml-1 text-base font-normal text-stone-500 dark:text-stone-400">/ night</span>
                </p>
                {hotel.starRating > 0 && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-stone-600 dark:text-stone-300">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {hotel.starRating}-star property
                  </p>
                )}

                <div className="mt-6 space-y-2.5">
                  {bookAction && BookIcon && (
                    <a
                      href={bookAction.href}
                      {...(bookAction.external && { target: '_blank', rel: 'noopener noreferrer' })}
                      className={`${primaryCta} h-12 w-full text-base`}
                    >
                      {bookAction.label}
                      <BookIcon className="h-4 w-4" />
                    </a>
                  )}
                  {directions && (
                    <a href={directions} target="_blank" rel="noopener noreferrer" className={`${secondaryCta} h-12 w-full text-sm`}>
                      <Navigation className="h-4 w-4" />
                      Get directions
                    </a>
                  )}
                </div>

                {hotel.amenities?.length > 0 && (
                  <ul className="mt-6 space-y-2 border-t border-stone-100 pt-5 dark:border-stone-800">
                    {hotel.amenities.slice(0, 4).map((a) => (
                      <li key={a} className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {(hotel.phone || email || hotel.website) && (
                <div className="rounded-3xl border border-stone-200/80 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
                  <h3 className="mb-2 text-sm font-semibold text-stone-900 dark:text-white">Contact the hotel</h3>
                  <div className="space-y-1">
                    {hotel.phone && <ContactRow icon={Phone} label="Phone" value={hotel.phone} href={`tel:${hotel.phone}`} />}
                    {email && <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} />}
                    {hotel.website && (
                      <ContactRow icon={Globe} label="Website" value="Visit website" href={hotel.website} external />
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Contact for small screens (sidebar is desktop-only) */}
          {(hotel.phone || email || hotel.website) && (
            <div className="rounded-3xl border border-stone-200/80 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 lg:hidden">
              <h3 className="mb-3 font-display text-xl font-semibold tracking-tight text-stone-900 dark:text-white">Contact the hotel</h3>
              <div className="space-y-1">
                {hotel.phone && <ContactRow icon={Phone} label="Phone" value={hotel.phone} href={`tel:${hotel.phone}`} />}
                {email && <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} />}
                {hotel.website && <ContactRow icon={Globe} label="Website" value="Visit website" href={hotel.website} external />}
              </div>
            </div>
          )}
        </div>
      </section>

      <MobileActionBar>
        <div className="min-w-0">
          <p className="text-lg font-bold leading-tight text-stone-900 dark:text-white">
            {formatINR(hotel.pricePerNight)}
            <span className="ml-1 text-sm font-normal text-stone-500 dark:text-stone-400">/ night</span>
          </p>
          {hotel.starRating > 0 && (
            <p className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {hotel.starRating}-star
            </p>
          )}
        </div>
        {bookAction ? (
          <a
            href={bookAction.href}
            {...(bookAction.external && { target: '_blank', rel: 'noopener noreferrer' })}
            className={`${primaryCta} h-11 shrink-0 text-sm`}
          >
            {bookAction.external ? 'Book now' : 'Call to book'}
          </a>
        ) : (
          directions && (
            <a href={directions} target="_blank" rel="noopener noreferrer" className={`${primaryCta} h-11 shrink-0 text-sm`}>
              <Navigation className="h-4 w-4" />
              Directions
            </a>
          )
        )}
      </MobileActionBar>
    </div>
  );
}
