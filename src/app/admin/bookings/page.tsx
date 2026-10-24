'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Mail, MessageCircle, Phone, Search, StickyNote, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatINR, formatTourDate, roomsSummary } from '@/lib/tours';
import { bookingService } from '@/services/tourService';
import type { Booking, BookingStatus } from '@/types';

const iconLink = buttonVariants({ variant: 'ghost', size: 'icon' });

const STATUSES: (BookingStatus | 'all')[] = ['all', 'pending', 'confirmed', 'cancelled'];

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const waLink = (phone: string, text: string) => {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}?text=${encodeURIComponent(text)}`;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<BookingStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    try {
      setBookings((await bookingService.getAll()).data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: bookings.length };
    bookings.forEach((b) => { c[b.status] = (c[b.status] ?? 0) + 1; });
    return c;
  }, [bookings]);

  const filtered = bookings.filter((b) => {
    if (status !== 'all' && b.status !== status) return false;
    const q = search.trim().toLowerCase();
    return !q || [b.reference, b.name, b.email, b.phone, b.tourTitle].some((v) => v.toLowerCase().includes(q));
  });

  const update = async (b: Booking, patch: { status?: BookingStatus; adminNote?: string }) => {
    setBusyId(b._id);
    try {
      const res = await bookingService.update(b._id, patch);
      setBookings((list) => list.map((x) => (x._id === b._id ? { ...x, ...res.data, tour: x.tour } : x)));
      if (patch.status) toast.success(`Booking ${b.reference} marked ${patch.status}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setBusyId(null);
    }
  };

  const editNote = (b: Booking) => {
    const note = window.prompt(`Internal note for ${b.reference}`, b.adminNote);
    if (note !== null) update(b, { adminNote: note });
  };

  const remove = async (b: Booking) => {
    if (!confirm(`Delete booking ${b.reference}? Its seats will be released.`)) return;
    try {
      await bookingService.delete(b._id);
      setBookings((list) => list.filter((x) => x._id !== b._id));
      toast.success('Booking deleted');
    } catch {
      toast.error('Failed to delete booking');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tour Bookings</h1>
        <p className="text-gray-500">Confirm or cancel bookings — seats are released automatically when a booking is cancelled.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors',
                status === s ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-200 hover:border-orange-300 dark:border-gray-700'
              )}
            >
              {s} <span className="opacity-70">({counts[s] ?? 0})</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search by name, phone, email, reference or tour..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Card className="border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['Booking', 'Customer', 'Tour & date', 'Travellers', 'Total', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-4 px-6 text-sm font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-gray-500">No bookings found</td></tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b._id} className="border-t align-top dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-6">
                        <p className="whitespace-nowrap font-mono text-sm font-semibold">{b.reference}</p>
                        <p className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      </td>
                      <td className="py-4 px-6 max-w-[16rem]">
                        <p className="font-medium">{b.name}</p>
                        <p className="text-sm text-gray-500">{b.phone}</p>
                        <p className="text-sm text-gray-500 truncate">{b.email}</p>
                        {b.message && <p className="mt-1 text-xs italic text-gray-500 line-clamp-2">&ldquo;{b.message}&rdquo;</p>}
                        {b.adminNote && <p className="mt-1 text-xs text-orange-700 line-clamp-2">Note: {b.adminNote}</p>}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-sm">{b.tourTitle}</p>
                        <p className="text-sm text-gray-500">{formatTourDate(b.departureDate, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        {b.adults} adult{b.adults > 1 ? 's' : ''}{b.children ? <><br />{b.children} child{b.children > 1 ? 'ren' : ''}</> : null}
                        {b.rooms && <p className="mt-1 text-xs text-gray-500">Rooms: {roomsSummary(b.rooms)} people</p>}
                      </td>
                      <td className="py-4 px-6 font-semibold">{formatINR(b.totalPrice)}</td>
                      <td className="py-4 px-6">
                        <select
                          value={b.status}
                          disabled={busyId === b._id}
                          onChange={(e) => update(b, { status: e.target.value as BookingStatus })}
                          className={cn('rounded-full border-0 px-3 py-1 text-sm font-medium capitalize', STATUS_STYLES[b.status])}
                          aria-label={`Status of ${b.reference}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-1">
                          <a href={`tel:${b.phone.replace(/[^\d+]/g, '')}`} aria-label="Call" className={iconLink}><Phone className="h-4 w-4" /></a>
                          <a
                            href={waLink(b.phone, `Hi ${b.name}, this is about your booking ${b.reference} for "${b.tourTitle}" on ${formatTourDate(b.departureDate)}.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            className={cn(iconLink, 'text-emerald-600')}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                          <a href={`mailto:${b.email}?subject=${encodeURIComponent(`Your booking ${b.reference} — ${b.tourTitle}`)}`} aria-label="Email" className={iconLink}><Mail className="h-4 w-4" /></a>
                          <Button variant="ghost" size="icon" onClick={() => editNote(b)} aria-label="Add note"><StickyNote className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => remove(b)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
