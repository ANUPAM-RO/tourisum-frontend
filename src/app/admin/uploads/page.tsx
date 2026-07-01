'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import api from '@/lib/api';

interface GalleryImage {
  id: string;
  url: string;
  publicId: string;
  name: string;
  uploadedAt: string;
}

export default function AdminUploadsPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (e: any) => {
      const files = Array.from(e.target.files) as File[];
      if (!files.length) return;
      setUploading(true);
      try {
        const fd = new FormData();
        files.forEach((f) => fd.append('images', f));
        const res = await api.post('/upload/multiple', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res.data.success) {
          const uploaded: GalleryImage[] = res.data.data.map((img: any, i: number) => ({
            id: img.publicId,
            url: img.url,
            publicId: img.publicId,
            name: files[i]?.name || img.publicId,
            uploadedAt: new Date().toISOString().slice(0, 10),
          }));
          setImages((prev) => [...uploaded, ...prev]);
          toast.success(`${uploaded.length} image(s) uploaded!`);
        }
      } catch {
        toast.error('Upload failed');
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  const handleDelete = async (image: GalleryImage) => {
    try {
      await api.delete('/upload', { data: { publicId: image.publicId } });
      setImages((prev) => prev.filter((img) => img.id !== image.id));
      toast.success('Image deleted successfully!');
    } catch {
      toast.error('Failed to delete image');
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Image Gallery</h1>
          <p className="text-gray-500">{images.length} images uploaded this session</p>
        </div>
        <Button onClick={handleUpload} disabled={uploading}>
          {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
          Upload Images
        </Button>
      </div>

      {/* Upload Area */}
      <Card className="border-0 mb-8">
        <CardContent className="p-8">
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
            onClick={handleUpload}
          >
            {uploading ? (
              <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            )}
            <h3 className="text-lg font-semibold mb-2">{uploading ? 'Uploading...' : 'Drop images here or click to upload'}</h3>
            <p className="text-sm text-gray-500">Supports: JPG, PNG, WEBP (Max 10MB each)</p>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      {images.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No images uploaded yet in this session.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-0 overflow-hidden group">
                <div className="relative aspect-square">
                  <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" onClick={() => copyUrl(image.url, image.id)}>
                      {copiedId === image.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => handleDelete(image)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate">{image.name}</p>
                  <p className="text-xs text-gray-500">{image.uploadedAt}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
