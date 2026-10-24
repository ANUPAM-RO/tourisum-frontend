'use client';

import React, { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  Compass,
  Hotel as HotelIcon,
  Landmark,
  Languages,
  Map as MapIcon,
  MapPin,
  Plane,
  Thermometer,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react';
import { InteractiveMap, MapMarker } from '@/components/map';
import { createPlaceMarkers, createHotelMarkers, createRestaurantMarkers } from '@/lib/mapHelpers';
import { useCityBySlug } from '@/lib/hooks';
import PageHeader, { type Crumb } from '@/components/shared/PageHeader';
import DetailSection, { SectionNote } from '@/components/states/DetailSection';
import InPageNav, { type InPageNavItem } from '@/components/states/InPageNav';
import KeyFacts from '@/components/states/KeyFacts';
import PlacesGrid from '@/components/states/PlacesGrid';
import ExpandableGrid from '@/components/states/ExpandableGrid';
import WeatherSeasons, { hasWeather } from '@/components/states/WeatherSeasons';
import EmergencyNumbers from '@/components/states/EmergencyNumbers';
import { HotelCard, RestaurantCard } from '@/components/states/CityListings';
import { BudgetTiers, LocalFoods, TransportList, TravelTips, budgetTiers, hasTips, transportRows } from '@/components/states/CityInfo';
import { GlancePanel, MapFrame, ghostButton, primaryButton } from '@/components/states/Sidebar';
import { DetailNotFound, DetailSkeleton } from '@/components/states/DetailStates';
import type { Hotel, Place, Restaurant, State } from '@/types';
import AgencyCard from '@/components/booking/AgencyCard';
import { SHOW_STAYS } from '@/lib/features';

export default function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: cityResponse, isLoading } = useCityBySlug(slug);
  const city = cityResponse?.data;

  if (isLoading) return <DetailSkeleton />;
  if (!city) return <DetailNotFound kind="city" />;

  const places: Place[] = Array.isArray(city.popularPlaces) ? city.popularPlaces : [];
  // Every hotel/restaurant block below is skipped when these lists are empty.
  const hotels: Hotel[] = SHOW_STAYS && Array.isArray(city.hotels) ? city.hotels : [];
  const restaurants: Restaurant[] = SHOW_STAYS && Array.isArray(city.restaurants) ? city.restaurants : [];

  const mapMarkers: MapMarker[] = [
    ...createPlaceMarkers(places),
    ...createHotelMarkers(hotels),
    ...createRestaurantMarkers(restaurants),
  ];

  const mapCenter: [number, number] =
    city.location?.latitude && city.location?.longitude
      ? [city.location.latitude, city.location.longitude]
      : [20.5937, 78.9629];

  const state: State | null = city.state && typeof city.state === 'object' ? city.state : null;
  const stateName = state?.name ?? '';

  const transport = transportRows(city.transportation);
  const tiers = budgetTiers(city.estimatedBudget);
  const foods = Array.isArray(city.localFoods) ? city.localFoods.filter(Boolean) : [];
  const showTips = hasTips(city.travelTips);
  const showWeather = hasWeather(city.weather);
  const climate = [city.weather?.summer && `Summer ${city.weather.summer}`, city.weather?.winter && `Winter ${city.weather.winter}`]
    .filter(Boolean)
    .join(' · ');
  const standardTotal = city.estimatedBudget?.standard?.total || city.estimatedBudget?.budget?.total;

  const breadcrumbs: Crumb[] = [
    { label: 'Home', href: '/' },
    { label: 'States', href: '/states' },
    ...(state ? [{ label: state.name, href: state.slug ? `/states/${state.slug}` : undefined }] : []),
    { label: city.name },
  ];

  const navItems: InPageNavItem[] = [
    { id: 'places', label: 'Places' },
    ...(hotels.length > 0 ? [{ id: 'hotels', label: 'Hotels' }] : []),
    ...(restaurants.length > 0 ? [{ id: 'restaurants', label: 'Restaurants' }] : []),
    ...(transport.length > 0 ? [{ id: 'getting-there', label: 'Getting there' }] : []),
    ...(tiers.length > 0 ? [{ id: 'budget', label: 'Budget' }] : []),
    ...(foods.length > 0 ? [{ id: 'food', label: 'Local food' }] : []),
    ...(showTips ? [{ id: 'tips', label: 'Travel tips' }] : []),
    ...(showWeather ? [{ id: 'weather', label: 'Weather' }] : []),
    ...(mapMarkers.length > 0 ? [{ id: 'map', label: 'Map' }] : []),
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <PageHeader
        size="lg"
        image={city.image}
        eyebrow={stateName ? `City in ${stateName}` : 'City guide'}
        breadcrumbs={breadcrumbs}
        title={city.name}
        description={city.description && <p className="line-clamp-4">{city.description}</p>}
        className="pb-8"
      >
        <div className="flex flex-wrap gap-3">
          {places.length > 0 && (
            <a
              href="#places"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-opacity hover:opacity-95"
            >
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
          { icon: CalendarDays, label: 'Best time', value: city.bestTimeToVisit },
          { icon: Languages, label: 'Language', value: state?.localLanguage },
          { icon: Landmark, label: 'State', value: stateName },
          { icon: Thermometer, label: 'Weather', value: climate },
        ]}
      />

      <InPageNav items={navItems} layoutId="city-nav" className="mt-10" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <div className="min-w-0 space-y-16 md:space-y-20 lg:col-span-8">
          <DetailSection
            id="places"
            eyebrow="Things to see"
            title={`Top places in ${city.name}`}
            description={places.length > 0 ? 'Landmarks, viewpoints and experiences loved by travellers.' : undefined}
          >
            {places.length > 0 ? (
              <PlacesGrid places={places} layoutId="city-place-cats" />
            ) : (
              <SectionNote>No tourist places available for this city yet.</SectionNote>
            )}
          </DetailSection>

          {hotels.length > 0 && (
            <DetailSection
              id="hotels"
              eyebrow="Where to stay"
              title="Hotels"
              description={`${hotels.length} ${hotels.length === 1 ? 'stay' : 'stays'} in and around ${city.name}.`}
            >
              <ExpandableGrid>
                {hotels.map((hotel, index) => (
                  <HotelCard key={hotel._id || index} hotel={hotel} index={index} />
                ))}
              </ExpandableGrid>
            </DetailSection>
          )}

          {restaurants.length > 0 && (
            <DetailSection
              id="restaurants"
              eyebrow="Where to eat"
              title="Restaurants"
              description={`${restaurants.length} ${restaurants.length === 1 ? 'spot' : 'spots'} for a great meal.`}
            >
              <ExpandableGrid>
                {restaurants.map((restaurant, index) => (
                  <RestaurantCard key={restaurant._id || index} restaurant={restaurant} index={index} />
                ))}
              </ExpandableGrid>
            </DetailSection>
          )}

          {transport.length > 0 && (
            <DetailSection id="getting-there" eyebrow="Getting there" title={`How to reach ${city.name}`}>
              <TransportList rows={transport} />
            </DetailSection>
          )}

          {tiers.length > 0 && (
            <DetailSection
              id="budget"
              eyebrow="Plan your spend"
              title="Estimated daily budget"
              description="Typical per-person costs — pick the style that suits your trip."
            >
              <BudgetTiers tiers={tiers} />
            </DetailSection>
          )}

          {foods.length > 0 && (
            <DetailSection id="food" eyebrow="Taste of the city" title="Local food to try">
              <LocalFoods foods={foods} />
            </DetailSection>
          )}

          {showTips && (
            <DetailSection id="tips" eyebrow="Know before you go" title="Travel tips">
              <TravelTips tips={city.travelTips} />
            </DetailSection>
          )}

          {showWeather && (
            <DetailSection
              id="weather"
              eyebrow="When to go"
              title="Weather by season"
              description={city.bestTimeToVisit ? `Best time to visit: ${city.bestTimeToVisit}` : undefined}
            >
              <WeatherSeasons weather={city.weather} />
            </DetailSection>
          )}

          {mapMarkers.length > 0 && (
            <DetailSection
              id="map"
              eyebrow="Map"
              title={`Explore ${city.name} on the map`}
              description={
                SHOW_STAYS
                  ? `${mapMarkers.length} locations including places, hotels & restaurants.`
                  : `${mapMarkers.length} place${mapMarkers.length === 1 ? '' : 's'} to explore.`
              }
            >
              <MapFrame>
                <InteractiveMap center={mapCenter} zoom={13} markers={mapMarkers} height="480px" showLegend={true} />
              </MapFrame>
            </DetailSection>
          )}
        </div>

        <aside className="lg:col-span-4">
          <AgencyCard destination={city.name} className="mb-5" />
          <div className="space-y-5 lg:sticky lg:top-[140px]">
            <GlancePanel
              title="Trip snapshot"
              items={[
                { icon: CalendarDays, label: 'Best time', value: city.bestTimeToVisit },
                {
                  icon: Landmark,
                  label: 'State',
                  value:
                    state?.slug ? (
                      <Link href={`/states/${state.slug}`} className="text-orange-600 hover:underline">
                        {state.name}
                      </Link>
                    ) : (
                      stateName || undefined
                    ),
                },
                { icon: Wallet, label: 'Daily budget', value: standardTotal ? `${standardTotal} / day` : undefined },
                { icon: Plane, label: 'Airport', value: city.transportation?.nearestAirport?.name },
                { icon: MapPin, label: 'Places', value: places.length || undefined },
                { icon: HotelIcon, label: 'Hotels', value: hotels.length || undefined },
                { icon: UtensilsCrossed, label: 'Restaurants', value: restaurants.length || undefined },
              ]}
              footer={
                places.length > 0 ? (
                  <a href="#places" className={primaryButton}>
                    <Compass className="h-4 w-4" />
                    Start exploring
                  </a>
                ) : undefined
              }
            />
            <EmergencyNumbers numbers={state?.emergencyNumbers} />
            {state?.slug && (
              <Link
                href={`/states/${state.slug}`}
                className="group flex items-center gap-2 rounded-2xl border border-stone-200/80 bg-white px-5 py-4 text-sm font-semibold text-stone-800 transition-colors hover:border-orange-300 hover:text-orange-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                More of {state.name}
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
