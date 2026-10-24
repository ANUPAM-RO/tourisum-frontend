'use client';

import Link from 'next/link';
import { CheckCircle2, Eye, Mail, MessageSquareText, Target } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { useBookTour } from '@/components/booking/BookTourProvider';
import { useAgency, useSiteSettings } from '@/lib/hooks';

const paragraphs = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export default function AboutContent() {
  const { settings } = useSiteSettings();
  const agency = useAgency();
  const { openBooking } = useBookTour();
  const { about } = settings;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <PageHeader
        eyebrow={`About ${settings.siteName}`}
        title={about.heading}
        description={about.intro}
        image={about.image}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About us' }]}
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-stone-900 dark:text-white">Our story</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-stone-600 dark:text-stone-400">
            {paragraphs(about.story).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {settings.highlights.length > 0 && (
            <>
              <h3 className="mt-10 text-xl font-semibold text-stone-900 dark:text-white">What we offer</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {settings.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2.5 rounded-xl bg-white p-4 text-stone-700 shadow-sm dark:bg-stone-900 dark:text-stone-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="space-y-5">
          {about.mission && (
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-stone-900">
              <Target className="h-7 w-7 text-orange-500" />
              <h3 className="mt-3 text-lg font-semibold text-stone-900 dark:text-white">Our mission</h3>
              <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-400">{about.mission}</p>
            </div>
          )}
          {about.vision && (
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-stone-900">
              <Eye className="h-7 w-7 text-rose-500" />
              <h3 className="mt-3 text-lg font-semibold text-stone-900 dark:text-white">Our vision</h3>
              <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-400">{about.vision}</p>
            </div>
          )}

          <div className="rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50 via-white to-rose-50 p-6 dark:border-orange-900/40 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 font-semibold text-white">
                {agency.initials}
              </span>
              <div>
                <p className="font-semibold text-stone-900 dark:text-white">{agency.name}</p>
                <p className="text-sm text-stone-500 dark:text-stone-400">{agency.title}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => openBooking()}
                className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-sm font-semibold text-white transition-[filter] hover:brightness-110"
              >
                <MessageSquareText className="h-4 w-4" />
                Raise a query
              </button>
              <Link
                href="/contact"
                className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white text-sm font-medium text-stone-700 transition-colors hover:border-orange-300 hover:text-orange-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
              >
                <Mail className="h-4 w-4" />
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
