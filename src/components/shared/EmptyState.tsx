import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'col-span-full flex flex-col items-center rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center dark:border-stone-700 dark:bg-stone-900',
        className
      )}
    >
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-950/40">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="text-lg font-semibold text-stone-900 dark:text-white">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-stone-500 dark:text-stone-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
