// Recommended travel agent shown across the site. Edit here to change contact details everywhere.
export const agency = {
  name: 'Anupam Roy',
  title: 'Travel Expert & Tour Planner',
  phone: '8250217470',
  phoneDisplay: '+91 82502 17470',
  phoneE164: '+918250217470',
  email: 'anupamroy575@gmail.com',
  initials: 'AR',
  highlights: ['Custom itineraries', 'Hotel & transport booking', 'Best-price guarantee', '24×7 on-trip support'],
};

export const agencyTelLink = `tel:${agency.phoneE164}`;

export function agencyWhatsAppLink(message: string) {
  return `https://wa.me/${agency.phoneE164.replace('+', '')}?text=${encodeURIComponent(message)}`;
}

export function agencyMailLink(subject: string, body: string) {
  return `mailto:${agency.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
