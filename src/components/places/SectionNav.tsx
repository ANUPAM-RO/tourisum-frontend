'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface NavSection {
  id: string;
  label: string;
}

/** Sticky in-page navigation that tracks which section is in view. */
export default function SectionNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const listRef = useRef<HTMLDivElement>(null);
  const ids = sections.map((s) => s.id).join('|');

  useEffect(() => {
    const elements = ids
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActive(visible[0].target.id);
        }
      },
      // Band just below the sticky navbar + this bar.
      { rootMargin: '-140px 0px -55% 0px' }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  // Keep the active tab visible on small screens.
  useEffect(() => {
    const list = listRef.current;
    const btn = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !btn) return;
    const left = btn.offsetLeft - list.clientWidth / 2 + btn.clientWidth / 2;
    list.scrollTo({ left, behavior: 'smooth' });
  }, [active]);

  const jump = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="sticky top-16 z-30 border-b border-stone-200/80 bg-white/95 dark:border-stone-800 dark:bg-stone-950/95 lg:top-[68px]">
      <div
        ref={listRef}
        className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              data-id={s.id}
              type="button"
              onClick={() => jump(s.id)}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'relative shrink-0 px-3 py-4 text-sm font-medium transition-colors',
                isActive ? 'text-stone-900 dark:text-white' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
              )}
            >
              {s.label}
              {isActive && (
                <motion.span
                  layoutId="place-section-nav"
                  className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500"
                  transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
