'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Edit, Trash2, Eye, MapPin, CheckCircle, XCircle, Loader2,
  Upload, X, Star, Phone, Globe, Mail, Navigation, Tag,
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

const AMENITIES = ['Free WiFi', 'Parking', 'Breakfast', 'Swimming Pool', 'Gym', 'Spa', 'Restaurant', 'Room Service', 'Laundry', 'Airport Shuttle'];

interface HotelItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  location: { latitude: number; longitude: number };
  googleMapLink: string;
  phone: string;
  website: string;
  email: string;
  starRating: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  distance: string;
  category: string[];
  published: boolean;
}

const emptyHotel = {
  name: '', slug: '', description: '', address: '',
  location: { latitude: 0, longitude: 0 },
  googleMapLink: '', phone: '', website: '', email: '',
  starRating: 3, pricePerNight: 0,
  amenities: [] as string[],
  images: [] as string[],
  distance: '', category: [] as string[],
};

export default function AdminHotelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<HotelItem | null>(null);
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyHotel);
  const [uploading, setUploading] = useState(false);
  const [amenityInput, setAmenityInput] = useState('');

  const fetchHotels = async () => {
    try {
      const response = await api.get('/hotels?limit=100');
      setHotels(response.data.data || []);
    } catch { toast.error('Failed to load hotels'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchHotels(); }, []);

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

  const toggleAmenity = (amenity: string) => {
    setFormData({ ...formData, amenities: formData.amenities.includes(amenity) ? formData.amenities.filter((a) => a !== amenity) : [...formData.amenities, amenity] });
  };

  const addCustomAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData({ ...formData, amenities: [...formData.amenities, amenityInput.trim()] });
      setAmenityInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData };
      if (editingHotel) {
        await api.put(`/hotels/${editingHotel._id}`, payload);
        toast.success('Hotel updated!');
      } else {
        await api.post('/hotels', { ...payload, published: true });
        toast.success('Hotel added!');
      }
      setDialogOpen(false);
      setEditingHotel(null);
      setFormData(emptyHotel);
      fetchHotels();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save hotel');
    } finally { setSaving(false); }
  };

  const handleEdit = (hotel: HotelItem) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name, slug: hotel.slug, description: hotel.description || '', address: hotel.address,
      location: hotel.location || { latitude: 0, longitude: 0 },
      googleMapLink: hotel.googleMapLink || '', phone: hotel.phone || '', website: hotel.website || '', email: hotel.email || '',
      starRating: hotel.starRating || 3, pricePerNight: hotel.pricePerNight || 0,
      amenities: hotel.amenities || [], images: hotel.images || [],
      distance: hotel.distance || '', category: hotel.category || [],
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this hotel?')) return;
    try { await api.delete(`/hotels/${id}`); toast.success('Deleted!'); fetchHotels(); }
    catch { toast.error('Failed to delete'); }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try { await api.put(`/hotels/${id}`, { published: !currentStatus }); fetchHotels(); }
    catch { toast.error('Failed to update'); }
  };

  const filteredHotels = hotels.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Hotels</h1>
          <p className="text-gray-500">{hotels.length} total hotels</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) { setEditingHotel(null); setFormData(emptyHotel); }
        }}>
          <DialogTrigger>
            <Button onClick={() => setEditingHotel(null)}>
              <Plus className="h-4 w-4 mr-2" /> Add New Hotel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</DialogTitle>
              <DialogDescription>Fill in all details for the hotel</DialogDescription>
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
                      <label className="text-sm font-medium mb-1 block">Hotel Name *</label>
                      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })} placeholder="e.g., Taj Hotel" required />
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
                      <label className="text-sm font-medium mb-1 block">Star Rating</label>
                      <Select value={formData.starRating.toString()} onValueChange={(v) => setFormData({ ...formData, starRating: parseInt(v || '3') })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((r) => (<SelectItem key={r} value={r.toString()}>{r} Star{r > 1 ? 's' : ''}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Price/Night ()</label>
                      <Input type="number" value={formData.pricePerNight} onChange={(e) => setFormData({ ...formData, pricePerNight: parseInt(e.target.value) || 0 })} placeholder="5000" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Distance Info</label>
                      <Input value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })} placeholder="0.5 km from Taj Mahal" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {['Luxury', 'Budget', 'Heritage', 'Resort', 'Business', 'Boutique'].map((cat) => (
                        <Badge key={cat} variant={formData.category.includes(cat) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => {
                          setFormData({ ...formData, category: formData.category.includes(cat) ? formData.category.filter((c) => c !== cat) : [...formData.category, cat] });
                        }}>{cat}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the hotel..." rows={3} />
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amenities</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                      {AMENITIES.map((a) => (
                        <Badge key={a} variant={formData.amenities.includes(a) ? 'default' : 'outline'} className="cursor-pointer justify-center py-2" onClick={() => toggleAmenity(a)}>{a}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} placeholder="Add custom amenity..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomAmenity(); } }} />
                      <Button type="button" onClick={addCustomAmenity} size="sm">Add</Button>
                    </div>
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
                      <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="hotel@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Globe className="h-4 w-4" /> Website</label>
                    <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://www.hotel.com" />
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving || uploading}>{saving ? 'Saving...' : editingHotel ? 'Update' : 'Save'} Hotel</Button>
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
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Amenities</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : filteredHotels.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-gray-500">No hotels found</td></tr>
                ) : (
                  filteredHotels.map((hotel) => (
                    <tr key={hotel._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {hotel.images?.[0] && <img src={hotel.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                          <div><p className="font-medium">{hotel.name}</p><p className="text-sm text-gray-500">{hotel.slug}</p></div>
                        </div>
                      </td>
                      <td className="py-4 px-6"><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /><span className="text-sm truncate max-w-[200px]">{hotel.address}</span></div></td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          {[...Array(hotel.starRating)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />))}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium">₹{hotel.pricePerNight?.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {hotel.amenities?.slice(0, 2).map((a) => (<Badge key={a} variant="secondary" className="text-xs">{a}</Badge>))}
                          {hotel.amenities?.length > 2 && <Badge variant="secondary" className="text-xs">+{hotel.amenities.length - 2}</Badge>}
                        </div>
                      </td>
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
                          <Button variant="ghost" size="icon" onClick={() => window.open(`/hotels/${hotel.slug}`, '_blank')}><Eye className="h-4 w-4" /></Button>
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
