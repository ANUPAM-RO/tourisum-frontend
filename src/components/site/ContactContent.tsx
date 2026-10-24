'use client';

import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, MessageSquareText, Phone } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { useAgency, useSiteSettings } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { useBookTour } from '@/components/booking/BookTourProvider';

export default function ContactContent() {
  const { settings } = useSiteSettings();
  const agency = useAgency();
  const { contact } = settings;
  const { openBooking } = useBookTour();

  const mapLink = contact.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;

  const cards = [
    { icon: Phone, label: 'Call us', value: contact.phone, href: agency.telLink },
    { icon: MessageCircle, label: 'WhatsApp', value: contact.whatsapp || contact.phone, href: agency.whatsAppLink(`Hi ${agency.name}, I have a question.`), external: true },
    { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: 'Address', value: contact.address, href: mapLink, external: true },
    { icon: Clock, label: 'Working hours', value: contact.workingHours },
  ].filter((c) => c.value);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <PageHeader
        eyebrow="Contact us"
        title={<>Get in <em className="italic text-orange-300">touch</em></>}
        description={`Questions about a destination or want help planning a trip? ${agency.name} is happy to help.`}
        image="https://images.unsplash.com/photo-1477587458883-47145ed94245"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact us' }]}
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <div className="space-y-3">
          {cards.map(({ icon: Icon, label, value, href, external }) => {
            const body = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">{label}</span>
                  <span className="block wrap-break-word font-medium text-stone-900 dark:text-white">{value}</span>
                </span>
              </>
            );
            const cardClass = 'flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-stone-900';
            return href ? (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={cn(cardClass, 'transition-shadow hover:shadow-md')}
              >
                {body}
              </a>
            ) : (
              <div key={label} className={cardClass}>
                {body}
              </div>
            );
          })}
        </div>

        {/* The site's one query form lives in the popup; this card opens it. */}
        <div className="relative overflow-hidden rounded-2xl bg-stone-950 p-6 text-white shadow-sm sm:p-8">
          <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-orange-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-12 h-52 w-52 rounded-full bg-rose-500/20 blur-3xl" />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-300">Raise your query</p>
            <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Have a question or planning a trip?</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Send us your query about a tour, a custom trip, prices or anything else. It opens in WhatsApp or your email app, ready to send.
            </p>
            {agency.highlights.length > 0 && (
              <ul className="mt-5 space-y-2 text-sm text-white/75">
                {agency.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => openBooking()}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 font-semibold text-white shadow-lg shadow-orange-500/30 transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
              >
                <MessageSquareText className="h-4 w-4" />
                Raise a query
              </button>
              <a
                href={agency.whatsAppLink(`Hi ${agency.name}, I have a question.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white/10 font-semibold text-white transition-colors hover:bg-white/20"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
