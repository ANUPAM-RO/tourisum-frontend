'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, MapPin } from 'lucide-react';
import BrandName from '@/components/shared/BrandName';
import SafeImage from '@/components/shared/SafeImage';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

interface AuthShellProps {
  image: string;
  imageCaption: string;
  tagline: React.ReactNode;
  taglineSub: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

function Logo({ light }: { light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 shadow-md shadow-orange-500/30 transition-transform duration-300 group-hover:scale-105">
        <Compass className="h-5 w-5 text-white" />
      </span>
      <span className={`text-[15px] font-bold tracking-tight ${light ? 'text-white' : 'text-stone-900 dark:text-white'}`}>
        <BrandName accentClassName={light ? 'text-orange-300' : 'text-orange-500'} />
      </span>
    </Link>
  );
}

/** Split-screen layout for login / register: travel photo on the left, form on the right. */
export default function AuthShell({ image, imageCaption, tagline, taglineSub, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-stone-950">
      {/* Photo panel (desktop) */}
      <aside className="relative isolate hidden w-[46%] max-w-[760px] overflow-hidden bg-stone-950 lg:flex lg:flex-col lg:justify-between">
        <SafeImage src={image} width={1400} priority alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/45" />

        <div className="p-10">
          <Logo light />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="p-10 pb-12 text-white"
        >
          <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight xl:text-5xl">{tagline}</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">{taglineSub}</p>
          <p className="mt-8 flex items-center gap-1.5 text-sm text-white/60">
            <MapPin className="h-3.5 w-3.5" />
            {imageCaption}
          </p>
        </motion.div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 flex-col">
        {/* Mobile banner */}
        <div className="relative isolate h-44 overflow-hidden bg-stone-950 sm:h-52 lg:hidden">
          <SafeImage src={image} width={900} priority alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
          <div className="flex h-full flex-col justify-between p-5">
            <div className="flex items-center justify-between">
              <Logo light />
              <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/85 transition-colors hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Home
              </Link>
            </div>
            <p className="font-display text-2xl font-semibold tracking-tight text-white">{tagline}</p>
          </div>
        </div>

        <div className="hidden justify-end p-6 lg:flex">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:py-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="w-full max-w-md"
          >
            <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">{title}</h1>
            <p className="mt-2 text-stone-500 dark:text-stone-400">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-8 border-t border-stone-200 pt-6 text-center text-sm text-stone-500 dark:border-stone-800 dark:text-stone-400">
              {footer}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
