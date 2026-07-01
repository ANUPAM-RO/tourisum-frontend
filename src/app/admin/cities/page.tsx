'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Edit, Trash2, Eye, MapPin, CheckCircle, XCircle, Loader2,
  Upload, X, Sun, Cloud, Droplets, Calendar, Plane, Train, Bus, Wallet,
  UtensilsCrossed, Shield, FileText, Tag,
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
import { toast } from 'sonner';
import api from '@/lib/api';

interface CityItem {
  _id: string;
  name: string;
  slug: string;
  state: any;
  description: string;
  image: string;
  gallery: string[];
  location: { latitude: number; longitude: number };
  weather: { summer: string; winter: string; monsoon: string };
  bestTimeToVisit: string;
  transportation: {
    nearestAirport: { name: string; distance: string; cabCost: string };
    nearestStation: { name: string; distance: string; taxiFare: string };
    busStand: { name: string; autoFare: string };
  };
  estimatedBudget: {
    budget: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
    standard: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
    luxury: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
  };
  localFoods: string[];
  travelTips: { dos: string[]; donts: string[]; safety: string[] };
  published: boolean;
  seo: { title: string; metaDescription: string; keywords: string[] };
  popularPlaces?: any[];
  hotels?: any[];
}

const emptyCity = {
  name: '', slug: '', state: '', description: '', image: '', gallery: [] as string[],
  location: { latitude: 0, longitude: 0 },
  weather: { summer: '', winter: '', monsoon: '' },
  bestTimeToVisit: '',
  transportation: {
    nearestAirport: { name: '', distance: '', cabCost: '' },
    nearestStation: { name: '', distance: '', taxiFare: '' },
    busStand: { name: '', autoFare: '' },
  },
  estimatedBudget: {
    budget: { hotel: '', food: '', travel: '', tickets: '', shopping: '', total: '' },
    standard: { hotel: '', food: '', travel: '', tickets: '', shopping: '', total: '' },
    luxury: { hotel: '', food: '', travel: '', tickets: '', shopping: '', total: '' },
  },
  localFoods: [] as string[],
  travelTips: { dos: [] as string[], donts: [] as string[], safety: [] as string[] },
  seo: { title: '', metaDescription: '', keywords: [] as string[] },
};

