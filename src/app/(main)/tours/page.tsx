import type { Metadata } from 'next';
import ToursContent from '@/components/tours/ToursContent';

export const metadata: Metadata = { title: 'Group tours' };

export default function ToursPage() {
  return <ToursContent />;
}
