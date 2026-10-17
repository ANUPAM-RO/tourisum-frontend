'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FancyOption {
  value: string;
  label: string;
}

interface FancySelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FancyOption[];
  /** Accessible name for the control. */
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  placeholder?: string;
  /** Show a filter box; defaults to on for lists longer than 8. */
  searchable?: boolean;
  /** Panel alignment relative to the trigger. */
  align?: 'left' | 'right';
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
}

/**
 * Styled replacement for <select>: rounded trigger, animated popover list with
 * check marks, optional type-to-filter, and full keyboard support.
 */
export default function FancySelect({
  value,
  onChange,
  options,
  label,
  icon: Icon,
  placeholder = 'Select…',
  searchable,
  align = 'left',
  className,
  triggerClassName,
  panelClassName,
}: FancySelectProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const showSearch = searchable ?? options.length > 8;
  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // On open: reset filter, highlight the current value, focus search.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
    requestAnimationFrame(() => {
      if (showSearch) searchRef.current?.focus();
      listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
    });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const choose = (opt: FancyOption) => {
    onChange(opt.value);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = filtered[activeIndex];
      if (opt) choose(opt);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn('relative', className)} onKeyDown={onKeyDown}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-10 w-full items-center gap-2 rounded-full border bg-white pl-3.5 pr-3 text-left text-sm font-medium transition-[border-color,box-shadow,background-color] dark:bg-stone-900',
          open
            ? 'border-orange-400 ring-4 ring-orange-500/15'
            : 'border-stone-200 hover:border-stone-300 dark:border-stone-700',
          triggerClassName
        )}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0 text-orange-500" />}
        <span className={cn('min-w-0 flex-1 truncate', selected ? 'text-stone-800 dark:text-stone-100' : 'text-stone-400')}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-stone-400 transition-transform duration-200', open && 'rotate-180 text-orange-500')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={cn(
              'absolute top-full z-50 mt-2 w-full min-w-[15rem] overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xl shadow-stone-900/15 dark:border-stone-700 dark:bg-stone-900',
              align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
              panelClassName
            )}
          >
            {showSearch && (
              <div className="border-b border-stone-100 p-2 dark:border-stone-800">
                <div className="flex items-center gap-2 rounded-xl bg-stone-100 px-3 dark:bg-stone-800">
                  <Search className="h-4 w-4 shrink-0 text-stone-400" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActiveIndex(0);
                    }}
                    placeholder={`Search ${label.toLowerCase()}…`}
                    aria-label={`Filter ${label}`}
                    className="h-9 w-full bg-transparent text-sm text-stone-800 placeholder:text-stone-400 outline-none dark:text-white"
                  />
                </div>
              </div>
            )}

            <ul
              ref={listRef}
              id={`${id}-list`}
              role="listbox"
              aria-label={label}
              className="scrollbar-thin max-h-72 overflow-y-auto overscroll-contain p-1.5"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-stone-400">No matches</li>
              ) : (
                filtered.map((opt, i) => {
                  const isSelected = opt.value === value;
                  const isActive = i === activeIndex;
                  return (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      data-index={i}
                      onPointerEnter={() => setActiveIndex(i)}
                      onClick={() => choose(opt)}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors',
                        isActive && 'bg-orange-50 dark:bg-stone-800',
                        isSelected ? 'font-semibold text-orange-600 dark:text-orange-400' : 'text-stone-700 dark:text-stone-200'
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                      {isSelected && <Check className="h-4 w-4 shrink-0" />}
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
