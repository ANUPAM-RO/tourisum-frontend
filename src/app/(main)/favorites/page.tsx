'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Heart, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/lib/hooks';
import PageHeader from '@/components/shared/PageHeader';
import PlaceCard, { PlaceCardSkeleton } from '@/components/shared/PlaceCard';
import EmptyState from '@/components/shared/EmptyState';
import { primaryButtonClass } from '@/components/account/FormField';
import type { Place } from '@/types';

const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Favorites' }];

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <PlaceCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function FavoritesPage() {
  const { isAuthenticated, loading } = useAuth();
  const { data, isLoading } = useFavorites(isAuthenticated);

  const favoritePlaces: Place[] = data?.data || [];
  const count = favoritePlaces.length;

  const description = loading
    ? 'Your saved destinations, all in one place.'
    : !isAuthenticated
    ? 'Sign in to keep a list of places you love and come back to them anytime.'
    : isLoading
    ? 'Loading your saved destinations…'
    : count > 0
    ? `${count} saved destination${count !== 1 ? 's' : ''} — ready when you are.`
    : 'Places you save will show up here.';

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <PageHeader
        eyebrow="Your collection"
        title={<>My <em className="italic text-orange-300">Favorites</em></>}
        description={description}
        breadcrumbs={breadcrumbs}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        {loading || (isAuthenticated && isLoading) ? (
          <SkeletonGrid count={loading ? 3 : 6} />
        ) : !isAuthenticated ? (
          <EmptyState
            icon={Heart}
            title="Sign in to see your favorites"
            description="Tap the heart on any place to save it. Your list syncs across all your devices."
            action={
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <Link href="/auth/login" className={primaryButtonClass}>
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex h-12 items-center rounded-xl px-5 font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  Create an account
                </Link>
              </div>
            }
          />
        ) : count > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoritePlaces.map((place, index) => (
              <PlaceCard key={place._id} place={place} index={index} showDescription />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="Start exploring and tap the heart on any destination to save it here."
            action={
              <Link href="/places" className={primaryButtonClass}>
                <Compass className="h-4 w-4" />
                Explore places
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
