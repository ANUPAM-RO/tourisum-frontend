'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Edit, Trash2, Eye, MapPin, CheckCircle, XCircle, Loader2,
  Upload, X, Sun, Cloud, Droplets, Plane, Train, Bus, Car, Bike, Wallet,
  Shield, FileText, Tag, Star, MessageSquare, HelpCircle, Navigation, UtensilsCrossed,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import api from '@/lib/api';

const CATEGORIES = ['Hill Station', 'Beach', 'Heritage', 'Wildlife', 'Religious', 'Adventure', 'Honeymoon', 'Family Trip'];

interface PlaceItem {
  _id: string;
  name: string;
  slug: string;
  state: any;
  city: any;
  description: string;
  images: string[];
  videos: string[];
  location: { latitude: number; longitude: number };
  category: string[];
  bestTimeToVisit: string;
  openingTime: string;
  closingTime: string;
  entryFee: string;
  history: string;
  highlights: string[];
  thingsToKnow: string[];
  photography: boolean;
  weather: { summer: string; winter: string; monsoon: string };
  safetyTips: string[];
  transportation: any;
  estimatedCost: any;
  localFoods: string[];
  travelTips: { dos: string[]; donts: string[]; safety: string[] };
  localLanguage: string;
  emergencyNumbers: { police: string; ambulance: string; fire: string };
  faqs: { question: string; answer: string }[];
  rating: number;
  published: boolean;
  seo: any;
}

const emptyPlace = {
  name: '', slug: '', state: '', city: '', description: '', images: [] as string[], videos: [] as string[],
  location: { latitude: 0, longitude: 0 },
  category: [] as string[],
  bestTimeToVisit: '', openingTime: '', closingTime: '', entryFee: '',
  history: '', highlights: [] as string[], thingsToKnow: [] as string[],
  photography: true,
  weather: { summer: '', winter: '', monsoon: '' },
  safetyTips: [] as string[],
  transportation: {
    byFlight: { nearestAirport: '', distance: '', cabCost: '' },
    byTrain: { nearestStation: '', distance: '', taxiFare: '' },
    byBus: { busStand: '', autoFare: '' },
    privateCab: '', bikeRental: '',
  },
  estimatedCost: {
    budget: { hotel: '', food: '', travel: '', tickets: '', shopping: '', total: '' },
    standard: { hotel: '', food: '', travel: '', tickets: '', shopping: '', total: '' },
    luxury: { hotel: '', food: '', travel: '', tickets: '', shopping: '', total: '' },
  },
  localFoods: [] as string[],
  travelTips: { dos: [] as string[], donts: [] as string[], safety: [] as string[] },
  localLanguage: '',
  emergencyNumbers: { police: '', ambulance: '', fire: '' },
  faqs: [] as { question: string; answer: string }[],
  rating: 0,
  seo: { title: '', metaDescription: '', keywords: [] as string[] },
};

