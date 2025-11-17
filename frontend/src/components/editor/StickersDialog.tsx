'use client';

import { useState } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { Smile, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STICKERS, Sticker } from '@/lib/stickers';

interface StickersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StickersDialog({ isOpen, onClose }: StickersDialogProps) {
  const { addScene, project } = useProjectStore();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'emoji' | 'shape' | 'icon'>('all');

  if (!isOpen) return null;

  const filteredStickers = selectedCategory === 'all'
    ? STICKERS
    : STICKERS.filter(s => s.category === selectedCategory);

  const handleAddSticker = (sticker: Sticker) => {
    const totalDuration = project?.scenes.reduce(
      (max, scene) => Math.max(max, scene.startTime + scene.duration),
      0
    ) ?? 0;

    addScene({
      type: 'text',
      name: `Sticker: ${sticker.name}`,
      duration: 3,
      startTime: totalDuration,
      text: sticker.content,
      fontSize: 120,
      fontFamily: 'Arial',
      color: '#000000',
      backgroundColor: 'transparent',
      position: { x: 50, y: 50 },
      scale: 1,
      opacity: 1,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-card border rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Smile className="w-5 h-5" />
            Stickers & Graphics
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b bg-secondary/30">
          {[
            { id: 'all', label: 'All' },
            { id: 'emoji', label: 'Emojis' },
            { id: 'shape', label: 'Shapes' },
            { id: 'icon', label: 'Icons' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                selectedCategory === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
            {filteredStickers.map((sticker) => (
              <button
                key={sticker.id}
                onClick={() => handleAddSticker(sticker)}
                className="aspect-square flex items-center justify-center text-4xl border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                title={sticker.name}
              >
                {sticker.content}
              </button>
            ))}
          </div>

          {filteredStickers.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              No stickers found in this category
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Click a sticker to add it to your timeline
          </div>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
