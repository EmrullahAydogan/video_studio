'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Scene } from '@/types';
import { cn, formatTime } from '@/lib/utils';
import { GripVertical, Copy, Trash2, Image, Video, Sparkles, Type } from 'lucide-react';
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'scene-card relative h-24 bg-card border-2 rounded-lg overflow-hidden cursor-pointer group',
        isSelected && 'selected border-primary',
        isDragging && 'dragging opacity-50'
      )}
      onClick={onSelect}
    >
      {/* Thumbnail/Preview */}
      <div className="absolute inset-0">
        {scene.thumbnail ? (
          <img
            src={scene.thumbnail}
            alt={scene.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            {getIcon()}
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
        <div className="flex items-center gap-1 text-xs font-medium truncate">
          {getIcon()}
          <span className="truncate">{scene.name}</span>
        </div>
        <div className="text-[10px] text-white/70">
          {formatTime(scene.duration)}
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
        className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <div className="bg-background/80 rounded p-0.5">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      {/* Duration indicator */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {formatTime(scene.duration)}
      </div>
    </div>
  );
}
