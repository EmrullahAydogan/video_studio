'use client';

import { useState } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { Type, X, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TextOverlayDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TextOverlayDialog({ isOpen, onClose }: TextOverlayDialogProps) {
  const { addScene } = useProjectStore();
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [duration, setDuration] = useState(3);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!text.trim()) return;

    addScene({
      type: 'text',
      name: `Text: ${text.slice(0, 20)}...`,
      duration,
      startTime: 0,
      text,
      fontSize,
      fontFamily,
      color,
    });

    // Reset form
    setText('');
    setFontSize(48);
    setColor('#ffffff');
    setDuration(3);
    onClose();
  };

  const fonts = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Impact',
    'Comic Sans MS',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Type className="w-5 h-5" />
            Add Text Overlay
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Preview */}
          <div
            className="aspect-video rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                color,
                fontSize: `${fontSize}px`,
                fontFamily,
              }}
            >
              {text || 'Your text here...'}
            </div>
          </div>

          {/* Text Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text..."
              className="w-full h-24 px-3 py-2 text-sm border rounded-md resize-none bg-background"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Font Family */}
            <div>
              <label className="text-sm font-medium mb-2 block">Font</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
              >
                {fonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Font Size ({fontSize}px)
              </label>
              <input
                type="range"
                min="12"
                max="120"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Text Color */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Text Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                />
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Background Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">
                Duration ({duration}s)
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!text.trim()}>
            <Type className="w-4 h-4 mr-2" />
            Add Text
          </Button>
        </div>
      </div>
    </div>
  );
}
