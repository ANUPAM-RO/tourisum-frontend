import type { Metadata } from 'next';
import AboutContent from '@/components/site/AboutContent';

export const metadata: Metadata = { title: 'About us' };

export default function AboutPage() {
  return <AboutContent />;
}
