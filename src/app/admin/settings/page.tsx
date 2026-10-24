'use client';

import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Globe, Info, Loader2, Phone, Save, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useSiteSettings } from '@/lib/hooks';
import settingsService from '@/services/settingsService';
import type { SiteSettings } from '@/types';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { settings: saved, isLoading } = useSiteSettings();
  const [form, setForm] = useState<SiteSettings>(saved);
  const [highlightsText, setHighlightsText] = useState(saved.highlights.join('\n'));
  const [saving, setSaving] = useState(false);

  // Load the saved settings into the form once they arrive from the API.
  useEffect(() => {
    if (isLoading) return;
    setForm(saved);
    setHighlightsText(saved.highlights.join('\n'));
  }, [isLoading]);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => setForm((f) => ({ ...f, [key]: value }));
  const setContact = (key: keyof SiteSettings['contact']) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, contact: { ...f.contact, [key]: e.target.value } }));
  const setAbout = (key: keyof SiteSettings['about']) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, about: { ...f.about, [key]: e.target.value } }));
  const setSocial = (key: keyof SiteSettings['social']) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, social: { ...f.social, [key]: e.target.value } }));

  const handleSave = async () => {
    if (!form.siteName.trim()) {
      toast.error('Site name is required');
      return;
    }
    setSaving(true);
    try {
      const highlights = highlightsText.split('\n').map((h) => h.trim()).filter(Boolean);
      const res = await settingsService.update({ ...form, highlights });
      queryClient.setQueryData(['site-settings'], res.data);
      toast.success('Settings saved — the website is updated.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-500">Website name, contact details and About Us content</p>
        </div>
        <Button onClick={handleSave} disabled={saving || isLoading}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="about">
            <Info className="h-4 w-4 mr-2" />
            About Us
          </TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="h-4 w-4 mr-2" />
            Social Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-0">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">General</h3>
              <Field label="Site / project name" hint="Shown in the logo, browser tab, footer and emails. The last word is highlighted in the logo.">
                <Input value={form.siteName} onChange={(e) => set('siteName', e.target.value)} />
              </Field>
              <Field label="Tagline" hint="Shown under the logo and in the browser tab title.">
                <Input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
              </Field>
              <Field label="Short description" hint="Shown in the footer and used for search engines.">
                <Textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="border-0">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">Contact details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Travel agent / contact name">
                  <Input value={form.contact.agentName} onChange={setContact('agentName')} />
                </Field>
                <Field label="Title">
                  <Input value={form.contact.agentTitle} onChange={setContact('agentTitle')} />
                </Field>
                <Field label="Phone" hint="Include the country code, e.g. +91 98765 43210.">
                  <Input value={form.contact.phone} onChange={setContact('phone')} />
                </Field>
                <Field label="WhatsApp number" hint="Leave empty to use the phone number.">
                  <Input value={form.contact.whatsapp} onChange={setContact('whatsapp')} />
                </Field>
                <Field label="Email">
                  <Input type="email" value={form.contact.email} onChange={setContact('email')} />
                </Field>
                <Field label="Working hours">
                  <Input value={form.contact.workingHours} onChange={setContact('workingHours')} />
                </Field>
              </div>
              <Field label="Address">
                <Input value={form.contact.address} onChange={setContact('address')} />
              </Field>
              <Field label="Google Maps link (optional)" hint="If empty, the address is searched on Google Maps.">
                <Input value={form.contact.mapUrl} onChange={setContact('mapUrl')} placeholder="https://maps.google.com/..." />
              </Field>
              <Field label="Service highlights" hint="One per line — shown on the home page, booking dialog and About page.">
                <Textarea rows={4} value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card className="border-0">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">About Us page</h3>
              <Field label="Heading">
                <Input value={form.about.heading} onChange={setAbout('heading')} />
              </Field>
              <Field label="Intro" hint="Short line shown in the page header.">
                <Textarea rows={2} value={form.about.intro} onChange={setAbout('intro')} />
              </Field>
              <Field label="Our story" hint="Leave a blank line between paragraphs.">
                <Textarea rows={8} value={form.about.story} onChange={setAbout('story')} />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Mission">
                  <Textarea rows={3} value={form.about.mission} onChange={setAbout('mission')} />
                </Field>
                <Field label="Vision">
                  <Textarea rows={3} value={form.about.vision} onChange={setAbout('vision')} />
                </Field>
              </div>
              <Field label="Header image URL">
                <Input value={form.about.image} onChange={setAbout('image')} placeholder="https://..." />
              </Field>
              {form.about.image && (
                <img src={form.about.image} alt="" className="h-40 w-full max-w-md rounded-lg object-cover" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="border-0">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">Social links</h3>
              <p className="text-sm text-gray-500">Only links you fill in are shown in the footer.</p>
              <Field label="Facebook">
                <Input value={form.social.facebook} onChange={setSocial('facebook')} placeholder="https://facebook.com/..." />
              </Field>
              <Field label="Instagram">
                <Input value={form.social.instagram} onChange={setSocial('instagram')} placeholder="https://instagram.com/..." />
              </Field>
              <Field label="X (Twitter)">
                <Input value={form.social.twitter} onChange={setSocial('twitter')} placeholder="https://x.com/..." />
              </Field>
              <Field label="YouTube">
                <Input value={form.social.youtube} onChange={setSocial('youtube')} placeholder="https://youtube.com/..." />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
