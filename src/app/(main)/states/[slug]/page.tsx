'use client';

import React, { use } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Compass,
  Landmark,
  Languages,
  Map as MapIcon,
  MapPin,
  RefreshCw,
  Thermometer,
} from 'lucide-react';
import { InteractiveMap, MapMarker } from '@/components/map';
import { createCityMarkers, createPlaceMarkers } from '@/lib/mapHelpers';
import { useStateBySlug } from '@/lib/hooks';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import DetailSection, { SectionNote } from '@/components/states/DetailSection';
import InPageNav, { type InPageNavItem } from '@/components/states/InPageNav';
import KeyFacts from '@/components/states/KeyFacts';
import CityCard from '@/components/states/CityCard';
import PlacesGrid from '@/components/states/PlacesGrid';
import WeatherSeasons, { hasWeather } from '@/components/states/WeatherSeasons';
import EmergencyNumbers from '@/components/states/EmergencyNumbers';
import { GlancePanel, MapFrame, ghostButton, primaryButton } from '@/components/states/Sidebar';
import { DetailNotFound, DetailSkeleton } from '@/components/states/DetailStates';
import type { City, Place } from '@/types';
import AgencyCard from '@/components/booking/AgencyCard';

export default function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: stateResponse, isLoading, refetch, isFetching } = useStateBySlug(slug);
  const state = stateResponse?.data;

  if (isLoading) return <DetailSkeleton />;
  if (!state) return <DetailNotFound kind="state" />;

  const cities: City[] = Array.isArray(state.popularCities) ? state.popularCities : [];
  const places: Place[] = Array.isArray(state.popularPlaces) ? state.popularPlaces : [];

  const mapMarkers: MapMarker[] = [...createCityMarkers(cities), ...createPlaceMarkers(places)];

  const mapCenter: [number, number] =
    cities.length > 0 && cities[0].location?.latitude && cities[0].location?.longitude
      ? [cities[0].location.latitude, cities[0].location.longitude]
      : [20.5937, 78.9629];

  const showWeather = hasWeather(state.weather);
  const climate = [state.weather?.summer && `Summer ${state.weather.summer}`, state.weather?.winter && `Winter ${state.weather.winter}`]
    .filter(Boolean)
    .join(' · ');

  const navItems: InPageNavItem[] = [
    { id: 'cities', label: 'Cities' },
    { id: 'places', label: 'Places' },
    ...(showWeather ? [{ id: 'weather', label: 'Weather' }] : []),
    ...(mapMarkers.length > 0 ? [{ id: 'map', label: 'Map' }] : []),
  ];

  const searchHref = `/search?state=${encodeURIComponent(state.name)}`;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <PageHeader
        size="lg"
        image={state.image}
        eyebrow="State guide"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'States', href: '/states' }, { label: state.name }]}
        title={state.name}
        description={state.description && <p className="line-clamp-4">{state.description}</p>}
        className="pb-8"
      >
        <div className="flex flex-wrap gap-3">
          {places.length > 0 && (
            <a href="#places" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-opacity hover:opacity-95">
              <Compass className="h-4 w-4" />
              Explore {places.length} {places.length === 1 ? 'place' : 'places'}
            </a>
          )}
          {mapMarkers.length > 0 && (
            <a href="#map" className={ghostButton}>
              <MapIcon className="h-4 w-4" />
              View on map
            </a>
          )}
        </div>
      </PageHeader>

      <KeyFacts
        facts={[
          { icon: Landmark, label: 'Capital', value: state.capital },
          { icon: CalendarDays, label: 'Best time', value: state.bestTimeToVisit },
          { icon: Languages, label: 'Language', value: state.localLanguage },
          { icon: Thermometer, label: 'Weather', value: climate },
        ]}
      />

      <InPageNav items={navItems} layoutId="state-nav" className="mt-10" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <div className="min-w-0 space-y-16 md:space-y-20 lg:col-span-8">
          <DetailSection
            id="cities"
            eyebrow="Where to go"
            title={`Popular cities in ${state.name}`}
            description={cities.length > 0 ? `${cities.length} ${cities.length === 1 ? 'city' : 'cities'} worth a stop.` : undefined}
          >
            {cities.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {cities.map((city, index) => (
                  <CityCard key={city._id || city.slug} city={city} index={index} />
                ))}
              </div>
            ) : (
              <SectionNote>No cities available for this state yet.</SectionNote>
            )}
          </DetailSection>

          <DetailSection
            id="places"
            eyebrow="Things to see"
            title="Popular tourist places"
            description={places.length > 0 ? 'Landmarks, nature spots and experiences loved by travellers.' : undefined}
            action={
              places.length > 0 ? (
                <Link href={searchHref} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 hover:text-orange-600 dark:text-white">
                  Search all
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : undefined
            }
          >
            {places.length > 0 ? (
              <PlacesGrid places={places} layoutId="state-place-cats" />
            ) : (
              <EmptyState
                icon={MapPin}
                title="No tourist places yet"
                description={`We're still adding places for ${state.name}.`}
                action={
                  <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 transition-colors hover:border-orange-400 hover:text-orange-600 disabled:opacity-60 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
                  >
                    <RefreshCw className={isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
                    Refresh data
                  </button>
                }
              />
            )}
          </DetailSection>

          {showWeather && (
            <DetailSection id="weather" eyebrow="When to go" title="Weather by season" description={state.bestTimeToVisit ? `Best time to visit: ${state.bestTimeToVisit}` : undefined}>
              <WeatherSeasons weather={state.weather} />
            </DetailSection>
          )}

          {mapMarkers.length > 0 && (
            <DetailSection
              id="map"
              eyebrow="Map"
              title="Explore on the map"
              description={`${mapMarkers.length} cities and tourist places in ${state.name}.`}
            >
              <MapFrame>
                <InteractiveMap center={mapCenter} zoom={8} markers={mapMarkers} height="480px" showLegend={true} />
              </MapFrame>
            </DetailSection>
          )}
        </div>

        <aside id="essentials" className="scroll-mt-36 lg:col-span-4 lg:scroll-mt-40">
          <AgencyCard destination={state.name} className="mb-5" />
          <div className="space-y-5 lg:sticky lg:top-[140px]">
            <GlancePanel
              title="At a glance"
              items={[
                { icon: Landmark, label: 'Capital', value: state.capital },
                { icon: Languages, label: 'Language', value: state.localLanguage },
                { icon: CalendarDays, label: 'Best time', value: state.bestTimeToVisit },
                { icon: Building2, label: 'Cities', value: cities.length || undefined },
                { icon: MapPin, label: 'Places', value: places.length || undefined },
              ]}
              footer={
                <Link href={searchHref} className={primaryButton}>
                  <Compass className="h-4 w-4" />
                  Find places in {state.name}
                </Link>
              }
            />
            <EmergencyNumbers numbers={state.emergencyNumbers} />
          </div>
        </aside>
      </div>
    </div>
  );
}
