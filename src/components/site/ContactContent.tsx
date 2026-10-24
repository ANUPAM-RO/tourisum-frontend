'use client';

import { useState } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { useAgency, useSiteSettings } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const inputClass =
  'w-full rounded-[10px] border border-stone-200 bg-stone-50/60 px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-[border-color,box-shadow,background-color] focus:border-orange-400 focus:bg-white focus:ring-[3px] focus:ring-orange-500/15 dark:border-stone-700 dark:bg-stone-800/60 dark:text-white';

const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400';

export default function ContactContent() {
  const { settings } = useSiteSettings();
  const agency = useAgency();
  const { contact } = settings;
  const [form, setForm] = useState({ name: '', reply: '', message: '' });
  const [error, setError] = useState('');

  const mapLink = contact.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;

  const cards = [
    { icon: Phone, label: 'Call us', value: contact.phone, href: agency.telLink },
    { icon: MessageCircle, label: 'WhatsApp', value: contact.whatsapp || contact.phone, href: agency.whatsAppLink(`Hi ${agency.name}, I have a question.`), external: true },
    { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: 'Address', value: contact.address, href: mapLink, external: true },
    { icon: Clock, label: 'Working hours', value: contact.workingHours },
  ].filter((c) => c.value);

  const messageText = () =>
    [
      `Hi ${agency.name},`,
      '',
      form.message.trim(),
      '',
      `— ${form.name.trim()}`,
      ...(form.reply.trim() ? [`Reply to: ${form.reply.trim()}`] : []),
    ].join('\n');

  const send = (via: 'whatsapp' | 'email') => {
    if (form.name.trim().length < 2 || form.message.trim().length < 5) {
      setError('Please enter your name and a message.');
      return;
    }
    setError('');
    const url = via === 'whatsapp' ? agency.whatsAppLink(messageText()) : agency.mailLink(`Enquiry from ${form.name.trim()}`, messageText());
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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

        <form onSubmit={(e) => { e.preventDefault(); send('whatsapp'); }} className="rounded-2xl bg-white p-6 shadow-sm sm:p-8 dark:bg-stone-900">
          <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-white">Send us a message</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Your message opens in WhatsApp or your email app, ready to send.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ct-name" className={labelClass}>Your name</label>
              <input id="ct-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" className={inputClass} />
            </div>
            <div>
              <label htmlFor="ct-reply" className={labelClass}>Phone or email (optional)</label>
              <input id="ct-reply" value={form.reply} onChange={(e) => setForm({ ...form, reply: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="ct-message" className={labelClass}>Message</label>
            <textarea id="ct-message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass} />
          </div>
          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button type="submit" className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white transition-colors hover:bg-emerald-700">
              <MessageCircle className="h-4 w-4" />
              Send on WhatsApp
            </button>
            <button type="button" onClick={() => send('email')} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 font-semibold text-stone-700 transition-colors hover:border-orange-300 hover:text-orange-600 dark:border-stone-700 dark:text-stone-200">
              <Mail className="h-4 w-4" />
              Send by email
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
