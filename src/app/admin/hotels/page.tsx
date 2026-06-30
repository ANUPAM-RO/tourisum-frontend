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
  Star,
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

interface HotelItem {
  _id: string;
  name: string;
  slug: string;
  address: string;
  starRating: number;
  pricePerNight: number;
  published: boolean;
  amenities: string[];
}

export default function AdminHotelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<HotelItem | null>(null);
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', slug: '', address: '', starRating: '3', pricePerNight: '' });

  const fetchHotels = async () => {
    try {
      const response = await api.get('/hotels?limit=100');
      setHotels(response.data.data || []);
    } catch {
      toast.error('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels(); }, []);

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        starRating: parseInt(formData.starRating),
        pricePerNight: parseInt(formData.pricePerNight),
        location: { latitude: 0, longitude: 0 },
      };
      if (editingHotel) {
        await api.put(`/hotels/${editingHotel._id}`, payload);
        toast.success('Hotel updated successfully!');
      } else {
        await api.post('/hotels', { ...payload, published: true });
        toast.success('Hotel added successfully!');
      }
      setDialogOpen(false);
      setEditingHotel(null);
      setFormData({ name: '', slug: '', address: '', starRating: '3', pricePerNight: '' });
      fetchHotels();
    } catch {
      toast.error('Failed to save hotel');
    }
  };

  const handleEdit = (hotel: HotelItem) => {
    setEditingHotel(hotel);
    setFormData({ name: hotel.name, slug: hotel.slug, address: hotel.address, starRating: hotel.starRating.toString(), pricePerNight: hotel.pricePerNight.toString() });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/hotels/${id}`);
      toast.success('Hotel deleted successfully!');
      fetchHotels();
    } catch {
      toast.error('Failed to delete hotel');
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/hotels/${id}`, { published: !currentStatus });
      fetchHotels();
    } catch {
      toast.error('Failed to update hotel');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Hotels</h1>
          <p className="text-gray-500">{hotels.length} total hotels</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingHotel(null); setFormData({ name: '', slug: '', address: '', starRating: '3', pricePerNight: '' }); } }}>
          <DialogTrigger>
            <Button onClick={() => setEditingHotel(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Hotel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</DialogTitle>
              <DialogDescription>Fill in the details for the hotel</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Hotel Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="e.g., Taj Hotel" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Slug</label>
                <Input value={formData.slug} readOnly className="bg-gray-100" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Address</label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="e.g., Taj Ganj, Agra" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Star Rating</label>
                  <Select value={formData.starRating} onValueChange={(v) => v && setFormData({ ...formData, starRating: v })}>
                    <SelectTrigger><SelectValue placeholder="Select rating" /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((r) => (<SelectItem key={r} value={r.toString()}>{r} Star{r > 1 ? 's' : ''}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Per Night (₹)</label>
                  <Input type="number" value={formData.pricePerNight} onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })} placeholder="e.g., 5000" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingHotel ? 'Update' : 'Save'} Hotel</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search hotels..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Card className="border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Hotel</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Address</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Rating</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Price/Night</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : filteredHotels.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">No hotels found</td></tr>
                ) : (
                  filteredHotels.map((hotel) => (
                    <tr key={hotel._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium">{hotel.name}</p>
                          <p className="text-sm text-gray-500">{hotel.slug}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm truncate max-w-[200px]">{hotel.address}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          {[...Array(hotel.starRating)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />))}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium">₹{hotel.pricePerNight.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <button onClick={() => togglePublish(hotel._id, hotel.published)}>
                          <Badge className={hotel.published ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}>
                            {hotel.published ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            {hotel.published ? 'Published' : 'Draft'}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(hotel)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(hotel._id)}><Trash2 className="h-4 w-4" /></Button>
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
