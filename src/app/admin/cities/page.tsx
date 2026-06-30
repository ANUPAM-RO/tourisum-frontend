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

interface CityItem {
  _id: string;
  name: string;
  slug: string;
  state: any;
  description: string;
  published: boolean;
  popularPlaces?: any[];
  hotels?: any[];
}

interface StateOption {
  _id: string;
  name: string;
}

export default function AdminCitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<CityItem | null>(null);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', slug: '', state: '', description: '' });

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

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setFormData({ name: '', slug: '', state: '', description: '' });
      fetchData();
    } catch {
      toast.error('Failed to save city');
    }
  };

  const handleEdit = (city: CityItem) => {
    setEditingCity(city);
    setFormData({ name: city.name, slug: city.slug, state: city.state?._id || '', description: city.description || '' });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/cities/${id}`);
      toast.success('City deleted successfully!');
      fetchData();
    } catch {
      toast.error('Failed to delete city');
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/cities/${id}`, { published: !currentStatus });
      fetchData();
    } catch {
      toast.error('Failed to update city');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Cities</h1>
          <p className="text-gray-500">{cities.length} total cities</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingCity(null); setFormData({ name: '', slug: '', state: '', description: '' }); } }}>
          <DialogTrigger>
            <Button onClick={() => setEditingCity(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New City
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCity ? 'Edit City' : 'Add New City'}</DialogTitle>
              <DialogDescription>Fill in the details for the city</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">City Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="e.g., Kolkata" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Slug</label>
                <Input value={formData.slug} readOnly className="bg-gray-100" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">State</label>
                <Select value={formData.state} onValueChange={(v) => v && setFormData({ ...formData, state: v })}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (<SelectItem key={state._id} value={state._id}>{state.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingCity ? 'Update' : 'Save'} City</Button>
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
                        <div>
                          <p className="font-medium">{city.name}</p>
                          <p className="text-sm text-gray-500">{city.slug}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {city.state?.name || '—'}
                        </div>
                      </td>
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
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
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
