'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface InPageNavItem {
  id: string;
  label: string;
}

/** Offset (px) below the viewport top at which a section counts as "current". */
const ACTIVE_OFFSET = 170;

/**
 * Sticky section nav that sits under the fixed navbar and highlights
 * the section currently in view. Uses a single rAF-throttled scroll listener.
 */
export default function InPageNav({ items, layoutId, className }: { items: InPageNavItem[]; layoutId: string; className?: string }) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  // Keyed on ids so a new (but identical) items array from the parent doesn't re-subscribe.
  const key = items.map((i) => i.id).join('|');

  useEffect(() => {
    const ids = key ? key.split('|') : [];
    if (ids.length === 0) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= ACTIVE_OFFSET) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);

  if (items.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      className={cn(
        'sticky top-16 z-30 border-b border-stone-200/80 bg-white/90 backdrop-blur-md lg:top-[68px] dark:border-stone-800 dark:bg-stone-950/90',
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActive(item.id)}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'text-white'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-rose-500"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