export default function AdminPlacesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<PlaceItem | null>(null);
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyPlace);
  const [uploading, setUploading] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');
  const [tipInput, setTipInput] = useState('');
  const [safetyTipInput, setSafetyTipInput] = useState('');
  const [foodInput, setFoodInput] = useState('');
  const [faqInputs, setFaqInputs] = useState({ question: '', answer: '' });
  const [keywordInput, setKeywordInput] = useState('');
  const [videoInput, setVideoInput] = useState('');

  const fetchData = async () => {
    try {
      const [placesRes, statesRes, citiesRes] = await Promise.all([
        api.get('/places?limit=100'),
        api.get('/states?limit=50'),
        api.get('/cities?limit=100'),
      ]);
      setPlaces(placesRes.data.data || []);
      setStates(statesRes.data.data || []);
      setCities(citiesRes.data.data || []);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (e: any) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;
      setUploading(true);
      try {
        const fd = new FormData();
        files.forEach((f: any) => fd.append('images', f));
        const res = await api.post('/upload/multiple', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res.data.success) {
          const urls = res.data.data.map((img: any) => img.url);
          setFormData({ ...formData, images: [...formData.images, ...urls] });
          toast.success(`${urls.length} images uploaded!`);
        }
      } catch { toast.error('Upload failed'); }
      finally { setUploading(false); }
    };
    input.click();
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData({ ...formData, highlights: [...formData.highlights, highlightInput.trim()] });
      setHighlightInput('');
    }
  };

  const addThingToKnow = () => {
    if (tipInput.trim()) {
      setFormData({ ...formData, thingsToKnow: [...formData.thingsToKnow, tipInput.trim()] });
      setTipInput('');
    }
  };

  const addSafetyTip = () => {
    if (safetyTipInput.trim()) {
      setFormData({ ...formData, safetyTips: [...formData.safetyTips, safetyTipInput.trim()] });
      setSafetyTipInput('');
    }
  };

  const addFood = () => {
    if (foodInput.trim()) {
      setFormData({ ...formData, localFoods: [...formData.localFoods, foodInput.trim()] });
      setFoodInput('');
    }
  };

  const addFaq = () => {
    if (faqInputs.question.trim() && faqInputs.answer.trim()) {
      setFormData({ ...formData, faqs: [...formData.faqs, { ...faqInputs }] });
      setFaqInputs({ question: '', answer: '' });
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData({ ...formData, seo: { ...formData.seo, keywords: [...formData.seo.keywords, keywordInput.trim()] } });
      setKeywordInput('');
    }
  };

  const addVideo = () => {
    if (videoInput.trim()) {
      let url = videoInput.trim();
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        url = `https://www.youtube.com/embed/${videoId}`;
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        url = `https://www.youtube.com/embed/${videoId}`;
      }
      setFormData({ ...formData, videos: [...formData.videos, url] });
      setVideoInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, state: formData.state || editingPlace?.state?._id, city: formData.city || editingPlace?.city?._id };
      if (editingPlace) {
        await api.put(`/places/${editingPlace._id}`, payload);
        toast.success('Place updated!');
      } else {
        await api.post('/places', { ...payload, published: true });
        toast.success('Place added!');
      }
      setDialogOpen(false);
      setEditingPlace(null);
      setFormData(emptyPlace);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save place');
    } finally { setSaving(false); }
  };

  const handleEdit = (place: PlaceItem) => {
    setEditingPlace(place);
    setFormData({
      name: place.name, slug: place.slug, state: place.state?._id || '', city: place.city?._id || '',
      description: place.description || '', images: place.images || [], videos: place.videos || [],
      location: place.location || { latitude: 0, longitude: 0 },
      category: place.category || [],
      bestTimeToVisit: place.bestTimeToVisit || '', openingTime: place.openingTime || '', closingTime: place.closingTime || '',
      entryFee: place.entryFee || '', history: place.history || '',
      highlights: place.highlights || [], thingsToKnow: place.thingsToKnow || [],
      photography: place.photography !== false,
      weather: place.weather || { summer: '', winter: '', monsoon: '' },
      safetyTips: place.safetyTips || [],
      transportation: place.transportation || emptyPlace.transportation,
      estimatedCost: place.estimatedCost || emptyPlace.estimatedCost,
      localFoods: place.localFoods || [],
      travelTips: place.travelTips || { dos: [], donts: [], safety: [] },
      localLanguage: place.localLanguage || '',
      emergencyNumbers: place.emergencyNumbers || { police: '', ambulance: '', fire: '' },
      faqs: place.faqs || [],
      rating: place.rating || 0,
      seo: place.seo || { title: '', metaDescription: '', keywords: [] },
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this place?')) return;
    try { await api.delete(`/places/${id}`); toast.success('Deleted!'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try { await api.put(`/places/${id}`, { published: !currentStatus }); fetchData(); }
    catch { toast.error('Failed to update'); }
  };

  const filteredPlaces = places.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.state?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCities = formData.state ? cities.filter((c) => c.state?._id === formData.state || c.state === formData.state) : cities;

  const CostSection = ({ title, cost, type }: { title: string; cost: any; type: string }) => (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold mb-3 capitalize">{title}</h4>
      <div className="grid grid-cols-3 gap-3">
        {['hotel', 'food', 'travel', 'tickets', 'shopping', 'total'].map((field) => (
          <div key={field}>
            <label className="text-xs text-gray-500 capitalize">{field}</label>
            <Input value={cost?.[field] || ''} onChange={(e) => setFormData({
              ...formData, estimatedCost: { ...formData.estimatedCost, [type]: { ...formData.estimatedCost[type as keyof typeof formData.estimatedCost], [field]: e.target.value } }
            })} placeholder="0" className="h-8 text-sm" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Tourist Places</h1>
          <p className="text-gray-500">{places.length} total places</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) { setEditingPlace(null); setFormData(emptyPlace); }
        }}>
          <DialogTrigger>
            <Button onClick={() => setEditingPlace(null)}>
              <Plus className="h-4 w-4 mr-2" /> Add New Place
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlace ? 'Edit Place' : 'Add New Tourist Place'}</DialogTitle>
              <DialogDescription>Fill in all details for the tourist spot</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="transport">Transport</TabsTrigger>
                  <TabsTrigger value="cost">Cost</TabsTrigger>
                  <TabsTrigger value="more">More</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Place Name *</label>
                      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })} placeholder="e.g., Taj Mahal" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Slug</label>
                      <Input value={formData.slug} readOnly className="bg-gray-100" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">State *</label>
                      <Select value={formData.state} onValueChange={(v) => v && setFormData({ ...formData, state: v, city: '' })}>
                        <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                        <SelectContent>{states.map((s) => (<SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">City *</label>
                      <Select value={formData.city} onValueChange={(v) => v && setFormData({ ...formData, city: v })}>
                        <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                        <SelectContent>{filteredCities.map((c) => (<SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <Badge key={cat} variant={formData.category.includes(cat) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => {
                          setFormData({ ...formData, category: formData.category.includes(cat) ? formData.category.filter((c) => c !== cat) : [...formData.category, cat] });
                        }}>{cat}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description *</label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the place..." rows={3} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Latitude</label>
                      <Input type="number" step="any" value={formData.location.latitude || ''} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, latitude: parseFloat(e.target.value) || 0 } })} placeholder="27.1751" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Longitude</label>
                      <Input type="number" step="any" value={formData.location.longitude || ''} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, longitude: parseFloat(e.target.value) || 0 } })} placeholder="78.0421" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Images</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.images.map((img, i) => (
                        <div key={i} className="relative">
                          <img src={img} alt="" className="w-24 h-16 object-cover rounded" />
                          <button type="button" onClick={() => setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) })} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X className="h-3 w-3" /></button>
                        </div>
                      ))}
                    </div>
                    <Button type="button" variant="outline" onClick={handleImageUpload} disabled={uploading}>
                      <Upload className="h-4 w-4 mr-2" /> Upload Images
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">YouTube Videos</label>
                    <div className="flex gap-2 mb-2">
                      <Input value={videoInput} onChange={(e) => setVideoInput(e.target.value)} placeholder="Paste YouTube URL (e.g., https://youtube.com/watch?v=...)" />
                      <Button type="button" onClick={addVideo} size="sm">Add</Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {formData.videos.map((video, i) => {
                        const videoId = video.includes('embed/') ? video.split('embed/')[1]?.split('?')[0] : '';
                        return (
                          <div key={i} className="relative rounded-lg overflow-hidden">
                            <iframe
                              src={video}
                              className="w-full aspect-video"
                              allowFullScreen
                              title={`Video ${i + 1}`}
                            />
                            <button type="button" onClick={() => setFormData({ ...formData, videos: formData.videos.filter((_, idx) => idx !== i) })} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X className="h-3 w-3" /></button>
                          </div>
                        );
                      })}
                    </div>
                    {formData.videos.length === 0 && (
                      <p className="text-sm text-gray-500 mt-2">No videos added yet. Paste a YouTube URL above to add.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Entry Fee</label>
                      <Input value={formData.entryFee} onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })} placeholder="50 or Free" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Opening Time</label>
                      <Input value={formData.openingTime} onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })} placeholder="6:00 AM" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Closing Time</label>
                      <Input value={formData.closingTime} onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })} placeholder="6:00 PM" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Best Time to Visit</label>
                    <Input value={formData.bestTimeToVisit} onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })} placeholder="October to March" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.photography} onCheckedChange={(v) => setFormData({ ...formData, photography: v })} />
                    <label className="text-sm font-medium">Photography Allowed</label>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">History</label>
                    <Textarea value={formData.history} onChange={(e) => setFormData({ ...formData, history: e.target.value })} placeholder="Historical background..." rows={3} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Highlights</label>
                    <div className="flex gap-2 mb-2">
                      <Input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} placeholder="Add highlight..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }} />
                      <Button type="button" onClick={addHighlight} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.highlights.map((h, i) => (<Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => setFormData({ ...formData, highlights: formData.highlights.filter((_, idx) => idx !== i) })}>{h} <X className="h-3 w-3 ml-1" /></Badge>))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Things to Know</label>
                    <div className="flex gap-2 mb-2">
                      <Input value={tipInput} onChange={(e) => setTipInput(e.target.value)} placeholder="Add tip..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addThingToKnow(); } }} />
                      <Button type="button" onClick={addThingToKnow} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.thingsToKnow.map((t, i) => (<Badge key={i} variant="outline" className="cursor-pointer" onClick={() => setFormData({ ...formData, thingsToKnow: formData.thingsToKnow.filter((_, idx) => idx !== i) })}>{t} <X className="h-3 w-3 ml-1" /></Badge>))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="transport" className="space-y-4 mt-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><Plane className="h-4 w-4" /> By Flight</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <Input placeholder="Nearest airport" value={formData.transportation.byFlight.nearestAirport} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, byFlight: { ...formData.transportation.byFlight, nearestAirport: e.target.value } } })} />
                      <Input placeholder="Distance" value={formData.transportation.byFlight.distance} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, byFlight: { ...formData.transportation.byFlight, distance: e.target.value } } })} />
                      <Input placeholder="Cab cost" value={formData.transportation.byFlight.cabCost} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, byFlight: { ...formData.transportation.byFlight, cabCost: e.target.value } } })} />
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><Train className="h-4 w-4" /> By Train</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <Input placeholder="Nearest station" value={formData.transportation.byTrain.nearestStation} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, byTrain: { ...formData.transportation.byTrain, nearestStation: e.target.value } } })} />
                      <Input placeholder="Distance" value={formData.transportation.byTrain.distance} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, byTrain: { ...formData.transportation.byTrain, distance: e.target.value } } })} />
                      <Input placeholder="Taxi fare" value={formData.transportation.byTrain.taxiFare} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, byTrain: { ...formData.transportation.byTrain, taxiFare: e.target.value } } })} />
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><Bus className="h-4 w-4" /> By Bus</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Bus stand" value={formData.transportation.byBus.busStand} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, byBus: { ...formData.transportation.byBus, busStand: e.target.value } } })} />
                      <Input placeholder="Auto fare" value={formData.transportation.byBus.autoFare} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, byBus: { ...formData.transportation.byBus, autoFare: e.target.value } } })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Car className="h-4 w-4" /> Private Cab</label>
                      <Input value={formData.transportation.privateCab} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, privateCab: e.target.value } })} placeholder="₹2000/day" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Bike className="h-4 w-4" /> Bike Rental</label>
                      <Input value={formData.transportation.bikeRental} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, bikeRental: e.target.value } })} placeholder="500/day" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cost" className="space-y-4 mt-4">
                  <CostSection title="Budget Traveller" cost={formData.estimatedCost.budget} type="budget" />
                  <CostSection title="Standard Traveller" cost={formData.estimatedCost.standard} type="standard" />
                  <CostSection title="Luxury Traveller" cost={formData.estimatedCost.luxury} type="luxury" />
                </TabsContent>

                <TabsContent value="more" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Weather</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div><label className="text-xs text-gray-500">Summer</label><Input value={formData.weather.summer} onChange={(e) => setFormData({ ...formData, weather: { ...formData.weather, summer: e.target.value } })} placeholder="30°C - 40°C" /></div>
                      <div><label className="text-xs text-gray-500">Winter</label><Input value={formData.weather.winter} onChange={(e) => setFormData({ ...formData, weather: { ...formData.weather, winter: e.target.value } })} placeholder="10°C - 25°C" /></div>
                      <div><label className="text-xs text-gray-500">Monsoon</label><Input value={formData.weather.monsoon} onChange={(e) => setFormData({ ...formData, weather: { ...formData.weather, monsoon: e.target.value } })} placeholder="25°C - 35°C" /></div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Shield className="h-4 w-4" /> Safety Tips</label>
                    <div className="flex gap-2 mb-2">
                      <Input value={safetyTipInput} onChange={(e) => setSafetyTipInput(e.target.value)} placeholder="Add safety tip..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSafetyTip(); } }} />
                      <Button type="button" onClick={addSafetyTip} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.safetyTips.map((s, i) => (<Badge key={i} variant="outline" className="cursor-pointer" onClick={() => setFormData({ ...formData, safetyTips: formData.safetyTips.filter((_, idx) => idx !== i) })}>{s} <X className="h-3 w-3 ml-1" /></Badge>))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center gap-1"><UtensilsCrossed className="h-4 w-4" /> Local Foods</label>
                    <div className="flex gap-2 mb-2">
                      <Input value={foodInput} onChange={(e) => setFoodInput(e.target.value)} placeholder="Add food..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFood(); } }} />
                      <Button type="button" onClick={addFood} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.localFoods.map((f, i) => (<Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => setFormData({ ...formData, localFoods: formData.localFoods.filter((_, idx) => idx !== i) })}>{f} <X className="h-3 w-3 ml-1" /></Badge>))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Local Language</label>
                      <Input value={formData.localLanguage} onChange={(e) => setFormData({ ...formData, localLanguage: e.target.value })} placeholder="Hindi, Bengali" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Rating (0-5)</label>
                      <Input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-1"><Shield className="h-4 w-4" /> Emergency Numbers</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div><label className="text-xs text-gray-500">Police</label><Input value={formData.emergencyNumbers.police} onChange={(e) => setFormData({ ...formData, emergencyNumbers: { ...formData.emergencyNumbers, police: e.target.value } })} placeholder="100" /></div>
                      <div><label className="text-xs text-gray-500">Ambulance</label><Input value={formData.emergencyNumbers.ambulance} onChange={(e) => setFormData({ ...formData, emergencyNumbers: { ...formData.emergencyNumbers, ambulance: e.target.value } })} placeholder="108" /></div>
                      <div><label className="text-xs text-gray-500">Fire</label><Input value={formData.emergencyNumbers.fire} onChange={(e) => setFormData({ ...formData, emergencyNumbers: { ...formData.emergencyNumbers, fire: e.target.value } })} placeholder="101" /></div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-1"><HelpCircle className="h-4 w-4" /> FAQs</label>
                    <div className="space-y-2 mb-2">
                      <Input value={faqInputs.question} onChange={(e) => setFaqInputs({ ...faqInputs, question: e.target.value })} placeholder="Question..." />
                      <Textarea value={faqInputs.answer} onChange={(e) => setFaqInputs({ ...faqInputs, answer: e.target.value })} placeholder="Answer..." rows={2} />
                      <Button type="button" onClick={addFaq} size="sm">Add FAQ</Button>
                    </div>
                    <div className="space-y-2">
                      {formData.faqs.map((faq, i) => (
                        <div key={i} className="flex justify-between items-start p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div>
                            <p className="font-medium text-sm">{faq.question}</p>
                            <p className="text-xs text-gray-500">{faq.answer}</p>
                          </div>
                          <button type="button" onClick={() => setFormData({ ...formData, faqs: formData.faqs.filter((_, idx) => idx !== i) })}><X className="h-4 w-4 text-red-500" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Tag className="h-4 w-4" /> SEO Keywords</label>
                    <div className="flex gap-2 mb-2">
                      <Input value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} placeholder="Add keyword..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }} />
                      <Button type="button" onClick={addKeyword} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.seo.keywords.map((kw) => (<Badge key={kw} variant="secondary" className="cursor-pointer" onClick={() => setFormData({ ...formData, seo: { ...formData.seo, keywords: formData.seo.keywords.filter((k) => k !== kw) } })}>{kw} <X className="h-3 w-3 ml-1" /></Badge>))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving || uploading}>{saving ? 'Saving...' : editingPlace ? 'Update' : 'Save'} Place</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search places..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Card className="border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Place</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Location</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Entry Fee</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Rating</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : filteredPlaces.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-gray-500">No places found</td></tr>
                ) : (
                  filteredPlaces.map((place) => (
                    <tr key={place._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {place.images?.[0] && <img src={place.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                          <div><p className="font-medium">{place.name}</p><p className="text-sm text-gray-500">{place.slug}</p></div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /><div><p className="text-sm">{place.city?.name || ''}</p><p className="text-xs text-gray-500">{place.state?.name || ''}</p></div></div>
                      </td>
                      <td className="py-4 px-6"><Badge variant="secondary">{place.category?.[0] || '—'}</Badge></td>
                      <td className="py-4 px-6 font-medium">{place.entryFee || 'Free'}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span>{place.rating || '0'}</span></div>
                      </td>
                      <td className="py-4 px-6">
                        <button onClick={() => togglePublish(place._id, place.published)}>
                          <Badge className={place.published ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}>
                            {place.published ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            {place.published ? 'Published' : 'Draft'}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => window.open(`/places/${place.slug}`, '_blank')}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(place)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(place._id)}><Trash2 className="h-4 w-4" /></Button>
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
