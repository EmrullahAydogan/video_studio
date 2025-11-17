'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Scene } from '@/types';
import { cn, formatTime } from '@/lib/utils';
import { GripVertical, Copy, Trash2, Image, Video, Sparkles, Type, Zap, Scissors, RotateCw, FlipHorizontal, Crop } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SceneCardProps {
  scene: Scene;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  zoom: number;
}

export function SceneCard({
  scene,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
  zoom,
}: SceneCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${scene.duration * zoom}px`,
  };

  const getIcon = () => {
    switch (scene.type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'ai-generated':
        return <Sparkles className="w-4 h-4" />;
      case 'text':
        return <Type className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Calculate number of thumbnail frames to show based on width
  const numFrames = Math.max(1, Math.floor((scene.duration * zoom) / 80));
  const showMultipleThumbnails = numFrames > 1 && scene.thumbnail;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'scene-card relative h-24 bg-card border-2 rounded-lg overflow-hidden cursor-pointer group',
        isSelected && 'selected border-primary ring-2 ring-primary/20',
        isDragging && 'dragging opacity-50'
      )}
      onClick={onSelect}
    >
      {/* Thumbnail/Preview - Filmstrip style */}
      <div className="absolute inset-0">
        {scene.thumbnail ? (
          showMultipleThumbnails ? (
            // Multiple thumbnails (filmstrip)
            <div className="flex h-full">
              {Array.from({ length: numFrames }).map((_, i) => (
                <div key={i} className="flex-1 h-full border-r border-border/20 last:border-r-0">
                  <img
                    src={scene.thumbnail}
                    alt={`${scene.name} frame ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            // Single thumbnail
            <img
              src={scene.thumbnail}
              alt={scene.name}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            {getIcon()}
          </div>
        )}
      </div>

      {/* Trim indicators */}
      {(scene.trimStart || scene.trimEnd) && (
        <>
          {scene.trimStart && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500/60" />
          )}
          {scene.trimEnd && (
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-yellow-500/60" />
          )}
        </>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Effect Indicators */}
      <div className="absolute top-1 left-1 flex gap-1 z-10">
        {scene.playbackSpeed && scene.playbackSpeed !== 1 && (
          <div className="bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5" title={`${scene.playbackSpeed}x speed`}>
            <Zap className="w-2.5 h-2.5" />
            {scene.playbackSpeed}x
          </div>
        )}
        {scene.backgroundRemoval?.enabled && (
          <div className="bg-purple-500 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5" title="Background removed">
            <Sparkles className="w-2.5 h-2.5" />
          </div>
        )}
        {(scene.trimStart || scene.trimEnd) && (
          <div className="bg-yellow-500 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5" title="Trimmed">
            <Scissors className="w-2.5 h-2.5" />
          </div>
        )}
        {scene.transform && (
          <>
            {scene.transform.rotate && scene.transform.rotate !== 0 && (
              <div className="bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5" title={`Rotated ${scene.transform.rotate}°`}>
                <RotateCw className="w-2.5 h-2.5" />
              </div>
            )}
            {(scene.transform.flipHorizontal || scene.transform.flipVertical) && (
              <div className="bg-teal-500 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5" title="Flipped">
                <FlipHorizontal className="w-2.5 h-2.5" />
              </div>
            )}
            {scene.transform.crop && (
              <div className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5" title="Cropped">
                <Crop className="w-2.5 h-2.5" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
        <div className="flex items-center gap-1 text-xs font-medium truncate">
          {getIcon()}
          <span className="truncate">{scene.name}</span>
        </div>
        <div className="text-[10px] text-white/70">
          {formatTime(scene.duration)}
          {scene.playbackSpeed && scene.playbackSpeed !== 1 && (
            <span className="ml-1">• {scene.playbackSpeed}x</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button
          size="icon"
          variant="secondary"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
        >
          <Copy className="w-3 h-3" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-20"
      >
        <div className="bg-background/90 rounded p-0.5 shadow-md">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      {/* Duration indicator (on hover) */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm">
        {formatTime(scene.duration)}
      </div>
    </div>
  );
}
