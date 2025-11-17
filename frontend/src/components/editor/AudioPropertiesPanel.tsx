'use client';

import { useProjectStore } from '@/stores/useProjectStore';
import { Music, Volume2, TrendingUp, TrendingDown, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPropertiesPanelProps {
  trackId: string;
}

export function AudioPropertiesPanel({ trackId }: AudioPropertiesPanelProps) {
  const { project, updateAudioTrack, deleteAudioTrack } = useProjectStore();

  const track = project?.audioTracks.find((t) => t.id === trackId);

  if (!track) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Music className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p className="text-sm">Select an audio track to view properties</p>
      </div>
    );
  }

  const handleUpdate = (updates: any) => {
    updateAudioTrack(trackId, updates);
  };

  const handleDuplicate = () => {
    const newTrack = {
      ...track,
      name: `${track.name} (Copy)`,
    };
    useProjectStore.getState().addAudioTrack(newTrack);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold">Audio Properties</h3>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDuplicate}
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => deleteAudioTrack(trackId)}
              title="Delete"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Track Name */}
        <div>
          <label className="text-sm font-medium mb-2 block">Track Name</label>
          <input
            type="text"
            value={track.name}
            onChange={(e) => handleUpdate({ name: e.target.value })}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background"
          />
        </div>

        {/* Duration (read-only) */}
        <div>
          <label className="text-sm font-medium mb-2 block">Duration</label>
          <div className="text-sm text-muted-foreground">
            {track.duration.toFixed(2)} seconds
          </div>
        </div>

        {/* Volume Control */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Volume
            </label>
            <span className="text-sm text-muted-foreground">
              {Math.round(track.volume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={track.volume * 100}
            onChange={(e) =>
              handleUpdate({ volume: parseInt(e.target.value) / 100 })
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Fade In */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Fade In
            </label>
            <span className="text-sm text-muted-foreground">
              {(track.fadeIn || 0).toFixed(1)}s
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.min(track.duration / 2, 5)}
            step="0.1"
            value={track.fadeIn || 0}
            onChange={(e) =>
              handleUpdate({
                fadeIn: parseFloat(e.target.value) > 0 ? parseFloat(e.target.value) : undefined,
              })
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0s</span>
            <span>{Math.min(track.duration / 2, 5).toFixed(1)}s</span>
          </div>
        </div>

        {/* Fade Out */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Fade Out
            </label>
            <span className="text-sm text-muted-foreground">
              {(track.fadeOut || 0).toFixed(1)}s
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.min(track.duration / 2, 5)}
            step="0.1"
            value={track.fadeOut || 0}
            onChange={(e) =>
              handleUpdate({
                fadeOut: parseFloat(e.target.value) > 0 ? parseFloat(e.target.value) : undefined,
              })
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0s</span>
            <span>{Math.min(track.duration / 2, 5).toFixed(1)}s</span>
          </div>
        </div>

        {/* Visual Preview */}
        <div className="p-4 bg-secondary/50 rounded-lg">
          <div className="text-xs font-medium mb-2">Fade Preview</div>
          <div className="h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded relative overflow-hidden">
            {/* Fade in indicator */}
            {track.fadeIn && (
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-black/40 to-transparent"
                style={{ width: `${(track.fadeIn / track.duration) * 100}%` }}
              />
            )}
            {/* Fade out indicator */}
            {track.fadeOut && (
              <div
                className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-black/40 to-transparent"
                style={{ width: `${(track.fadeOut / track.duration) * 100}%` }}
              />
            )}
            {/* Waveform effect */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="flex gap-px h-full items-center">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-purple-500"
                    style={{
                      height: `${Math.sin(i / 5) * 50 + 50}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
