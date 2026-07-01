'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Edit, Trash2, Eye, MapPin, CheckCircle, XCircle, Loader2,
  Upload, X, Star, Phone, Globe, Mail, Clock, Navigation, Tag,
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
import { formatRating } from '@/lib/utils';
import api from '@/lib/api';

interface RestaurantItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  cuisine: string[];
  address: string;
  location: { latitude: number; longitude: number };
  googleMapLink: string;
  phone: string;
  website: string;
  email: string;
  averageCost: number;
  openingTime: string;
  closingTime: string;
  images: string[];
  vegNonVeg: 'veg' | 'non-veg' | 'both';
  rating: number;
  distance: string;
  published: boolean;
}

const emptyRestaurant = {
  name: '', slug: '', description: '', cuisine: [] as string[],
  address: '', location: { latitude: 0, longitude: 0 },
  googleMapLink: '', phone: '', website: '', email: '',
  averageCost: 0, openingTime: '', closingTime: '',
  images: [] as string[],
  vegNonVeg: 'both' as 'veg' | 'non-veg' | 'both',
  rating: 0, distance: '',
};

export default function AdminRestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<RestaurantItem | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyRestaurant);
  const [uploading, setUploading] = useState(false);
  const [cuisineInput, setCuisineInput] = useState('');

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants?limit=100');
      setRestaurants(response.data.data || []);
    } catch { toast.error('Failed to load restaurants'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRestaurants(); }, []);

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

  const addCuisine = () => {
    if (cuisineInput.trim() && !formData.cuisine.includes(cuisineInput.trim())) {
      setFormData({ ...formData, cuisine: [...formData.cuisine, cuisineInput.trim()] });
      setCuisineInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData };
      if (editingRestaurant) {
        await api.put(`/restaurants/${editingRestaurant._id}`, payload);
        toast.success('Restaurant updated!');
      } else {
        await api.post('/restaurants', { ...payload, published: true });
        toast.success('Restaurant added!');
      }
      setDialogOpen(false);
      setEditingRestaurant(null);
      setFormData(emptyRestaurant);
      fetchRestaurants();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save restaurant');
    } finally { setSaving(false); }
  };

  const handleEdit = (restaurant: RestaurantItem) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name, slug: restaurant.slug, description: restaurant.description || '',
      cuisine: restaurant.cuisine || [], address: restaurant.address,
      location: restaurant.location || { latitude: 0, longitude: 0 },
      googleMapLink: restaurant.googleMapLink || '', phone: restaurant.phone || '', website: restaurant.website || '', email: restaurant.email || '',
      averageCost: restaurant.averageCost || 0, openingTime: restaurant.openingTime || '', closingTime: restaurant.closingTime || '',
      images: restaurant.images || [], vegNonVeg: restaurant.vegNonVeg || 'both',
      rating: restaurant.rating || 0, distance: restaurant.distance || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this restaurant?')) return;
    try { await api.delete(`/restaurants/${id}`); toast.success('Deleted!'); fetchRestaurants(); }
    catch { toast.error('Failed to delete'); }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try { await api.put(`/restaurants/${id}`, { published: !currentStatus }); fetchRestaurants(); }
    catch { toast.error('Failed to update'); }
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine?.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Restaurants</h1>
          <p className="text-gray-500">{restaurants.length} total restaurants</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) { setEditingRestaurant(null); setFormData(emptyRestaurant); }
        }}>
          <DialogTrigger>
            <Button onClick={() => setEditingRestaurant(null)}>
              <Plus className="h-4 w-4 mr-2" /> Add New Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[60vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}</DialogTitle>
              <DialogDescription>Fill in all details for the restaurant</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Restaurant Name *</label>
                      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })} placeholder="e.g., Peshawri" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Slug</label>
                      <Input value={formData.slug} readOnly className="bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Address *</label>
                    <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Full address" required />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Veg/Non-Veg</label>
                      <Select value={formData.vegNonVeg} onValueChange={(v) => setFormData({ ...formData, vegNonVeg: v as 'veg' | 'non-veg' | 'both' })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="veg">Vegetarian</SelectItem>
                          <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Avg Cost ()</label>
                      <Input type="number" value={formData.averageCost} onChange={(e) => setFormData({ ...formData, averageCost: parseInt(e.target.value) || 0 })} placeholder="800" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Rating (0-5)</label>
                      <Input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Cuisine Types</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.cuisine.map((c, i) => (
                        <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => setFormData({ ...formData, cuisine: formData.cuisine.filter((_, idx) => idx !== i) })}>{c} <X className="h-3 w-3 ml-1" /></Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input value={cuisineInput} onChange={(e) => setCuisineInput(e.target.value)} placeholder="Add cuisine..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCuisine(); } }} />
                      <Button type="button" onClick={addCuisine} size="sm">Add</Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the restaurant..." rows={3} />
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
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Clock className="h-4 w-4" /> Opening Time</label>
                      <Input value={formData.openingTime} onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })} placeholder="11:00 AM" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Clock className="h-4 w-4" /> Closing Time</label>
                      <Input value={formData.closingTime} onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })} placeholder="11:00 PM" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Distance Info</label>
                    <Input value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })} placeholder="1 km from Taj Mahal" />
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
                  <div>
                    <label className="text-sm font-medium mb-1 block">Google Map Link</label>
                    <Input value={formData.googleMapLink} onChange={(e) => setFormData({ ...formData, googleMapLink: e.target.value })} placeholder="https://maps.google.com/..." />
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Phone className="h-4 w-4" /> Phone</label>
                      <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Mail className="h-4 w-4" /> Email</label>
                      <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="restaurant@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Globe className="h-4 w-4" /> Website</label>
                    <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://www.restaurant.com" />
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving || uploading}>{saving ? 'Saving...' : editingRestaurant ? 'Update' : 'Save'} Restaurant</Button>
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
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Rating</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : filteredRestaurants.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-gray-500">No restaurants found</td></tr>
                ) : (
                  filteredRestaurants.map((restaurant) => (
                    <tr key={restaurant._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {restaurant.images?.[0] && <img src={restaurant.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                          <div><p className="font-medium">{restaurant.name}</p><p className="text-sm text-gray-500">{restaurant.slug}</p></div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {Array.from(new Set(restaurant.cuisine)).slice(0, 2).map((c: any) => (<Badge key={c} variant="secondary" className="text-xs">{c}</Badge>))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={restaurant.vegNonVeg === 'veg' ? 'default' : restaurant.vegNonVeg === 'non-veg' ? 'destructive' : 'secondary'}>
                          {restaurant.vegNonVeg}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 font-medium">₹{restaurant.averageCost}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span>{formatRating(restaurant.rating, '0')}</span></div>
                      </td>
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
                          <Button variant="ghost" size="icon" onClick={() => window.open(`/restaurants/${restaurant.slug}`, '_blank')}><Eye className="h-4 w-4" /></Button>
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
