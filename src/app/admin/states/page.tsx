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
import { toast } from 'sonner';
import api from '@/lib/api';

interface StateItem {
  _id: string;
  name: string;
  slug: string;
  capital: string;
  description: string;
  published: boolean;
  popularPlaces?: any[];
}

export default function AdminStatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingState, setEditingState] = useState<StateItem | null>(null);
  const [states, setStates] = useState<StateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', slug: '', capital: '', description: '' });

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

  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.capital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingState) {
        await api.put(`/states/${editingState._id}`, formData);
        toast.success('State updated successfully!');
      } else {
        await api.post('/states', { ...formData, published: true });
        toast.success('State added successfully!');
      }
      setDialogOpen(false);
      setEditingState(null);
      setFormData({ name: '', slug: '', capital: '', description: '' });
      fetchStates();
    } catch {
      toast.error('Failed to save state');
    }
  };

  const handleEdit = (state: StateItem) => {
    setEditingState(state);
    setFormData({ name: state.name, slug: state.slug, capital: state.capital, description: state.description || '' });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
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

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage States</h1>
          <p className="text-gray-500">{states.length} total states</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingState(null); setFormData({ name: '', slug: '', capital: '', description: '' }); } }}>
          <DialogTrigger>
            <Button onClick={() => setEditingState(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New State
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingState ? 'Edit State' : 'Add New State'}</DialogTitle>
              <DialogDescription>Fill in the details for the state</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">State Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g., West Bengal"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Slug</label>
                <Input value={formData.slug} readOnly className="bg-gray-100" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Capital</label>
                <Input value={formData.capital} onChange={(e) => setFormData({ ...formData, capital: e.target.value })} placeholder="e.g., Kolkata" required />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingState ? 'Update' : 'Save'} State</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search states..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      {/* States Table */}
      <Card className="border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">State</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Capital</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Places</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : filteredStates.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-500">No states found</td></tr>
                ) : (
                  filteredStates.map((state) => (
                    <tr key={state._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium">{state.name}</p>
                          <p className="text-sm text-gray-500">{state.slug}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {state.capital}
                        </div>
                      </td>
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
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
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
