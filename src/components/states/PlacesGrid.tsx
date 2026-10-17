'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ChipGroup from '@/components/shared/ChipGroup';
import PlaceCard from '@/components/shared/PlaceCard';
import type { Place } from '@/types';

const ALL = 'All';

interface PlacesGridProps {
  places: Place[];
  layoutId: string;
  /** How many cards to show before "Show more". */
  initialCount?: number;
}

/** PlaceCard grid with category chips and progressive "show more" for long lists. */
export default function PlacesGrid({ places, layoutId, initialCount = 6 }: PlacesGridProps) {
  const [category, setCategory] = useState(ALL);
  const [expanded, setExpanded] = useState(false);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of places) {
      const cats = Array.isArray(p.category) ? p.category : p.category ? [p.category as unknown as string] : [];
      for (const c of cats) counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c]) => c);
  }, [places]);

  const filtered = useMemo(
    () =>
      category === ALL
        ? places
        : places.filter((p) => (Array.isArray(p.category) ? p.category : [p.category]).includes(category)),
    [places, category]
  );

  const visible = expanded ? filtered : filtered.slice(0, initialCount);
  const hidden = filtered.length - visible.length;

  return (
    <div>
      {categories.length > 1 && (
        <ChipGroup
          options={[ALL, ...categories]}
          value={category}
          onChange={(c) => {
            setCategory(c);
            setExpanded(false);
          }}
          layoutId={layoutId}
          label="Filter places by category"
          className="mb-6"
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((place, i) => (
          <PlaceCard key={place._id || place.slug} place={place} index={i} />
        ))}
      </div>

      {(hidden > 0 || (expanded && filtered.length > initialCount)) && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 transition-colors hover:border-orange-400 hover:text-orange-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
          >
            {expanded ? 'Show fewer' : `Show ${hidden} more`}
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
}
