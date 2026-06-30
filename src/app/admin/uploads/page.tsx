'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, Trash2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const initialImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', name: 'taj-mahal-1.jpg', uploadedAt: '2024-01-15', size: '2.4 MB' },
  { id: 2, url: 'https://images.unsplash.com/photo-1597074836924-8e13c0e81655?w=800', name: 'dal-lake-1.jpg', uploadedAt: '2024-01-14', size: '1.8 MB' },
  { id: 3, url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', name: 'goa-beach-1.jpg', uploadedAt: '2024-01-13', size: '3.1 MB' },
  { id: 4, url: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', name: 'munnar-1.jpg', uploadedAt: '2024-01-12', size: '2.7 MB' },
  { id: 5, url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', name: 'jaipur-fort-1.jpg', uploadedAt: '2024-01-11', size: '2.2 MB' },
  { id: 6, url: 'https://images.unsplash.com/photo-1558431460-98e7b2e29894?w=800', name: 'kolkata-1.jpg', uploadedAt: '2024-01-10', size: '1.9 MB' },
];

export default function AdminUploadsPage() {
  const [images, setImages] = useState(initialImages);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setImages(images.filter((img) => img.id !== id));
    toast.success('Image deleted successfully!');
  };

  const copyUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpload = () => {
    toast.info('Upload functionality - Connect Cloudinary API');
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Image Gallery</h1>
          <p className="text-gray-500">{images.length} images uploaded</p>
        </div>
        <Button onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-2" />
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
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop images here or click to upload</h3>
            <p className="text-sm text-gray-500">Supports: JPG, PNG, WEBP (Max 10MB each)</p>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
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
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(image.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{image.name}</p>
                <p className="text-xs text-gray-500">{image.size} • {image.uploadedAt}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
