import { Ambulance, Flame, Phone, ShieldAlert } from 'lucide-react';
import { Panel } from './DetailSection';

interface Numbers {
  police?: string;
  ambulance?: string;
  fire?: string;
}

export function hasEmergencyNumbers(numbers?: Numbers | null) {
  return !!numbers && !!(numbers.police || numbers.ambulance || numbers.fire);
}

/** Compact emergency contacts panel with tap-to-call links. */
export default function EmergencyNumbers({ numbers, className }: { numbers?: Numbers | null; className?: string }) {
  if (!numbers || !hasEmergencyNumbers(numbers)) return null;

  const rows = [
    { label: 'Police', value: numbers.police, icon: ShieldAlert },
    { label: 'Ambulance', value: numbers.ambulance, icon: Ambulance },
    { label: 'Fire', value: numbers.fire, icon: Flame },
  ].filter((r) => r.value);

  return (
    <Panel className={className}>
      <h3 className="flex items-center gap-2 font-semibold text-stone-900 dark:text-white">
        <Phone className="h-4 w-4 text-rose-500" />
        Emergency numbers
      </h3>
      <ul className="mt-4 space-y-2">
        {rows.map(({ label, value, icon: Icon }) => (
          <li key={label}>
            <a
              href={`tel:${value!.replace(/[^\d+]/g, '')}`}
              className="flex items-center justify-between rounded-xl bg-stone-50 px-3.5 py-2.5 text-sm transition-colors hover:bg-rose-50 dark:bg-stone-800/60 dark:hover:bg-rose-950/30"
            >
              <span className="flex items-center gap-2.5 text-stone-600 dark:text-stone-300">
                <Icon className="h-4 w-4 text-stone-400" />
                {label}
              </span>
              <span className="font-semibold tabular-nums text-rose-600 dark:text-rose-400">{value}</span>
            </a>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
