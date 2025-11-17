'use client';

import { useState } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import {
  Film,
  Image,
  Music,
  FileText,
  Upload,
  FolderOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type AssetType = 'all' | 'videos' | 'images' | 'audio' | 'text';

export function AssetPanel() {
  const { addScene } = useProjectStore();
  const [activeTab, setActiveTab] = useState<AssetType>('all');

  const tabs = [
    { id: 'all' as AssetType, label: 'All', icon: FolderOpen },
    { id: 'videos' as AssetType, label: 'Videos', icon: Film },
    { id: 'images' as AssetType, label: 'Images', icon: Image },
    { id: 'audio' as AssetType, label: 'Audio', icon: Music },
    { id: 'text' as AssetType, label: 'Text', icon: FileText },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (isVideo || isImage) {
        // Create object URL for preview
        const src = URL.createObjectURL(file);

        // For demo purposes, create a scene
        // In production, you'd upload to server first
        addScene({
          type: isVideo ? 'video' : 'image',
          name: file.name,
          duration: 5, // Default duration
          startTime: 0,
          src,
        });
      }
    }

    // Reset input
    e.target.value = '';
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Assets</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your media files
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex flex-col gap-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assets List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {/* Empty state */}
          <div className="text-center py-8">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              No assets yet
            </p>

            <label htmlFor="file-upload">
              <Button size="sm" asChild>
                <span className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </span>
              </Button>
            </label>

            <input
              id="file-upload"
              type="file"
              multiple
              accept="video/*,image/*,audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="p-4 border-t">
        <label
          htmlFor="file-upload-bottom"
          className="block"
        >
          <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-accent transition-colors cursor-pointer">
            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Drop files here or click to upload
            </p>
          </div>
        </label>

        <input
          id="file-upload-bottom"
          type="file"
          multiple
          accept="video/*,image/*,audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
