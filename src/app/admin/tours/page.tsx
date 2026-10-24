'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Edit, Eye, Loader2, Plus, Search, Star, Trash2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMapPlaces } from '@/lib/hooks';
import { durationLabel, formatINR, formatTourDate } from '@/lib/tours';
import tourService, { type TourInput } from '@/services/tourService';
import type { Tour } from '@/types';

interface DepartureRow { _id?: string; startDate: string; seatsTotal: number; seatsBooked: number }
interface DayRow { title: string; description: string; meals: string; stay: string }

interface TourForm {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  startCity: string;
  endCity: string;
  durationDays: number;
  durationNights: number;
  price: number;
  originalPrice: string;
  difficulty: Tour['difficulty'];
  groupSize: number;
  tags: string;
  coverImage: string;
  gallery: string;
  places: string[];
  departures: DepartureRow[];
  itinerary: DayRow[];
  highlights: string;
  inclusions: string;
  exclusions: string;
  thingsToCarry: string;
  featured: boolean;
  published: boolean;
}

const emptyForm: TourForm = {
  title: '', slug: '', tagline: '', description: '', startCity: '', endCity: '',
  durationDays: 5, durationNights: 4, price: 0, originalPrice: '', difficulty: 'Easy', groupSize: 15, tags: '',
  coverImage: '', gallery: '', places: [], departures: [], itinerary: [{ title: '', description: '', meals: '', stay: '' }],
  highlights: '', inclusions: '', exclusions: '', thingsToCarry: '', featured: false, published: true,
};

const lines = (text: string) => text.split('\n').map((l) => l.trim()).filter(Boolean);
const list = (text: string) => text.split(',').map((l) => l.trim()).filter(Boolean);
const slugify = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function toForm(t: Tour): TourForm {
  return {
    title: t.title, slug: t.slug, tagline: t.tagline, description: t.description, startCity: t.startCity, endCity: t.endCity,
    durationDays: t.durationDays, durationNights: t.durationNights, price: t.price, originalPrice: t.originalPrice ? String(t.originalPrice) : '',
    difficulty: t.difficulty, groupSize: t.groupSize, tags: t.tags.join(', '), coverImage: t.coverImage, gallery: t.gallery.join('\n'),
    places: t.places.map((p) => (typeof p === 'string' ? p : p._id)),
    departures: t.departures.map((d) => ({ _id: d._id, startDate: d.startDate.slice(0, 10), seatsTotal: d.seatsTotal, seatsBooked: d.seatsBooked })),
    itinerary: t.itinerary.length ? t.itinerary.map((d) => ({ title: d.title, description: d.description, meals: d.meals.join(', '), stay: d.stay })) : emptyForm.itinerary,
    highlights: t.highlights.join('\n'), inclusions: t.inclusions.join('\n'), exclusions: t.exclusions.join('\n'), thingsToCarry: t.thingsToCarry.join('\n'),
    featured: t.featured, published: t.published,
  };
}

function toInput(f: TourForm): TourInput {
  return {
    title: f.title.trim(), slug: f.slug || slugify(f.title), tagline: f.tagline.trim(), description: f.description.trim(),
    startCity: f.startCity.trim(), endCity: f.endCity.trim(), durationDays: Number(f.durationDays), durationNights: Number(f.durationNights),
    price: Number(f.price), originalPrice: f.originalPrice ? Number(f.originalPrice) : undefined, difficulty: f.difficulty,
    groupSize: Number(f.groupSize), tags: list(f.tags), coverImage: f.coverImage.trim(), gallery: lines(f.gallery), places: f.places,
    departures: f.departures.filter((d) => d.startDate).map((d) => ({ _id: d._id, startDate: d.startDate, seatsTotal: Number(d.seatsTotal) })),
    itinerary: f.itinerary.filter((d) => d.title.trim()).map((d, i) => ({ day: i + 1, title: d.title.trim(), description: d.description.trim(), meals: list(d.meals), stay: d.stay.trim() })),
    highlights: lines(f.highlights), inclusions: lines(f.inclusions), exclusions: lines(f.exclusions), thingsToCarry: lines(f.thingsToCarry),
    featured: f.featured, published: f.published,
  };
}