export default function AdminCitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<CityItem | null>(null);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyCity);
  const [uploading, setUploading] = useState(false);
  const [foodInput, setFoodInput] = useState('');
  const [tipInputs, setTipInputs] = useState({ dos: '', donts: '', safety: '' });
  const [keywordInput, setKeywordInput] = useState('');

  const fetchData = async () => {
    try {
      const [citiesRes, statesRes] = await Promise.all([
        api.get('/cities?limit=100'),
        api.get('/states?limit=50'),
      ]);
      setCities(citiesRes.data.data || []);
      setStates(statesRes.data.data || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageUpload = async (field: 'image' | 'gallery') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append('image', file);
        const res = await api.post('/upload/single', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res.data.success) {
          if (field === 'image') setFormData({ ...formData, image: res.data.data.url });
          else setFormData({ ...formData, gallery: [...formData.gallery, res.data.data.url] });
          toast.success('Image uploaded!');
        }
      } catch { toast.error('Upload failed'); }
      finally { setUploading(false); }
    };
    input.click();
  };

  const addFood = () => {
    if (foodInput.trim() && !formData.localFoods.includes(foodInput.trim())) {
      setFormData({ ...formData, localFoods: [...formData.localFoods, foodInput.trim()] });
      setFoodInput('');
    }
  };

  const addTip = (type: 'dos' | 'donts' | 'safety') => {
    const val = tipInputs[type].trim();
    if (val) {
      setFormData({ ...formData, travelTips: { ...formData.travelTips, [type]: [...(formData.travelTips as any)[type], val] } });
      setTipInputs({ ...tipInputs, [type]: '' });
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.seo.keywords.includes(keywordInput.trim())) {
      setFormData({ ...formData, seo: { ...formData.seo, keywords: [...formData.seo.keywords, keywordInput.trim()] } });
      setKeywordInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, state: formData.state || editingCity?.state?._id };
      if (editingCity) {
        await api.put(`/cities/${editingCity._id}`, payload);
        toast.success('City updated successfully!');
      } else {
        await api.post('/cities', { ...payload, published: true });
        toast.success('City added successfully!');
      }
      setDialogOpen(false);
      setEditingCity(null);
      setFormData(emptyCity);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save city');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (city: CityItem) => {
    setEditingCity(city);
    setFormData({
      name: city.name, slug: city.slug, state: city.state?._id || '', description: city.description || '',
      image: city.image || '', gallery: city.gallery || [],
      location: city.location || { latitude: 0, longitude: 0 },
      weather: city.weather || { summer: '', winter: '', monsoon: '' },
      bestTimeToVisit: city.bestTimeToVisit || '',
      transportation: city.transportation || emptyCity.transportation,
      estimatedBudget: city.estimatedBudget || emptyCity.estimatedBudget,
      localFoods: city.localFoods || [],
      travelTips: city.travelTips || { dos: [], donts: [], safety: [] },
      seo: city.seo || { title: '', metaDescription: '', keywords: [] },
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this city?')) return;
    try {
      await api.delete(`/cities/${id}`);
      toast.success('City deleted!');
      fetchData();
    } catch { toast.error('Failed to delete city'); }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/cities/${id}`, { published: !currentStatus });
      fetchData();
    } catch { toast.error('Failed to update city'); }
  };

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const BudgetSection = ({ title, budget, type }: { title: string; budget: any; type: string }) => (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold mb-3 capitalize">{title}</h4>
      <div className="grid grid-cols-3 gap-3">
        {['hotel', 'food', 'travel', 'tickets', 'shopping', 'total'].map((field) => (
          <div key={field}>
            <label className="text-xs text-gray-500 capitalize">{field}</label>
            <Input
              value={budget?.[field] || ''}
              onChange={(e) => setFormData({
                ...formData,
                estimatedBudget: { ...formData.estimatedBudget, [type]: { ...formData.estimatedBudget[type as keyof typeof formData.estimatedBudget], [field]: e.target.value } }
              })}
              placeholder="₹0"
              className="h-8 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Cities</h1>
          <p className="text-gray-500">{cities.length} total cities</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) { setEditingCity(null); setFormData(emptyCity); }
        }}>
          <DialogTrigger>
            <Button onClick={() => setEditingCity(null)}>
              <Plus className="h-4 w-4 mr-2" /> Add New City
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCity ? 'Edit City' : 'Add New City'}</DialogTitle>
              <DialogDescription>Fill in all details for the city</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="transport">Transport</TabsTrigger>
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                  <TabsTrigger value="more">More</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">City Name *</label>
                      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })} placeholder="e.g., Kolkata" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Slug</label>
                      <Input value={formData.slug} readOnly className="bg-gray-100" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">State *</label>
                      <Select value={formData.state} onValueChange={(v) => v && setFormData({ ...formData, state: v })}>
                        <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                        <SelectContent>
                          {states.map((s) => (<SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Best Time to Visit</label>
                      <Input value={formData.bestTimeToVisit} onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })} placeholder="March to May" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description *</label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the city..." rows={3} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Latitude</label>
                      <Input type="number" step="any" value={formData.location.latitude || ''} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, latitude: parseFloat(e.target.value) || 0 } })} placeholder="22.5726" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Longitude</label>
                      <Input type="number" step="any" value={formData.location.longitude || ''} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, longitude: parseFloat(e.target.value) || 0 } })} placeholder="88.3639" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Cover Image</label>
                    <div className="flex items-center gap-4">
                      {formData.image && <img src={formData.image} alt="Cover" className="w-32 h-20 object-cover rounded-lg" />}
                      <Button type="button" variant="outline" onClick={() => handleImageUpload('image')} disabled={uploading}>
                        <Upload className="h-4 w-4 mr-2" /> {formData.image ? 'Change' : 'Upload'} Cover
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Gallery</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.gallery.map((img, i) => (
                        <div key={i} className="relative">
                          <img src={img} alt="" className="w-20 h-14 object-cover rounded" />
                          <button type="button" onClick={() => setFormData({ ...formData, gallery: formData.gallery.filter((_, idx) => idx !== i) })} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X className="h-3 w-3" /></button>
                        </div>
                      ))}
                    </div>
                    <Button type="button" variant="outline" onClick={() => handleImageUpload('gallery')} disabled={uploading}>
                      <Upload className="h-4 w-4 mr-2" /> Add to Gallery
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="transport" className="space-y-4 mt-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><Plane className="h-4 w-4" /> Nearest Airport</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <Input placeholder="Airport name" value={formData.transportation.nearestAirport.name} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, nearestAirport: { ...formData.transportation.nearestAirport, name: e.target.value } } })} />
                      <Input placeholder="Distance" value={formData.transportation.nearestAirport.distance} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, nearestAirport: { ...formData.transportation.nearestAirport, distance: e.target.value } } })} />
                      <Input placeholder="Cab cost" value={formData.transportation.nearestAirport.cabCost} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, nearestAirport: { ...formData.transportation.nearestAirport, cabCost: e.target.value } } })} />
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><Train className="h-4 w-4" /> Nearest Station</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <Input placeholder="Station name" value={formData.transportation.nearestStation.name} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, nearestStation: { ...formData.transportation.nearestStation, name: e.target.value } } })} />
                      <Input placeholder="Distance" value={formData.transportation.nearestStation.distance} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, nearestStation: { ...formData.transportation.nearestStation, distance: e.target.value } } })} />
                      <Input placeholder="Taxi fare" value={formData.transportation.nearestStation.taxiFare} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, nearestStation: { ...formData.transportation.nearestStation, taxiFare: e.target.value } } })} />
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><Bus className="h-4 w-4" /> Bus Stand</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Bus stand name" value={formData.transportation.busStand.name} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, busStand: { ...formData.transportation.busStand, name: e.target.value } } })} />
                      <Input placeholder="Auto fare" value={formData.transportation.busStand.autoFare} onChange={(e) => setFormData({ ...formData, transportation: { ...formData.transportation, busStand: { ...formData.transportation.busStand, autoFare: e.target.value } } })} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="budget" className="space-y-4 mt-4">
                  <BudgetSection title="Budget Traveller" budget={formData.estimatedBudget.budget} type="budget" />
                  <BudgetSection title="Standard Traveller" budget={formData.estimatedBudget.standard} type="standard" />
                  <BudgetSection title="Luxury Traveller" budget={formData.estimatedBudget.luxury} type="luxury" />
                </TabsContent>

                <TabsContent value="more" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Weather</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div><label className="text-xs text-gray-500">Summer</label><Input value={formData.weather.summer} onChange={(e) => setFormData({ ...formData, weather: { ...formData.weather, summer: e.target.value } })} placeholder="15°C - 25°C" /></div>
                      <div><label className="text-xs text-gray-500">Winter</label><Input value={formData.weather.winter} onChange={(e) => setFormData({ ...formData, weather: { ...formData.weather, winter: e.target.value } })} placeholder="2°C - 10°C" /></div>
                      <div><label className="text-xs text-gray-500">Monsoon</label><Input value={formData.weather.monsoon} onChange={(e) => setFormData({ ...formData, weather: { ...formData.weather, monsoon: e.target.value } })} placeholder="15°C - 20°C" /></div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center gap-1"><UtensilsCrossed className="h-4 w-4" /> Local Foods</label>
                    <div className="flex gap-2 mb-2">
                      <Input value={foodInput} onChange={(e) => setFoodInput(e.target.value)} placeholder="Add food..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFood(); } }} />
                      <Button type="button" onClick={addFood} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.localFoods.map((f) => (<Badge key={f} variant="secondary" className="cursor-pointer" onClick={() => setFormData({ ...formData, localFoods: formData.localFoods.filter((x) => x !== f) })}>{f} <X className="h-3 w-3 ml-1" /></Badge>))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Shield className="h-4 w-4" /> Travel Tips</label>
                    {(['dos', 'donts', 'safety'] as const).map((type) => (
                      <div key={type} className="mb-2">
                        <label className="text-xs text-gray-500 capitalize">{type}</label>
                        <div className="flex gap-2">
                          <Input value={tipInputs[type]} onChange={(e) => setTipInputs({ ...tipInputs, [type]: e.target.value })} placeholder={`Add ${type}...`} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTip(type); } }} />
                          <Button type="button" onClick={() => addTip(type)} size="sm">Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(formData.travelTips as any)[type].map((t: string, i: number) => (
                            <Badge key={i} variant="outline" className="cursor-pointer text-xs" onClick={() => setFormData({ ...formData, travelTips: { ...formData.travelTips, [type]: (formData.travelTips as any)[type].filter((_: any, idx: number) => idx !== i) } })}>{t} <X className="h-2 w-2 ml-1" /></Badge>
                          ))}
                        </div>
                      </div>
                    ))}
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
                <Button type="submit" disabled={saving || uploading}>{saving ? 'Saving...' : editingCity ? 'Update' : 'Save'} City</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search cities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Card className="border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">City</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">State</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Places</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Hotels</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : filteredCities.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">No cities found</td></tr>
                ) : (
                  filteredCities.map((city) => (
                    <tr key={city._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {city.image && <img src={city.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                          <div><p className="font-medium">{city.name}</p><p className="text-sm text-gray-500">{city.slug}</p></div>
                        </div>
                      </td>
                      <td className="py-4 px-6"><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" />{city.state?.name || '—'}</div></td>
                      <td className="py-4 px-6">{city.popularPlaces?.length || 0}</td>
                      <td className="py-4 px-6">{city.hotels?.length || 0}</td>
                      <td className="py-4 px-6">
                        <button onClick={() => togglePublish(city._id, city.published)}>
                          <Badge className={city.published ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}>
                            {city.published ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            {city.published ? 'Published' : 'Draft'}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => window.open(`/cities/${city.slug}`, '_blank')}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(city)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(city._id)}><Trash2 className="h-4 w-4" /></Button>
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
