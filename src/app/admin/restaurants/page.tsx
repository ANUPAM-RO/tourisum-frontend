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

interface RestaurantItem {
  _id: string;
  name: string;
  slug: string;
  address: string;
  cuisine: string[];
  vegNonVeg: string;
  averageCost: number;
  rating: number;
  published: boolean;
}

export default function AdminRestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<RestaurantItem | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', slug: '', address: '', cuisine: '', vegNonVeg: 'both', averageCost: '' });

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants?limit=100');
      setRestaurants(response.data.data || []);
    } catch {
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRestaurants(); }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine?.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        cuisine: formData.cuisine ? formData.cuisine.split(',').map((c) => c.trim()) : [],
        averageCost: parseInt(formData.averageCost),
        location: { latitude: 0, longitude: 0 },
      };
      if (editingRestaurant) {
        await api.put(`/restaurants/${editingRestaurant._id}`, payload);
        toast.success('Restaurant updated successfully!');
      } else {
        await api.post('/restaurants', { ...payload, published: true });
        toast.success('Restaurant added successfully!');
      }
      setDialogOpen(false);
      setEditingRestaurant(null);
      setFormData({ name: '', slug: '', address: '', cuisine: '', vegNonVeg: 'both', averageCost: '' });
      fetchRestaurants();
    } catch {
      toast.error('Failed to save restaurant');
    }
  };

  const handleEdit = (restaurant: RestaurantItem) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      slug: restaurant.slug,
      address: restaurant.address,
      cuisine: restaurant.cuisine?.join(', ') || '',
      vegNonVeg: restaurant.vegNonVeg,
      averageCost: restaurant.averageCost.toString(),
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/restaurants/${id}`);
      toast.success('Restaurant deleted successfully!');
      fetchRestaurants();
    } catch {
      toast.error('Failed to delete restaurant');
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/restaurants/${id}`, { published: !currentStatus });
      fetchRestaurants();
    } catch {
      toast.error('Failed to update restaurant');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Restaurants</h1>
          <p className="text-gray-500">{restaurants.length} total restaurants</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingRestaurant(null); setFormData({ name: '', slug: '', address: '', cuisine: '', vegNonVeg: 'both', averageCost: '' }); } }}>
          <DialogTrigger>
            <Button onClick={() => setEditingRestaurant(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}</DialogTitle>
              <DialogDescription>Fill in the details for the restaurant</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Restaurant Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="e.g., Peshawri" required />
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
                  <label className="text-sm font-medium mb-2 block">Cuisine (comma separated)</label>
                  <Input value={formData.cuisine} onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })} placeholder="e.g., Mughlai, North Indian" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Veg/Non-Veg</label>
                  <Select value={formData.vegNonVeg} onValueChange={(v) => v && setFormData({ ...formData, vegNonVeg: v })}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">Vegetarian</SelectItem>
                      <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Average Cost (₹)</label>
                <Input type="number" value={formData.averageCost} onChange={(e) => setFormData({ ...formData, averageCost: e.target.value })} placeholder="e.g., 800" required />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingRestaurant ? 'Update' : 'Save'} Restaurant</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search restaurants..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Card className="border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Restaurant</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Cuisine</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Avg Cost</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : filteredRestaurants.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">No restaurants found</td></tr>
                ) : (
                  filteredRestaurants.map((restaurant) => (
                    <tr key={restaurant._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium">{restaurant.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">{restaurant.address}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {restaurant.cuisine?.slice(0, 2).map((c) => (
                            <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={restaurant.vegNonVeg === 'veg' ? 'default' : restaurant.vegNonVeg === 'non-veg' ? 'destructive' : 'secondary'}>
                          {restaurant.vegNonVeg}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 font-medium">₹{restaurant.averageCost}</td>
                      <td className="py-4 px-6">
                        <button onClick={() => togglePublish(restaurant._id, restaurant.published)}>
                          <Badge className={restaurant.published ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}>
                            {restaurant.published ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            {restaurant.published ? 'Published' : 'Draft'}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(restaurant)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(restaurant._id)}><Trash2 className="h-4 w-4" /></Button>
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
