import type { LucideIcon } from 'lucide-react';
import { Panel } from './DetailSection';

export interface GlanceItem {
  icon: LucideIcon;
  label: string;
  value?: React.ReactNode;
}

/** "At a glance" summary panel for the desktop sidebar. */
export function GlancePanel({ title, items, footer }: { title: string; items: GlanceItem[]; footer?: React.ReactNode }) {
  const visible = items.filter((i) => i.value !== undefined && i.value !== null && i.value !== '');
  if (visible.length === 0 && !footer) return null;

  return (
    <Panel>
      <h3 className="font-display text-xl font-semibold tracking-tight text-stone-900 dark:text-white">{title}</h3>
      <dl className="mt-4 divide-y divide-stone-100 dark:divide-stone-800">
        {visible.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
            <dt className="w-24 shrink-0 text-sm text-stone-500 dark:text-stone-400">{label}</dt>
            <dd className="min-w-0 flex-1 text-sm font-medium text-stone-900 dark:text-white">{value}</dd>
          </div>
        ))}
      </dl>
      {footer && <div className="mt-5">{footer}</div>}
    </Panel>
  );
}

/** Rounded frame around the Leaflet map so it matches the card language. */
export function MapFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-1.5 dark:border-stone-800 dark:bg-stone-900">
      <div className="isolate overflow-hidden rounded-xl">{children}</div>
    </div>
  );
}

export const primaryButton =
  'inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-[opacity,transform] hover:opacity-95 active:scale-[0.98]';

export const ghostButton =
  'inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-stone-900';
