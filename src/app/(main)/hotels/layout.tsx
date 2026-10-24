import { notFound } from 'next/navigation';
import { SHOW_STAYS } from '@/lib/features';

// Hotels & restaurants are switched off in lib/features.ts; their pages return 404 until re-enabled.
export default function StaysLayout({ children }: { children: React.ReactNode }) {
  if (!SHOW_STAYS) notFound();
  return children;
}
