import React from 'react';
import Link from 'next/link';
import { CalendarCheck, Compass, Mail, MapPin, Phone } from 'lucide-react';
import { agency, agencyTelLink } from '@/lib/agency';

const FacebookIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const TwitterIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const InstagramIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
);
const YoutubeIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

const socials = [
  { label: 'Facebook', icon: FacebookIcon },
  { label: 'X (Twitter)', icon: TwitterIcon },
  { label: 'Instagram', icon: InstagramIcon },
  { label: 'YouTube', icon: YoutubeIcon },
];

const explore = [
  { href: '/states', label: 'All states' },
  { href: '/places', label: 'Tourist places' },
  { href: '/hotels', label: 'Hotels' },
  { href: '/restaurants', label: 'Restaurants' },
  { href: '/search', label: 'Search' },
  { href: '/favorites', label: 'My favorites' },
];

const states = ['West Bengal', 'Rajasthan', 'Kerala', 'Goa', 'Himachal Pradesh', 'Tamil Nadu'];

const categories = ['Hill Station', 'Beach', 'Heritage', 'Wildlife', 'Religious', 'Adventure', 'Honeymoon', 'Family Trip'];

const linkClass = 'text-sm text-stone-400 transition-colors hover:text-white';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-stone-950 text-white">
      <div className="pointer-events-none absolute -top-40 left-1/3 h-80 w-80 rounded-full bg-orange-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="mb-5 inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg shadow-orange-500/20">
                <Compass className="h-5 w-5 text-white" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                India<span className="text-orange-400">Tourism</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-stone-400">
              Discover the beauty of India. Explore destinations, plan your trips and create unforgettable memories.
            </p>
            <Link
              href="/#book-a-tour"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-[filter] hover:brightness-110"
            >
              <CalendarCheck className="h-4 w-4" />
              Book a tour with {agency.name}
            </Link>
            <div className="mt-6 flex gap-2">
              {socials.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-stone-400 transition-colors hover:border-orange-400/60 hover:bg-orange-500/10 hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Explore</h3>
            <ul className="space-y-2.5">
              {explore.map((link) => (
                <li key={link.href}><Link href={link.href} className={linkClass}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Popular states</h3>
            <ul className="space-y-2.5">
              {states.map((state) => (
                <li key={state}>
                  <Link href={`/states/${state.toLowerCase().replace(/\s+/g, '-')}`} className={linkClass}>{state}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Travel styles</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/search?category=${encodeURIComponent(category)}`}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-stone-300 transition-colors hover:border-orange-400/60 hover:text-white"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-stone-500 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <span className="flex items-center gap-2 text-stone-300">
              <MapPin className="h-4 w-4 text-orange-400" />
              Tours by {agency.name}
            </span>
            <a href={agencyTelLink} className="flex items-center gap-2 transition-colors hover:text-white">
              <Phone className="h-4 w-4 text-orange-400" />
              {agency.phoneDisplay}
            </a>
            <a href={`mailto:${agency.email}`} className="flex items-center gap-2 transition-colors hover:text-white">
              <Mail className="h-4 w-4 text-orange-400" />
              {agency.email}
            </a>
          </div>
          <p>&copy; {new Date().getFullYear()} India Tourism. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
