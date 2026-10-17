'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, CalendarCheck, CheckCircle2, Mail, MessageCircle, Phone } from 'lucide-react';
import { useBookTour } from '@/components/booking/BookTourProvider';
import SafeImage from '@/components/shared/SafeImage';
import { agency, agencyTelLink, agencyWhatsAppLink } from '@/lib/agency';
import { EASE_OUT, fadeUp, revealOnce } from './motion';

const steps = [
  { title: 'Tell us your plan', desc: 'Destination, dates and budget — takes a minute.' },
  { title: 'Get a custom itinerary', desc: 'Day-wise plan with hotels and transport.' },
  { title: 'Travel worry-free', desc: 'Everything booked, with support on the go.' },
];

export default function AgencySection() {
  const { openBooking } = useBookTour();

  return (
    <section id="book-a-tour" className="scroll-mt-20 bg-white py-20 md:py-28 dark:bg-stone-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...revealOnce}
          variants={fadeUp}
          className="grid overflow-hidden rounded-[2rem] border border-orange-200/70 bg-gradient-to-br from-orange-50 via-white to-rose-50 lg:grid-cols-[1.1fr_1fr] dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900"
        >
          <div className="p-7 sm:p-10 lg:p-14">
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
              <BadgeCheck className="h-4 w-4" />
              Recommended travel agent
            </p>
            <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-stone-900 md:text-5xl dark:text-white">
              Book your tour with a <em className="italic text-gradient-warm pr-1">local expert</em>
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-stone-600 dark:text-stone-400">
              {agency.name} plans and books complete tours across India — so you just pack your bags.
            </p>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {agency.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  {h}
                </li>
              ))}
            </ul>

            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-stone-200/80 bg-white/80 p-4 dark:border-stone-800 dark:bg-stone-950/50">
                  <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white dark:bg-orange-500">
                    {i + 1}
                  </span>
                  <p className="font-semibold text-stone-900 dark:text-white">{s.title}</p>
                  <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{s.desc}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openBooking()}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-7 font-semibold text-white shadow-lg shadow-orange-500/30 transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
              >
                <CalendarCheck className="h-5 w-5" />
                Book a tour
              </button>
              <a
                href={agencyWhatsAppLink(`Hi ${agency.name}, I'd like to plan a tour.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-6 font-semibold text-stone-800 transition-colors hover:border-emerald-400 hover:text-emerald-700 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="relative min-h-[360px] lg:min-h-full">
            <SafeImage
              src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3"
              width={1000}
              alt="Houseboat on the Kerala backwaters"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT }}
              className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/95 p-5 shadow-xl sm:inset-x-8 sm:bottom-8 dark:bg-stone-900/95"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 font-semibold text-white">
                  {agency.initials}
                </span>
                <div>
                  <p className="font-semibold text-stone-900 dark:text-white">{agency.name}</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">{agency.title}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                <a href={agencyTelLink} className="flex items-center gap-2.5 text-stone-700 hover:text-orange-600 dark:text-stone-300">
                  <Phone className="h-4 w-4 text-orange-500" />
                  {agency.phoneDisplay}
                </a>
                <a href={`mailto:${agency.email}`} className="flex items-center gap-2.5 break-all text-stone-700 hover:text-orange-600 dark:text-stone-300">
                  <Mail className="h-4 w-4 shrink-0 text-orange-500" />
                  {agency.email}
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
