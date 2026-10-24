'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, Edit, Loader2, Plus, Search, Star, Trash2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import testimonialService, { type TestimonialInput } from '@/services/testimonialService';
import type { Testimonial } from '@/types';

const emptyForm: TestimonialInput = { name: '', location: '', trip: '', rating: 5, text: '', photo: '', published: true, order: 0 };

const toForm = (t: Testimonial): TestimonialInput => ({
  name: t.name, location: t.location, trip: t.trip, rating: t.rating, text: t.text, photo: t.photo, published: t.published, order: t.order,
});

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const icon = <Star className={n <= value ? 'h-5 w-5 fill-amber-400 text-amber-400' : 'h-5 w-5 text-gray-300'} />;
        return onChange ? (
          <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} star${n > 1 ? 's' : ''}`}>{icon}</button>
        ) : (
          <span key={n}>{icon}</span>
        );
      })}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<TestimonialInput>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setReviews((await testimonialService.getAllAdmin()).data);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const set = <K extends keyof TestimonialInput>(key: K, value: TestimonialInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  const openNew = () => { setEditing(null); setForm(emptyForm); };
  const openEdit = (t: Testimonial) => { setEditing(t); setForm(toForm(t)); setDialogOpen(true); };

  const clean = (f: TestimonialInput): TestimonialInput => ({
    ...f, name: f.name.trim(), location: f.location.trim(), trip: f.trip.trim(), text: f.text.trim(), photo: f.photo.trim(), order: Number(f.order) || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.text.trim().length < 10) { toast.error('Add a name and a review of at least 10 characters'); return; }
    setSaving(true);
    try {
      if (editing) await testimonialService.update(editing._id, clean(form));
      else await testimonialService.create(clean(form));
      toast.success(editing ? 'Review updated' : 'Review added');
      setDialogOpen(false);
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save review');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (t: Testimonial) => {
    try {
      await testimonialService.update(t._id, { ...toForm(t), published: !t.published });
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (t: Testimonial) => {
    if (!confirm(`Delete the review from "${t.name}"?`)) return;
    try {
      await testimonialService.delete(t._id);
      toast.success('Review deleted');
      load();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const q = search.toLowerCase();
  const filtered = reviews.filter((t) => [t.name, t.trip, t.location, t.text].some((v) => v.toLowerCase().includes(q)));
  const publishedCount = reviews.filter((t) => t.published).length;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reviews</h1>
          <p className="text-gray-500">{publishedCount} published · shown in &ldquo;Traveller stories&rdquo; on the home page (up to 8)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button onClick={openNew} />}>
            <Plus className="h-4 w-4 mr-2" /> Add Review
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Review' : 'Add Review'}</DialogTitle>
              <DialogDescription>A customer review shown on the home page.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Customer name *"><Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Priya Sharma" required /></Field>
                <Field label="Location"><Input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Kolkata" /></Field>
              </div>
              <Field label="Tour / trip" hint="Which tour they took — shown under their name">
                <Input value={form.trip} onChange={(e) => set('trip', e.target.value)} placeholder="e.g. Kerala Backwaters & Hills" />
              </Field>
              <Field label="Rating *"><Stars value={form.rating} onChange={(v) => set('rating', v)} /></Field>
              <Field label="Review *">
                <Textarea rows={5} value={form.text} onChange={(e) => set('text', e.target.value)} placeholder="What the customer said about the trip" required />
              </Field>
              <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
                <Field label="Photo URL" hint="Optional — initials are shown when empty">
                  <Input value={form.photo} onChange={(e) => set('photo', e.target.value)} placeholder="https://..." />
                </Field>
                {form.photo && <img src={form.photo} alt="" className="mt-6 h-12 w-12 rounded-full object-cover" />}
              </div>
              <div className="grid grid-cols-2 gap-4 items-end">
                <Field label="Display order" hint="Lower numbers show first">
                  <Input type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} />
                </Field>
                <label className="flex items-center gap-2 text-sm pb-7">
                  <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} /> Published
                </label>
              </div>
              <div className="flex justify-end gap-3 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editing ? 'Update Review' : 'Add Review'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input placeholder="Search reviews..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card className="border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['Customer', 'Review', 'Rating', 'Order', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-4 px-6 text-sm font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">No reviews yet — add your first customer review.</td></tr>
                ) : (
                  filtered.map((t) => (
                    <tr key={t._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 align-top">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {t.photo ? (
                            <img src={t.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <span className="flex w-10 h-10 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">{t.name.slice(0, 1).toUpperCase()}</span>
                          )}
                          <div>
                            <p className="font-medium">{t.name}</p>
                            <p className="text-sm text-gray-500">{[t.trip, t.location].filter(Boolean).join(' · ')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-md"><p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{t.text}</p></td>
                      <td className="py-4 px-6"><Stars value={t.rating} /></td>
                      <td className="py-4 px-6 text-sm">{t.order}</td>
                      <td className="py-4 px-6">
                        <button onClick={() => togglePublished(t)}>
                          <Badge className={t.published ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}>
                            {t.published ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            {t.published ? 'Published' : 'Hidden'}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(t)} aria-label="Edit"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(t)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
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
