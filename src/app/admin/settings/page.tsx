'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Globe, Mail, Shield, Database, Key, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'India Tourism',
    siteUrl: 'http://localhost:3000',
    adminEmail: 'admin@indiatourism.com',
    googleMapsKey: '',
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    jwtSecret: '',
    enableNotifications: true,
    enableReviews: true,
    enableFavorites: true,
    maintenanceMode: false,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-500">Manage your application settings</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-0">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">General Settings</h3>
              <div>
                <label className="text-sm font-medium mb-2 block">Site Name</label>
                <Input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Site URL</label>
                <Input value={settings.siteUrl} onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Admin Email</label>
                <Input type="email" value={settings.adminEmail} onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })} />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">Enable Reviews</p>
                  <p className="text-sm text-gray-500">Allow users to write reviews</p>
                </div>
                <Switch checked={settings.enableReviews} onCheckedChange={(checked) => setSettings({ ...settings, enableReviews: checked })} />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">Enable Favorites</p>
                  <p className="text-sm text-gray-500">Allow users to save favorites</p>
                </div>
                <Switch checked={settings.enableFavorites} onCheckedChange={(checked) => setSettings({ ...settings, enableFavorites: checked })} />
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-red-600">Maintenance Mode</p>
                  <p className="text-sm text-gray-500">Put site in maintenance mode</p>
                </div>
                <Switch checked={settings.maintenanceMode} onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="border-0">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">API Keys</h3>
              <div>
                <label className="text-sm font-medium mb-2 block">Google Maps API Key</label>
                <Input value={settings.googleMapsKey} onChange={(e) => setSettings({ ...settings, googleMapsKey: e.target.value })} placeholder="Enter Google Maps API Key" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Cloudinary Cloud Name</label>
                <Input value={settings.cloudinaryCloudName} onChange={(e) => setSettings({ ...settings, cloudinaryCloudName: e.target.value })} placeholder="Enter Cloudinary Cloud Name" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Cloudinary API Key</label>
                <Input value={settings.cloudinaryApiKey} onChange={(e) => setSettings({ ...settings, cloudinaryApiKey: e.target.value })} placeholder="Enter Cloudinary API Key" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Cloudinary API Secret</label>
                <Input type="password" value={settings.cloudinaryApiSecret} onChange={(e) => setSettings({ ...settings, cloudinaryApiSecret: e.target.value })} placeholder="Enter Cloudinary API Secret" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-0">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <div>
                <label className="text-sm font-medium mb-2 block">JWT Secret</label>
                <Input type="password" value={settings.jwtSecret} onChange={(e) => setSettings({ ...settings, jwtSecret: e.target.value })} placeholder="Enter JWT Secret" />
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="font-medium text-yellow-700 dark:text-yellow-400">Security Notice</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Keep your JWT secret and API keys secure. Never share them publicly.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-0">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">Enable Notifications</p>
                  <p className="text-sm text-gray-500">Send email notifications</p>
                </div>
                <Switch checked={settings.enableNotifications} onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card className="border-0">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">Database Settings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-0 bg-blue-50 dark:bg-blue-900/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">28</p>
                    <p className="text-sm text-gray-500">States</p>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-emerald-50 dark:bg-emerald-900/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">156</p>
                    <p className="text-sm text-gray-500">Cities</p>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-purple-50 dark:bg-purple-900/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">450</p>
                    <p className="text-sm text-gray-500">Places</p>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-orange-50 dark:bg-orange-900/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">1,250</p>
                    <p className="text-sm text-gray-500">Users</p>
                  </CardContent>
                </Card>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="font-medium text-yellow-700 dark:text-yellow-400">Database Backup</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Regular backups are recommended. Contact your database administrator for backup procedures.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
