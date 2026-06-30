'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Building2,
  Hotel,
  UtensilsCrossed,
  Users,
  FileText,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Filter,
  Loader2,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import adminService, { DashboardStats } from '@/services/adminService';
import api from '@/lib/api';

const statConfig = [
  { key: 'states' as keyof DashboardStats, label: 'Total States', icon: MapPin, color: 'from-blue-500 to-cyan-500' },
  { key: 'cities' as keyof DashboardStats, label: 'Total Cities', icon: Building2, color: 'from-emerald-500 to-green-500' },
  { key: 'places' as keyof DashboardStats, label: 'Total Places', icon: MapPin, color: 'from-purple-500 to-pink-500' },
  { key: 'hotels' as keyof DashboardStats, label: 'Total Hotels', icon: Hotel, color: 'from-orange-500 to-red-500' },
  { key: 'restaurants' as keyof DashboardStats, label: 'Total Restaurants', icon: UtensilsCrossed, color: 'from-indigo-500 to-blue-500' },
  { key: 'users' as keyof DashboardStats, label: 'Total Users', icon: Users, color: 'from-teal-500 to-emerald-500' },
];

interface RecentItem {
  _id: string;
  name: string;
  type: string;
  state?: string;
  published: boolean;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        if (response.success) setStats(response.data);
      } catch {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const [placesRes, hotelsRes, restaurantsRes] = await Promise.all([
          api.get('/places?limit=5'),
          api.get('/hotels?limit=5'),
          api.get('/restaurants?limit=5'),
        ]);

        const items: RecentItem[] = [
          ...(placesRes.data.data || []).map((p: any) => ({
            _id: p._id, name: p.name, type: 'Place',
            state: p.state?.name || '', published: p.published, createdAt: p.createdAt,
          })),
          ...(hotelsRes.data.data || []).map((h: any) => ({
            _id: h._id, name: h.name, type: 'Hotel',
            state: h.address?.split(',').pop()?.trim() || '', published: h.published, createdAt: h.createdAt,
          })),
          ...(restaurantsRes.data.data || []).map((r: any) => ({
            _id: r._id, name: r.name, type: 'Restaurant',
            state: r.address?.split(',').pop()?.trim() || '', published: r.published, createdAt: r.createdAt,
          })),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

        setRecentItems(items);
      } catch {
        toast.error('Failed to load recent items');
      } finally {
        setLoadingRecent(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening with your tourism platform.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statConfig.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="border-0 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                      {loadingStats ? (
                        <div className="h-9 w-16 bg-gray-100 animate-pulse rounded mt-1" />
                      ) : (
                        <p className="text-3xl font-bold">
                          {stats ? stats[stat.key].toLocaleString() : '—'}
                        </p>
                      )}
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  {stats && stat.key === 'places' && (
                    <p className="text-xs text-gray-400 mt-2">
                      {stats.publishedPlaces} published
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/states">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                  <Plus className="h-5 w-5" />
                  <span>Add State</span>
                </Button>
              </Link>
              <Link href="/admin/cities">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                  <Plus className="h-5 w-5" />
                  <span>Add City</span>
                </Button>
              </Link>
              <Link href="/admin/places">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                  <Plus className="h-5 w-5" />
                  <span>Add Place</span>
                </Button>
              </Link>
              <Link href="/admin/hotels">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                  <Plus className="h-5 w-5" />
                  <span>Add Hotel</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Items */}
        <Card className="border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Items</h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">State</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingRecent ? (
                    <tr><td colSpan={6} className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                  ) : recentItems.length === 0 ? (
                    <tr><td colSpan={6} className="py-8 text-center text-gray-500">No items found</td></tr>
                  ) : (
                    recentItems.map((item) => (
                      <tr key={item._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{item.type}</Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{item.state || '—'}</td>
                        <td className="py-3 px-4">
                          <Badge className={item.published ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}>
                            {item.published ? 'Published' : 'Draft'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
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
      </motion.div>
    </div>
  );
}
