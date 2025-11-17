'use client';

import { AudioTrack } from '@/types';
import { Volume2, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface AudioTrackCardProps {
  track: AudioTrack;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  zoom: number;
}

export function AudioTrackCard({
  track,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
  zoom,
}: AudioTrackCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${track.duration * zoom}px`,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative h-16 rounded-lg border-2 overflow-hidden cursor-grab active:cursor-grabbing
        ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
        bg-gradient-to-r from-purple-500/20 to-pink-500/20
        hover:border-primary/50 transition-colors
      `}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Audio waveform visual effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="flex gap-px h-full items-center">
          {Array.from({ length: Math.floor(track.duration * 10) }).map((_, i) => (
            <div
              key={i}
              className="w-0.5 bg-purple-500"
              style={{
                height: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full p-2 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <Volume2 className="w-3 h-3 text-purple-500 flex-shrink-0" />
              <span className="text-xs font-medium truncate">{track.name}</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {track.duration.toFixed(1)}s • {Math.round(track.volume * 100)}%
            </div>
          </div>

          {/* Actions */}
          {isSelected && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Fade indicators */}
        {(track.fadeIn || track.fadeOut) && (
          <div className="text-[9px] text-muted-foreground">
            {track.fadeIn && `↗ ${track.fadeIn}s`}
            {track.fadeIn && track.fadeOut && ' • '}
            {track.fadeOut && `↘ ${track.fadeOut}s`}
          </div>
        )}
      </div>

      {/* Fade in visual */}
      {track.fadeIn && (
        <div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none"
          style={{ width: `${(track.fadeIn / track.duration) * 100}%` }}
        />
      )}

      {/* Fade out visual */}
      {track.fadeOut && (
        <div
          className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-black/40 to-transparent pointer-events-none"
          style={{ width: `${(track.fadeOut / track.duration) * 100}%` }}
        />
      )}
    </div>
  );
}
