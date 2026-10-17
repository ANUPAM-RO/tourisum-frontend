'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChipGroupProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  /** Unique per page section so the animated pill doesn't jump between groups. */
  layoutId: string;
  label?: string;
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * Horizontally scrollable filter chips with an animated active pill.
 * The native scrollbar is hidden; edge fades + arrow buttons appear only when there is more to scroll.
 */
export default function ChipGroup({ options, value, onChange, layoutId, label, tone = 'light', className }: ChipGroupProps) {
  const dark = tone === 'dark';
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateEdges, options.length]);

  // Keep the selected chip visible (e.g. when it was set from the URL) — horizontal only, never scrolls the page.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const chip = scroller?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!scroller || !chip) return;
    const left = chip.offsetLeft - scroller.offsetLeft;
    const right = left + chip.offsetWidth;
    if (left < scroller.scrollLeft) scroller.scrollTo({ left: left - 16, behavior: 'smooth' });
    else if (right > scroller.scrollLeft + scroller.clientWidth)
      scroller.scrollTo({ left: right - scroller.clientWidth + 16, behavior: 'smooth' });
  }, [value]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' });
  };

  const fade = dark ? 'from-stone-950' : 'from-white dark:from-stone-950';
  const arrowClass = cn(
    'absolute top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm transition-[opacity,color] sm:flex',
    dark
      ? 'border-white/20 bg-stone-900 text-white/80 hover:text-white'
      : 'border-stone-200 bg-white text-stone-600 hover:text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300'
  );

  return (
    <div className={cn('relative min-w-0', className)}>
      <div
        ref={scrollerRef}
        role="tablist"
        aria-label={label}
        onScroll={updateEdges}
        className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto scroll-smooth px-4 py-0.5 sm:mx-0 sm:px-0"
      >
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(option)}
              className={cn(
                'relative h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors',
                active
                  ? dark
                    ? 'border-transparent text-stone-900'
                    : 'border-transparent text-white'
                  : dark
                  ? 'border-white/15 text-white/75 hover:border-white/30 hover:text-white'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:text-white'
              )}
            >
              {active && (
                <motion.span
                  layoutId={layoutId}
                  className={cn(
                    'absolute -inset-px rounded-full',
                    dark ? 'bg-white' : 'bg-gradient-to-r from-orange-500 to-rose-500 shadow-md shadow-orange-500/25'
                  )}
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Edge fades + arrows (desktop) */}
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r to-transparent transition-opacity',
          fade,
          edges.left ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l to-transparent transition-opacity',
          fade,
          edges.right ? 'opacity-100' : 'opacity-0'
        )}
      />
      <button
        type="button"
        aria-label="Scroll filters left"
        onClick={() => scrollBy(-1)}
        className={cn(arrowClass, 'left-0', !edges.left && 'pointer-events-none opacity-0')}
        tabIndex={edges.left ? 0 : -1}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Scroll filters right"
        onClick={() => scrollBy(1)}
        className={cn(arrowClass, 'right-0', !edges.right && 'pointer-events-none opacity-0')}
        tabIndex={edges.right ? 0 : -1}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
