import type { SiteSettings } from '@/types';

// Shown until the admin-managed settings load from the API (and if the API is unreachable).
export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'India Tourism',
  tagline: 'Discover India',
  description: 'Discover the beauty of India. Explore destinations, plan your trips and create unforgettable memories.',
  contact: {
    agentName: 'Anupam Roy',
    agentTitle: 'Travel Expert & Tour Planner',
    phone: '+91 82502 17470',
    whatsapp: '+91 82502 17470',
    email: 'anupamroy575@gmail.com',
    address: 'Kolkata, West Bengal, India',
    workingHours: 'Mon–Sat, 9:00 AM – 8:00 PM',
    mapUrl: '',
  },
  highlights: ['Custom itineraries', 'Hotel & transport booking', 'Best-price guarantee', '24×7 on-trip support'],
  about: {
    heading: 'Helping you discover Incredible India',
    intro: 'We are a small team of travellers who love India and want to help you explore it — from Himalayan passes to Kerala backwaters.',
    story:
      'What started as a passion for travel has become a complete travel guide covering states, cities and tourist places across India. We combine honest information with personal trip planning so you can travel with confidence.',
    mission: 'Make travel across India simple, affordable and memorable for everyone.',
    vision: 'To be the most trusted companion for exploring every corner of India.',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da',
  },
  social: { facebook: '', instagram: '', twitter: '', youtube: '' },
};

/** Fills any missing fields from the defaults so the UI never renders `undefined`. */
export function withDefaults(settings?: Partial<SiteSettings> | null): SiteSettings {
  if (!settings) return DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    contact: { ...DEFAULT_SETTINGS.contact, ...settings.contact },
    about: { ...DEFAULT_SETTINGS.about, ...settings.about },
    social: { ...DEFAULT_SETTINGS.social, ...settings.social },
    highlights: settings.highlights?.length ? settings.highlights : DEFAULT_SETTINGS.highlights,
  };
}

/** Phone numbers are stored as typed; a bare 10-digit number is assumed to be Indian. */
function internationalDigits(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
}

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

/** The travel agent's details and contact links, derived from the site settings. */
export function agencyFrom(settings: SiteSettings) {
  const { agentName, agentTitle, phone, whatsapp, email } = settings.contact;
  return {
    name: agentName,
    title: agentTitle,
    phoneDisplay: phone,
    email,
    initials: initialsOf(agentName),
    highlights: settings.highlights,
    telLink: `tel:+${internationalDigits(phone)}`,
    whatsAppLink: (message: string) =>
      `https://wa.me/${internationalDigits(whatsapp || phone)}?text=${encodeURIComponent(message)}`,
    mailLink: (subject: string, body: string) =>
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

export type Agency = ReturnType<typeof agencyFrom>;
