'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Edit, Trash2, Eye, MapPin, CheckCircle, XCircle, Loader2,
  Upload, X, Image as ImageIcon, Sun, Cloud, Droplets, Calendar, Languages,
  Phone, Shield, FileText, Tag,
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
import { toast } from 'sonner';
import api from '@/lib/api';

interface StateItem {
  _id: string;
  name: string;
  slug: string;
  capital: string;
  description: string;
  image: string;
  gallery: string[];
  weather: { summer: string; winter: string; monsoon: string };
  bestTimeToVisit: string;
  localLanguage: string;
  emergencyNumbers: { police: string; ambulance: string; fire: string };
  published: boolean;
  seo: { title: string; metaDescription: string; keywords: string[] };
  popularPlaces?: any[];
  popularCities?: any[];
}

const emptyState = {
  name: '', slug: '', capital: '', description: '', image: '', gallery: [] as string[],
  weather: { summer: '', winter: '', monsoon: '' },
  bestTimeToVisit: '', localLanguage: '',
  emergencyNumbers: { police: '', ambulance: '', fire: '' },
  seo: { title: '', metaDescription: '', keywords: [] as string[] },
};

export default function AdminStatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingState, setEditingState] = useState<StateItem | null>(null);
  const [states, setStates] = useState<StateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyState);
  const [uploading, setUploading] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');

  const fetchStates = async () => {
    try {
      const response = await api.get('/states?limit=100');
      setStates(response.data.data || []);
    } catch {
      toast.error('Failed to load states');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStates(); }, []);

  const handleImageUpload = async (field: 'image' | 'gallery') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        const res = await api.post('/upload/single', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          if (field === 'image') {
            setFormData({ ...formData, image: res.data.data.url });
          } else {
            setFormData({ ...formData, gallery: [...formData.gallery, res.data.data.url] });
          }
          toast.success('Image uploaded!');
        }
      } catch {
        toast.error('Upload failed');
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  const removeGalleryImage = (index: number) => {
    setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== index) });
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.seo.keywords.includes(keywordInput.trim())) {
      setFormData({ ...formData, seo: { ...formData.seo, keywords: [...formData.seo.keywords, keywordInput.trim()] } });
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setFormData({ ...formData, seo: { ...formData.seo, keywords: formData.seo.keywords.filter((k) => k !== kw) } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData };
      if (editingState) {
        await api.put(`/states/${editingState._id}`, payload);
        toast.success('State updated successfully!');
      } else {
        await api.post('/states', { ...payload, published: true });
        toast.success('State added successfully!');
      }
      setDialogOpen(false);
      setEditingState(null);
      setFormData(emptyState);
      fetchStates();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save state');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (state: StateItem) => {
    setEditingState(state);
    setFormData({
      name: state.name, slug: state.slug, capital: state.capital, description: state.description || '',
      image: state.image || '', gallery: state.gallery || [],
      weather: state.weather || { summer: '', winter: '', monsoon: '' },
      bestTimeToVisit: state.bestTimeToVisit || '', localLanguage: state.localLanguage || '',
      emergencyNumbers: state.emergencyNumbers || { police: '', ambulance: '', fire: '' },
      seo: state.seo || { title: '', metaDescription: '', keywords: [] },
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this state?')) return;
    try {
      await api.delete(`/states/${id}`);
      toast.success('State deleted successfully!');
      fetchStates();
    } catch {
      toast.error('Failed to delete state');
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/states/${id}`, { published: !currentStatus });
      fetchStates();
    } catch {
      toast.error('Failed to update state');
    }
  };

  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.capital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage States</h1>
          <p className="text-gray-500">{states.length} total states</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) { setEditingState(null); setFormData(emptyState); }
        }}>
          <DialogTrigger>
            <Button onClick={() => setEditingState(null)}>
              <Plus className="h-4 w-4 mr-2" /> Add New State
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingState ? 'Edit State' : 'Add New State'}</DialogTitle>
              <DialogDescription>Fill in all details for the state</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">State Name *</label>
                      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })} placeholder="e.g., West Bengal" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Slug</label>
                      <Input value={formData.slug} readOnly className="bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Capital *</label>
                    <Input value={formData.capital} onChange={(e) => setFormData({ ...formData, capital: e.target.value })} placeholder="e.g., Kolkata" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description *</label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the state..." rows={4} required />
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Cover Image</label>
                    <div className="flex items-center gap-4">
                      {formData.image && (
                        <img src={formData.image} alt="Cover" className="w-32 h-20 object-cover rounded-lg" />
                      )}
                      <Button type="button" variant="outline" onClick={() => handleImageUpload('image')} disabled={uploading}>
                        <Upload className="h-4 w-4 mr-2" /> {formData.image ? 'Change' : 'Upload'} Cover
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Gallery Images</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.gallery.map((img, i) => (
                        <div key={i} className="relative">
                          <img src={img} alt={`Gallery ${i + 1}`} className="w-20 h-14 object-cover rounded" />
                          <button type="button" onClick={() => removeGalleryImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X className="h-3 w-3" /></button>
                        </div>
                      ))}
                    </div>
                    <Button type="button" variant="outline" onClick={() => handleImageUpload('gallery')} disabled={uploading}>
                      <Upload className="h-4 w-4 mr-2" /> Add to Gallery
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Weather</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 flex items-center gap-1"><Sun className="h-3 w-3" /> Summer</label>
                        <Input value={formData.weather.summer} onChange={(e) => setFormData({ ...formData, weather: { ...formData.weather, summer: e.target.value } })} placeholder="30°C - 40°C" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 flex items-center gap-1"><Cloud className="h-3 w-3" /> Winter</label>
                        <Input value={formData.weather.winter} onChange={(e) => setFormData({ ...formData, weather: { ...formData.weather, winter: e.target.value } })} placeholder="10°C - 25°C" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 flex items-center gap-1"><Droplets className="h-3 w-3" /> Monsoon</label>
                        <Input value={formData.weather.monsoon} onChange={(e) => setFormData({ ...formData, weather: { ...formData.weather, monsoon: e.target.value } })} placeholder="25°C - 35°C" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Calendar className="h-4 w-4" /> Best Time to Visit</label>
                      <Input value={formData.bestTimeToVisit} onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })} placeholder="October to March" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Languages className="h-4 w-4" /> Local Language</label>
                      <Input value={formData.localLanguage} onChange={(e) => setFormData({ ...formData, localLanguage: e.target.value })} placeholder="Bengali, Hindi" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-1"><Shield className="h-4 w-4" /> Emergency Numbers</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-500">Police</label>
                        <Input value={formData.emergencyNumbers.police} onChange={(e) => setFormData({ ...formData, emergencyNumbers: { ...formData.emergencyNumbers, police: e.target.value } })} placeholder="100" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Ambulance</label>
                        <Input value={formData.emergencyNumbers.ambulance} onChange={(e) => setFormData({ ...formData, emergencyNumbers: { ...formData.emergencyNumbers, ambulance: e.target.value } })} placeholder="108" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Fire</label>
                        <Input value={formData.emergencyNumbers.fire} onChange={(e) => setFormData({ ...formData, emergencyNumbers: { ...formData.emergencyNumbers, fire: e.target.value } })} placeholder="101" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center gap-1"><FileText className="h-4 w-4" /> SEO Title</label>
                    <Input value={formData.seo.title} onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } })} placeholder="Tourism in West Bengal - Discover India" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Meta Description</label>
                    <Textarea value={formData.seo.metaDescription} onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })} placeholder="Brief description for search engines..." rows={2} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Tag className="h-4 w-4" /> Keywords</label>
                    <div className="flex gap-2 mb-2">
                      <Input value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} placeholder="Add keyword..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }} />
                      <Button type="button" onClick={addKeyword} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.seo.keywords.map((kw) => (
                        <Badge key={kw} variant="secondary" className="cursor-pointer" onClick={() => removeKeyword(kw)}>{kw} <X className="h-3 w-3 ml-1" /></Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving || uploading}>{saving ? 'Saving...' : editingState ? 'Update' : 'Save'} State</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search states..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Card className="border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">State</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Capital</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Cities</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Places</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : filteredStates.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">No states found</td></tr>
                ) : (
                  filteredStates.map((state) => (
                    <tr key={state._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {state.image && <img src={state.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                          <div>
                            <p className="font-medium">{state.name}</p>
                            <p className="text-sm text-gray-500">{state.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" />{state.capital}</div>
                      </td>
                      <td className="py-4 px-6">{state.popularCities?.length || 0}</td>
                      <td className="py-4 px-6">{state.popularPlaces?.length || 0}</td>
                      <td className="py-4 px-6">
                        <button onClick={() => togglePublish(state._id, state.published)}>
                          <Badge className={state.published ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}>
                            {state.published ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            {state.published ? 'Published' : 'Draft'}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => window.open(`/states/${state.slug}`, '_blank')}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(state)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(state._id)}><Trash2 className="h-4 w-4" /></Button>
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
