'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MapPin,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';

interface PlaceItem {
  _id: string;
  name: string;
  slug: string;
  state: any;
  city: any;
  category: string[];
  entryFee: string;
  published: boolean;
  rating: number;
}

export default function AdminPlacesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<PlaceItem | null>(null);
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', slug: '', state: '', city: '', category: '', entryFee: '', description: '' });

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
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredPlaces = places.filter((place) =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.state?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCities = formData.state ? cities.filter((c) => c.state?._id === formData.state || c.state === formData.state) : cities;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        category: formData.category ? [formData.category] : [],
        location: { latitude: 0, longitude: 0 },
      };
      if (editingPlace) {
        await api.put(`/places/${editingPlace._id}`, payload);
        toast.success('Place updated successfully!');
      } else {
        await api.post('/places', { ...payload, published: true });
        toast.success('Place added successfully!');
      }
      setDialogOpen(false);
      setEditingPlace(null);
      setFormData({ name: '', slug: '', state: '', city: '', category: '', entryFee: '', description: '' });
      fetchData();
    } catch {
      toast.error('Failed to save place');
    }
  };

  const handleEdit = (place: PlaceItem) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      slug: place.slug,
      state: place.state?._id || '',
      city: place.city?._id || '',
      category: place.category?.[0] || '',
      entryFee: place.entryFee || '',
      description: '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/places/${id}`);
      toast.success('Place deleted successfully!');
      fetchData();
    } catch {
      toast.error('Failed to delete place');
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/places/${id}`, { published: !currentStatus });
      fetchData();
    } catch {
      toast.error('Failed to update place');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Places</h1>
          <p className="text-gray-500">{places.length} total places</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingPlace(null); setFormData({ name: '', slug: '', state: '', city: '', category: '', entryFee: '', description: '' }); } }}>
          <DialogTrigger>
            <Button onClick={() => setEditingPlace(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Place
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlace ? 'Edit Place' : 'Add New Place'}</DialogTitle>
              <DialogDescription>Fill in the details for the tourist place</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Place Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="e.g., Taj Mahal"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Slug</label>
                  <Input value={formData.slug} readOnly className="bg-gray-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">State</label>
                  <Select value={formData.state} onValueChange={(v) => v && setFormData({ ...formData, state: v, city: '' })}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (<SelectItem key={state._id} value={state._id}>{state.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">City</label>
                  <Select value={formData.city} onValueChange={(v) => v && setFormData({ ...formData, city: v })}>
                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent>
                      {filteredCities.map((city) => (<SelectItem key={city._id} value={city._id}>{city.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={formData.category} onValueChange={(v) => v && setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {['Heritage', 'Hill Station', 'Beach', 'Wildlife', 'Religious', 'Adventure', 'Honeymoon', 'Family Trip'].map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Entry Fee</label>
                  <Input value={formData.entryFee} onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })} placeholder="e.g., ₹50" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingPlace ? 'Update' : 'Save'} Place</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search places..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      {/* Places Table */}
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
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : filteredPlaces.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">No places found</td></tr>
                ) : (
                  filteredPlaces.map((place) => (
                    <tr key={place._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium">{place.name}</p>
                          <p className="text-sm text-gray-500">{place.slug}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm">{place.city?.name || ''}</p>
                            <p className="text-xs text-gray-500">{place.state?.name || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="secondary">{place.category?.[0] || '—'}</Badge>
                      </td>
                      <td className="py-4 px-6 font-medium">{place.entryFee || 'Free'}</td>
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
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
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
