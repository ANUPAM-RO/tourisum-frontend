import type { Metadata } from 'next';
import ContactContent from '@/components/site/ContactContent';

export const metadata: Metadata = { title: 'Contact us' };

export default function ContactPage() {
  return <ContactContent />;
}