const today = new Date().toISOString().slice(0, 10);

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Tour | null>(null);
  const [form, setForm] = useState<TourForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [placeFilter, setPlaceFilter] = useState('');
  const { data: allPlaces = [] } = useMapPlaces();

  const load = async () => {
    try {
      setTours((await tourService.getAllAdmin()).data);
    } catch {
      toast.error('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const set = <K extends keyof TourForm>(key: K, value: TourForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const openNew = () => { setEditing(null); setForm(emptyForm); };
  const openEdit = (t: Tour) => { setEditing(t); setForm(toForm(t)); setDialogOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) { toast.error('Title and description are required'); return; }
    if (!form.itinerary.some((d) => d.title.trim())) { toast.error('Add at least one itinerary day'); return; }
    setSaving(true);
    try {
      if (editing) await tourService.update(editing._id, toInput(form));
      else await tourService.create(toInput(form));
      toast.success(editing ? 'Tour updated' : 'Tour created');
      setDialogOpen(false);
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save tour');
    } finally {
      setSaving(false);
    }
  };

  const quickUpdate = async (t: Tour, patch: Partial<TourForm>) => {
    try {
      await tourService.update(t._id, toInput({ ...toForm(t), ...patch }));
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (t: Tour) => {
    if (!confirm(`Delete "${t.title}"? Existing bookings are kept.`)) return;
    try {
      await tourService.delete(t._id);
      toast.success('Tour deleted');
      load();
    } catch {
      toast.error('Failed to delete tour');
    }
  };

  const filtered = tours.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
  const visiblePlaces = useMemo(
    () => allPlaces.filter((p) => p.name.toLowerCase().includes(placeFilter.toLowerCase())),
    [allPlaces, placeFilter]
  );

  const updateDeparture = (i: number, patch: Partial<DepartureRow>) =>
    set('departures', form.departures.map((d, j) => (j === i ? { ...d, ...patch } : d)));
  const updateDay = (i: number, patch: Partial<DayRow>) =>
    set('itinerary', form.itinerary.map((d, j) => (j === i ? { ...d, ...patch } : d)));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Group Tours</h1>
          <p className="text-gray-500">{tours.length} tours · shown in &ldquo;Your next tour with us&rdquo; and on /tours</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button onClick={openNew} />}>
            <Plus className="h-4 w-4 mr-2" /> Add New Tour
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Tour' : 'Add New Tour'}</DialogTitle>
              <DialogDescription>Departures, day-wise plan and everything shown on the tour page.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="dates">Price & Dates</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="media">Media & Places</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Tour title *">
                      <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} placeholder="e.g., Kerala Backwaters & Hills" required />
                    </Field>
                    <Field label="Slug (URL)">
                      <Input value={form.slug} onChange={(e) => set('slug', slugify(e.target.value))} />
                    </Field>
                  </div>
                  <Field label="Tagline">
                    <Input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="One line shown on cards" />
                  </Field>
                  <Field label="Description *">
                    <Textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} required />
                  </Field>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Field label="Start city"><Input value={form.startCity} onChange={(e) => set('startCity', e.target.value)} /></Field>
                    <Field label="End city"><Input value={form.endCity} onChange={(e) => set('endCity', e.target.value)} /></Field>
                    <Field label="Days *"><Input type="number" min={1} value={form.durationDays} onChange={(e) => set('durationDays', Number(e.target.value))} /></Field>
                    <Field label="Nights *"><Input type="number" min={0} value={form.durationNights} onChange={(e) => set('durationNights', Number(e.target.value))} /></Field>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Field label="Difficulty">
                      <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value as Tour['difficulty'])} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                        <option>Easy</option><option>Moderate</option><option>Challenging</option>
                      </select>
                    </Field>
                    <Field label="Tags" hint="Comma separated, e.g. Heritage, Family Trip"><Input value={form.tags} onChange={(e) => set('tags', e.target.value)} /></Field>
                    <div className="flex items-end gap-6 pb-2">
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} /> Published</label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="dates" className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Price per person (₹) *"><Input type="number" min={0} value={form.price} onChange={(e) => set('price', Number(e.target.value))} required /></Field>
                    <Field label="Original price (₹)" hint="Optional — shows a strike-through discount"><Input type="number" min={0} value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} /></Field>
                    <Field label="Default seats per departure"><Input type="number" min={1} value={form.groupSize} onChange={(e) => set('groupSize', Number(e.target.value))} /></Field>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Departure dates</label>
                      <Button type="button" variant="outline" size="sm" onClick={() => set('departures', [...form.departures, { startDate: '', seatsTotal: form.groupSize, seatsBooked: 0 }])}>
                        <Plus className="h-4 w-4 mr-1" /> Add date
                      </Button>
                    </div>
                    {form.departures.length === 0 && <p className="text-sm text-gray-500">No dates yet — the tour shows &ldquo;New dates coming soon&rdquo;.</p>}
                    <div className="space-y-2">
                      {form.departures.map((d, i) => (
                        <div key={d._id ?? `new-${i}`} className="grid grid-cols-[1fr_8rem_8rem_auto] items-center gap-3">
                          <Input type="date" min={d._id ? undefined : today} value={d.startDate} onChange={(e) => updateDeparture(i, { startDate: e.target.value })} />
                          <Input type="number" min={Math.max(1, d.seatsBooked)} value={d.seatsTotal} onChange={(e) => updateDeparture(i, { seatsTotal: Number(e.target.value) })} aria-label="Total seats" />
                          <span className="text-sm text-gray-500">{d.seatsBooked} booked</span>
                          <Button type="button" variant="ghost" size="icon" className="text-red-600" onClick={() => set('departures', form.departures.filter((_, j) => j !== i))} aria-label="Remove date">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {form.departures.some((d) => d.seatsBooked > 0) && (
                      <p className="text-xs text-gray-500 mt-2">Total seats can&apos;t go below seats already booked.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="space-y-4 mt-4">
                  {form.itinerary.map((d, i) => (
                    <div key={i} className="rounded-lg border p-4 space-y-3 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Day {i + 1}</p>
                        <Button type="button" variant="ghost" size="icon" className="text-red-600" disabled={form.itinerary.length === 1} onClick={() => set('itinerary', form.itinerary.filter((_, j) => j !== i))} aria-label="Remove day">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input value={d.title} onChange={(e) => updateDay(i, { title: e.target.value })} placeholder="Title, e.g. Arrive Kochi" />
                      <Textarea rows={3} value={d.description} onChange={(e) => updateDay(i, { description: e.target.value })} placeholder="What happens on this day" />
                      <div className="grid grid-cols-2 gap-3">
                        <Input value={d.meals} onChange={(e) => updateDay(i, { meals: e.target.value })} placeholder="Meals, e.g. Breakfast, Dinner" />
                        <Input value={d.stay} onChange={(e) => updateDay(i, { stay: e.target.value })} placeholder="Overnight stay" />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => set('itinerary', [...form.itinerary, { title: '', description: '', meals: '', stay: '' }])}>
                    <Plus className="h-4 w-4 mr-1" /> Add day
                  </Button>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <p className="text-sm text-gray-500">One item per line.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Highlights"><Textarea rows={6} value={form.highlights} onChange={(e) => set('highlights', e.target.value)} /></Field>
                    <Field label="Things to carry"><Textarea rows={6} value={form.thingsToCarry} onChange={(e) => set('thingsToCarry', e.target.value)} /></Field>
                    <Field label="Inclusions"><Textarea rows={6} value={form.inclusions} onChange={(e) => set('inclusions', e.target.value)} /></Field>
                    <Field label="Exclusions"><Textarea rows={6} value={form.exclusions} onChange={(e) => set('exclusions', e.target.value)} /></Field>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4 mt-4">
                  <Field label="Cover image URL">
                    <Input value={form.coverImage} onChange={(e) => set('coverImage', e.target.value)} placeholder="https://..." />
                  </Field>
                  {form.coverImage && <img src={form.coverImage} alt="" className="h-32 w-56 rounded-lg object-cover" />}
                  <Field label="Gallery image URLs" hint="One URL per line">
                    <Textarea rows={4} value={form.gallery} onChange={(e) => set('gallery', e.target.value)} />
                  </Field>
                  <Field label={`Places on this tour (${form.places.length} selected)`}>
                    <Input value={placeFilter} onChange={(e) => setPlaceFilter(e.target.value)} placeholder="Filter places..." className="mb-2" />
                    <div className="max-h-56 overflow-y-auto rounded-lg border p-2 grid grid-cols-2 gap-1 dark:border-gray-700">
                      {visiblePlaces.map((p) => (
                        <label key={p._id} className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                          <input
                            type="checkbox"
                            checked={form.places.includes(p._id)}
                            onChange={(e) => set('places', e.target.checked ? [...form.places, p._id] : form.places.filter((id) => id !== p._id))}
                          />
                          <span className="truncate">{p.name}</span>
                          <span className="ml-auto text-xs text-gray-400 truncate">{p.state?.name}</span>
                        </label>
                      ))}
                    </div>
                  </Field>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editing ? 'Update Tour' : 'Create Tour'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input placeholder="Search tours..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card className="border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['Tour', 'Duration', 'Price', 'Next departure', 'Featured', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-4 px-6 text-sm font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-gray-500">No tours yet</td></tr>
                ) : (
                  filtered.map((t) => {
                    const next = t.departures
                      .filter((d) => d.startDate.slice(0, 10) >= today)
                      .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
                    return (
                      <tr key={t._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {t.coverImage && <img src={t.coverImage} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                            <div><p className="font-medium">{t.title}</p><p className="text-sm text-gray-500">{t.places.length} places · {t.itinerary.length} days planned</p></div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">{durationLabel(t)}</td>
                        <td className="py-4 px-6 font-medium">{formatINR(t.price)}</td>
                        <td className="py-4 px-6 text-sm">
                          {next ? (
                            <><p>{formatTourDate(next.startDate)}</p><p className="text-xs text-gray-500">{next.seatsBooked}/{next.seatsTotal} booked</p></>
                          ) : <span className="text-gray-400">No upcoming dates</span>}
                        </td>
                        <td className="py-4 px-6">
                          <button onClick={() => quickUpdate(t, { featured: !t.featured })} aria-label="Toggle featured">
                            <Star className={t.featured ? 'h-5 w-5 fill-amber-400 text-amber-400' : 'h-5 w-5 text-gray-300'} />
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <button onClick={() => quickUpdate(t, { published: !t.published })}>
                            <Badge className={t.published ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}>
                              {t.published ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                              {t.published ? 'Published' : 'Draft'}
                            </Badge>
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => window.open(`/tours/${t.slug}`, '_blank')} aria-label="View"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => openEdit(t)} aria-label="Edit"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(t)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
