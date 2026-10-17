'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import FancySelect from '@/components/shared/FancySelect';

export interface Option {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label: string;
  className?: string;
}

/** Pill-shaped select used in the sticky listing filter bar. Highlights when not on its default option. */
export function FilterSelect({ value, onChange, options, label, className }: FilterSelectProps) {
  const active = value !== options[0]?.value;

  return (
    <FancySelect
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      align="right"
      className={cn('w-full md:w-44', className)}
      triggerClassName={cn(
        'px-4',
        active && 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-500/40 dark:bg-orange-950/40 [&>span]:text-orange-700 dark:[&>span]:text-orange-300'
      )}
    />
  );
}

interface HeaderSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

/** Large search field that sits inside the dark PageHeader. */
export function HeaderSearch({ value, onChange, placeholder }: HeaderSearchProps) {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="flex max-w-2xl items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-2xl shadow-black/30 dark:bg-stone-900"
    >
      <Search className="h-5 w-5 shrink-0 text-stone-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 min-w-0 flex-1 bg-transparent text-[15px] text-stone-900 outline-none placeholder:text-stone-400 dark:text-white [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <button
        type="submit"
        className="hidden h-11 shrink-0 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-opacity hover:opacity-90 sm:block"
      >
        Search
      </button>
    </form>
  );
}
