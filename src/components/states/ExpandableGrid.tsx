'use client';

import { Children, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Card grid that shows the first `initialCount` children with a "Show more" toggle. */
export default function ExpandableGrid({
  children,
  initialCount = 6,
  className = 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3',
}: {
  children: React.ReactNode;
  initialCount?: number;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const items = Children.toArray(children);
  const hidden = items.length - initialCount;

  return (
    <div>
      <div className={className}>{expanded ? items : items.slice(0, initialCount)}</div>
      {hidden > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 transition-colors hover:border-orange-400 hover:text-orange-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
          >
            {expanded ? 'Show fewer' : `Show ${hidden} more`}
            <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
          </button>
        </div>
      )}
    </div>
  );
}
