'use client';

import { useState, useRef } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { Music, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AudioUploadDialog({ isOpen, onClose }: AudioUploadDialogProps) {
  const { addAudioTrack } = useProjectStore();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(5);
  const [volume, setVolume] = useState(100);
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    setName(file.name.replace(/\.[^/.]+$/, ''));

    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    // Get duration from audio file
    const audio = new Audio(url);
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
  };

  const handleAdd = () => {
    if (!audioUrl) return;

    addAudioTrack({
      name: name || 'Untitled Audio',
      src: audioUrl,
      startTime: 0,
      duration,
      volume: volume / 100,
      fadeIn: fadeIn > 0 ? fadeIn : undefined,
      fadeOut: fadeOut > 0 ? fadeOut : undefined,
    });

    // Reset form
    setName('');
    setDuration(5);
    setVolume(100);
    setFadeIn(0);
    setFadeOut(0);
    setAudioFile(null);
    setAudioUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Music className="w-5 h-5" />
            Add Audio Track
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
          {/* File Upload */}
          <div>
            <label className="text-sm font-medium mb-2 block">Audio File</label>
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {audioFile ? (
                <div className="flex items-center justify-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  <span className="text-sm">{audioFile.name}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload audio file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP3, WAV, OGG supported
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Audio Preview */}
          {audioUrl && (
            <div>
              <label className="text-sm font-medium mb-2 block">Preview</label>
              <audio src={audioUrl} controls className="w-full" />
            </div>
          )}

          {/* Track Name */}
          <div>
            <label className="text-sm font-medium mb-2 block">Track Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter track name..."
              className="w-full px-3 py-2 text-sm border rounded-md bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Volume */}
            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">
                Volume ({volume}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Fade In */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Fade In ({fadeIn.toFixed(1)}s)
              </label>
              <input
                type="range"
                min="0"
                max={Math.min(duration / 2, 5)}
                step="0.1"
                value={fadeIn}
                onChange={(e) => setFadeIn(parseFloat(e.target.value))}
                className="w-full"
                disabled={!audioUrl}
              />
            </div>

            {/* Fade Out */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Fade Out ({fadeOut.toFixed(1)}s)
              </label>
              <input
                type="range"
                min="0"
                max={Math.min(duration / 2, 5)}
                step="0.1"
                value={fadeOut}
                onChange={(e) => setFadeOut(parseFloat(e.target.value))}
                className="w-full"
                disabled={!audioUrl}
              />
            </div>

            {/* Duration */}
            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">
                Duration ({duration.toFixed(1)}s)
              </label>
              <div className="text-xs text-muted-foreground">
                Automatically detected from audio file
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!audioUrl}>
            <Music className="w-4 h-4 mr-2" />
            Add Audio Track
          </Button>
        </div>
      </div>
    </div>
  );
}
