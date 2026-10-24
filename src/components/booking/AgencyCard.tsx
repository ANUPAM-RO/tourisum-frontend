'use client';

import { BadgeCheck, Mail, MessageCircle, MessageSquareText, Phone } from 'lucide-react';
import { useAgency } from '@/lib/hooks';
import { useBookTour } from './BookTourProvider';

interface AgencyCardProps {
  /** Destination name used to pre-fill the enquiry. */
  destination?: string;
  className?: string;
}

/** Compact "recommended travel agent" card for detail-page sidebars. */
export default function AgencyCard({ destination, className = '' }: AgencyCardProps) {
  const agency = useAgency();
  const { openBooking } = useBookTour();
  const waText = destination
    ? `Hi ${agency.name}, I'm interested in a tour to ${destination}. Please share details.`
    : `Hi ${agency.name}, I'd like to plan a tour.`;

  return (
    <div className={`overflow-hidden rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50 via-white to-rose-50 p-5 dark:border-orange-900/40 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 ${className}`}>
      <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
        <BadgeCheck className="h-4 w-4" />
        Recommended travel agent
      </p>
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 font-semibold text-white shadow-md shadow-orange-500/20">
          {agency.initials}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-stone-900 dark:text-white">{agency.name}</p>
          <p className="text-sm text-stone-500 dark:text-stone-400">{agency.title}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        {destination ? `Planning a trip to ${destination}? ` : ''}Get a custom itinerary, hotels and transport booked at the best price.
      </p>

      <button
        type="button"
        onClick={() => openBooking(destination)}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 font-semibold text-white shadow-md shadow-orange-500/25 transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
      >
        <MessageSquareText className="h-4 w-4" />
        Raise a query
      </button>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <a href={agency.telLink} className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white text-sm font-medium text-stone-700 transition-colors hover:border-orange-300 hover:text-orange-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200" aria-label={`Call ${agency.name}`}>
          <Phone className="h-4 w-4" /> Call
        </a>
        <a href={agency.whatsAppLink(waText)} target="_blank" rel="noopener noreferrer" className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white text-sm font-medium text-stone-700 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200" aria-label={`WhatsApp ${agency.name}`}>
          <MessageCircle className="h-4 w-4" /> Chat
        </a>
        <a href={`mailto:${agency.email}`} className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white text-sm font-medium text-stone-700 transition-colors hover:border-orange-300 hover:text-orange-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200" aria-label={`Email ${agency.name}`}>
          <Mail className="h-4 w-4" /> Email
        </a>
      </div>
      <p className="mt-3 text-center text-xs text-stone-500 dark:text-stone-400">{agency.phoneDisplay}</p>
    </div>
  );
}
