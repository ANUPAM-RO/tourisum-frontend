import Link from 'next/link';
import { ArrowLeft, MapPinOff } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import { PlaceCardSkeleton } from '@/components/shared/PlaceCard';

/** Loading skeleton mirroring the detail page layout (header, facts strip, content + sidebar). */
export function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950" aria-busy="true" aria-label="Loading">
      <div className="bg-stone-900 pt-16 lg:pt-[68px]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="h-4 w-48 animate-pulse rounded bg-white/10" />
          <div className="mt-6 h-12 w-2/3 max-w-md animate-pulse rounded-lg bg-white/15" />
          <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-5 w-3/4 max-w-lg animate-pulse rounded bg-white/10" />
        </div>
      </div>
      <div className="relative mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-24 animate-pulse rounded-2xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900" />
      </div>
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {Array.from({ length: 3 }, (_, i) => (
          <PlaceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function DetailNotFound({ kind }: { kind: 'state' | 'city' }) {
  return (
    <div className="min-h-screen bg-stone-50 px-4 pb-16 pt-32 dark:bg-stone-950">
      <EmptyState
        icon={MapPinOff}
        title={kind === 'state' ? 'State not found' : 'City not found'}
        description={`We couldn't find this ${kind}. It may have been moved or isn't published yet.`}
        className="mx-auto max-w-lg"
        action={
          <Link
            href="/states"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse all states
          </Link>
        }
      />
    </div>
  );
}
