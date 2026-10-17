'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, MapPin, Search, SearchX, Star, X } from 'lucide-react';
import { usePlaces, useStates, useCategories } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/shared/PageHeader';
import PlaceCard, { PlaceCardSkeleton } from '@/components/shared/PlaceCard';
import ChipGroup from '@/components/shared/ChipGroup';
import EmptyState from '@/components/shared/EmptyState';
import FancySelect from '@/components/shared/FancySelect';
import type { Place } from '@/types';

const HEADER_IMAGE = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da';
const LIMIT = 12;
const ALL = 'All';
const RATING_OPTIONS = [0, 3, 3.5, 4, 4.5];

const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Search' }];

/** Fallback slug guess while the states list is loading (backend filters by state slug). */
const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchFallback() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <PageHeader title="Search destinations" breadcrumbs={breadcrumbs} image={HEADER_IMAGE} />
      <ResultsSkeleton />
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <PlaceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // The URL is the single source of truth for filters, so links from the home page
  // (?q=, ?state=<name>, ?category=) and back/forward navigation always apply.
  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') || ALL;
  const stateParam = searchParams.get('state') ?? '';
  const minRating = Number(searchParams.get('rating')) || 0;
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [input, setInput] = useState(q);
  const lastPushedQ = useRef(q);

  const { data: statesData } = useStates({ limit: 50 });
  const { data: categoriesData } = useCategories();
  const states = useMemo(() => statesData?.data ?? [], [statesData]);
  const categories = useMemo(() => categoriesData?.data?.map((c) => c.name) ?? [], [categoriesData]);

  // Accept either a state name (what the home page sends) or a slug.
  const matchedState = useMemo(() => {
    if (!stateParam) return undefined;
    const needle = stateParam.toLowerCase();
    return states.find((s) => s.name.toLowerCase() === needle || s.slug === needle);
  }, [states, stateParam]);
  const stateSlug = stateParam ? matchedState?.slug ?? slugify(stateParam) : undefined;
  const stateValue = matchedState?.name ?? stateParam;

  const { data: placesData, isLoading, isFetching } = usePlaces({
    page,
    limit: LIMIT,
    category: category !== ALL ? category : undefined,
    state: stateSlug,
    search: q || undefined,
    minRating: minRating > 0 ? minRating : undefined,
  });

  const places: Place[] = placesData?.data ?? [];
  const total = placesData?.pagination?.total ?? places.length;
  const pages = placesData?.pagination?.pages ?? 1;

  const updateParams = useCallback(
    (changes: Record<string, string | number | null>, { resetPage = true } = {}) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === '' || value === ALL || value === 0) params.delete(key);
        else params.set(key, String(value));
      }
      if (resetPage && !('page' in changes)) params.delete('page');
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Keep the input in sync with external URL changes (navbar search, back button)
  // without clobbering what the user is currently typing.
  useEffect(() => {
    if (q !== lastPushedQ.current) {
      lastPushedQ.current = q;
      setInput(q);
    }
  }, [q]);

  // Debounced live search.
  useEffect(() => {
    const next = input.trim();
    if (next === q) return;
    const t = setTimeout(() => {
      lastPushedQ.current = next;
      updateParams({ q: next || null });
    }, 400);
    return () => clearTimeout(t);
  }, [input, q, updateParams]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = input.trim();
    lastPushedQ.current = next;
    if (next !== q) updateParams({ q: next || null });
  };

  const goToPage = (p: number) => {
    updateParams({ page: p > 1 ? p : null }, { resetPage: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasFilters = !!q || category !== ALL || !!stateParam || minRating > 0;
  const clearFilters = () => {
    lastPushedQ.current = '';
    setInput('');
    router.replace(pathname, { scroll: false });
  };

  const categoryOptions = useMemo(() => {
    const opts = [ALL, ...categories];
    // Keep a category from the URL selectable even if it isn't in the list (yet).
    if (category !== ALL && !opts.includes(category)) opts.push(category);
    return opts;
  }, [categories, category]);

  const title =
    category !== ALL ? (
      <><em className="italic text-orange-300">{category}</em> destinations</>
    ) : stateValue ? (
      <>Explore <em className="italic text-orange-300">{stateValue}</em></>
    ) : (
      <>Search <em className="italic text-orange-300">destinations</em></>
    );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <PageHeader
        eyebrow="Find your next trip"
        title={title}
        description="Search by name or description, then narrow down by category, state or rating."
        breadcrumbs={breadcrumbs}
        image={HEADER_IMAGE}
      >
        <form
          onSubmit={submitSearch}
          role="search"
          className="flex max-w-2xl items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/30"
        >
          <label className="flex flex-1 items-center gap-3 px-3 py-2">
            <Search className="h-5 w-5 shrink-0 text-orange-500" />
            <span className="sr-only">Search destinations</span>
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Try “Goa”, “fort” or “temple”"
              className="w-full bg-transparent text-[15px] text-stone-900 placeholder:text-stone-400 outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                aria-label="Clear search"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
          <button
            type="submit"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 font-semibold text-white shadow-lg shadow-orange-500/30 transition-[transform,filter] duration-200 hover:brightness-110 active:scale-[0.98] sm:px-7"
          >
            <Search className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>
      </PageHeader>

      {/* Sticky filters */}
      <div className="sticky top-16 z-30 border-b border-stone-200/80 bg-white/95 backdrop-blur-md lg:top-[68px] dark:border-stone-800 dark:bg-stone-950/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-4 lg:px-8">
          <ChipGroup
            options={categoryOptions}
            value={category}
            onChange={(v) => updateParams({ category: v })}
            layoutId="search-category"
            label="Categories"
            className="min-w-0 flex-1"
          />
          <div className="flex shrink-0 gap-2">
            <FancySelect
              icon={MapPin}
              label="State"
              value={stateValue}
              onChange={(v) => updateParams({ state: v || null })}
              options={[
                { value: '', label: 'All states' },
                ...(stateValue && !matchedState ? [{ value: stateValue, label: stateValue }] : []),
                ...states.map((s) => ({ value: s.name, label: s.name })),
              ]}
              className="min-w-0 flex-1 sm:w-56 sm:flex-none"
            />
            <FancySelect
              icon={Star}
              label="Minimum rating"
              value={String(minRating)}
              onChange={(v) => updateParams({ rating: Number(v) || null })}
              options={RATING_OPTIONS.map((r) => ({ value: String(r), label: r === 0 ? 'Any rating' : `${r}+ stars` }))}
              align="right"
              panelClassName="min-w-[11rem]"
              className="w-40"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-stone-600 dark:text-stone-400" aria-live="polite">
            {isLoading ? (
              'Searching…'
            ) : (
              <>
                <span className="font-semibold text-stone-900 dark:text-white">{total}</span> destination{total !== 1 ? 's' : ''} found
                {q && <> for <span className="font-semibold text-stone-900 dark:text-white">“{q}”</span></>}
              </>
            )}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/40"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </div>
        ) : places.length > 0 ? (
          <div
            className={cn(
              'grid grid-cols-1 gap-6 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3',
              isFetching && 'opacity-60'
            )}
          >
            {places.map((place, index) => (
              <PlaceCard key={place._id || place.slug} place={place} index={index} showDescription />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchX}
            title="No destinations found"
            description={
              hasFilters
                ? 'Nothing matches these filters. Try a different search term or remove a filter.'
                : 'There are no destinations to show right now.'
            }
            action={
              hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 font-semibold text-white shadow-lg shadow-orange-500/25 transition-[transform,filter] duration-200 hover:brightness-110 active:scale-[0.98]"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </button>
              )
            }
          />
        )}

        {pages > 1 && places.length > 0 && <Pagination page={page} pages={pages} onChange={goToPage} />}
      </section>
    </div>
  );
}

function pageList(page: number, pages: number): (number | '…')[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const out: (number | '…')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pages - 1, page + 1);
  if (start > 2) out.push('…');
  for (let p = start; p <= end; p++) out.push(p);
  if (end < pages - 1) out.push('…');
  out.push(pages);
  return out;
}

function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  const btn =
    'flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40';
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(btn, 'text-stone-600 hover:bg-stone-200/70 dark:text-stone-300 dark:hover:bg-stone-800')}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pageList(page, pages).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="px-1 text-stone-400">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              btn,
              p === page
                ? 'bg-stone-900 text-white dark:bg-orange-500'
                : 'text-stone-600 hover:bg-stone-200/70 dark:text-stone-300 dark:hover:bg-stone-800'
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
        className={cn(btn, 'text-stone-600 hover:bg-stone-200/70 dark:text-stone-300 dark:hover:bg-stone-800')}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
