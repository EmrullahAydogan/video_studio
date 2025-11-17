'use client';

import { useRef, useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useProjectStore } from '@/stores/useProjectStore';
import { SceneCard } from './SceneCard';
import { AudioTrackCard } from './AudioTrackCard';
import { formatTime } from '@/lib/utils';
import { Plus, ZoomIn, ZoomOut, Upload, Maximize2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Timeline() {
  const {
    project,
    timeline,
    reorderScenes,
    deleteScene,
    duplicateScene,
    setSelectedScene,
    setCurrentTime,
    setZoom,
    deleteAudioTrack,
    updateAudioTrack,
    addScene,
  } = useProjectStore();

  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update playhead position
  useEffect(() => {
    if (playheadRef.current) {
      playheadRef.current.style.left = `${timeline.currentTime * timeline.zoom}px`;
    }
  }, [timeline.currentTime, timeline.zoom]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = project?.scenes.findIndex((s) => s.id === active.id) ?? -1;
      const newIndex = project?.scenes.findIndex((s) => s.id === over.id) ?? -1;

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(
          project?.scenes.map((s) => s.id) ?? [],
          oldIndex,
          newIndex
        );
        reorderScenes(newOrder);
      }
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = x / timeline.zoom;
    setCurrentTime(time);
  };

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(10, Math.min(200, timeline.zoom + delta));
    setZoom(newZoom);
  };

  const handleFitToView = () => {
    if (!timelineRef.current || !project) return;
    const totalDuration = project.scenes.reduce(
      (max, scene) => Math.max(max, scene.startTime + scene.duration),
      10
    );
    const containerWidth = timelineRef.current.offsetWidth;
    const optimalZoom = Math.max(10, Math.min(200, (containerWidth - 100) / totalDuration));
    setZoom(optimalZoom);
  };

  const handlePan = (direction: 'left' | 'right') => {
    if (!timelineRef.current) return;
    const scrollAmount = 200;
    const newScroll = timelineRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
    timelineRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const totalDuration = project?.scenes.reduce(
      (max, scene) => Math.max(max, scene.startTime + scene.duration),
      0
    ) ?? 0;

    for (const file of files) {
      const fileType = file.type;

      // Handle video files
      if (fileType.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        addScene({
          type: 'video',
          name: file.name,
          src: url,
          duration: 5, // Default duration, will be updated when video loads
          startTime: totalDuration,
          thumbnail: url,
        });
      }
      // Handle image files
      else if (fileType.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        addScene({
          type: 'image',
          name: file.name,
          src: url,
          duration: 3, // Default 3 seconds for images
          startTime: totalDuration,
          thumbnail: url,
        });
      }
      // Handle audio files
      else if (fileType.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        useProjectStore.getState().addAudioTrack({
          name: file.name,
          src: url,
          startTime: 0,
          duration: 5, // Default duration
          volume: 1,
        });
      }
    }
  };

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No project loaded
      </div>
    );
  }

  const totalDuration = project.scenes.reduce(
    (max, scene) => Math.max(max, scene.startTime + scene.duration),
    0
  );

  return (
    <div
      className={`h-full flex flex-col bg-background border-t relative ${
        isDragging ? 'ring-4 ring-primary ring-inset' : ''
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-card border-2 border-primary rounded-lg p-8 shadow-lg">
            <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
            <p className="text-xl font-semibold text-center">Drop files here</p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Supports video, image, and audio files
            </p>
          </div>
        </div>
      )}

      {/* Timeline Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Timeline</span>
          <span className="text-xs text-muted-foreground">
            {formatTime(timeline.currentTime)} / {formatTime(totalDuration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Pan Controls */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handlePan('left')}
            title="Pan left (or use Arrow Left)"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handlePan('right')}
            title="Pan right (or use Arrow Right)"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="h-6 w-px bg-border mx-1" />

          {/* Zoom Controls */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleZoom(-10)}
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>

          {/* Zoom Slider */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={timeline.zoom}
              onChange={(e) => setZoom(parseInt(e.target.value))}
              className="w-24 h-1 bg-secondary rounded-lg cursor-pointer"
              title={`Zoom: ${Math.round((timeline.zoom / 50) * 100)}%`}
            />
            <span className="text-xs text-muted-foreground w-12 text-center">
              {Math.round((timeline.zoom / 50) * 100)}%
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleZoom(10)}
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>

          {/* Fit to View */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleFitToView}
            title="Fit timeline to view"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timeline Ruler */}
      <div className="relative h-8 bg-secondary border-b overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ width: `${totalDuration * timeline.zoom}px` }}
        >
          {Array.from({ length: Math.ceil(totalDuration) }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-l border-border"
              style={{ left: `${i * timeline.zoom}px` }}
            >
              <span className="absolute top-1 left-1 text-[10px] text-muted-foreground">
                {formatTime(i)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <div
          ref={timelineRef}
          className="relative min-h-full p-4 timeline-grid cursor-pointer"
          onClick={handleTimelineClick}
          style={{ width: `${Math.max(totalDuration * timeline.zoom, 1000)}px` }}
        >
          {/* Playhead */}
          <div
            ref={playheadRef}
            className="timeline-playhead"
            style={{ left: `${timeline.currentTime * timeline.zoom}px` }}
          />

          {/* Video Track */}
          <div className="mb-4">
            <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
              Video Track
              <Button size="sm" variant="ghost" className="h-6">
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={project.scenes.map((s) => s.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex gap-2 items-start">
                  {project.scenes.length === 0 ? (
                    <div className="h-24 px-4 flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                      Drop scenes here or click + to add
                    </div>
                  ) : (
                    project.scenes.map((scene) => (
                      <SceneCard
                        key={scene.id}
                        scene={scene}
                        isSelected={timeline.selectedSceneId === scene.id}
                        onSelect={() => setSelectedScene(scene.id)}
                        onDuplicate={() => duplicateScene(scene.id)}
                        onDelete={() => deleteScene(scene.id)}
                        zoom={timeline.zoom}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Audio Track */}
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
              Audio Track
            </div>
            <div className="flex gap-2 items-start">
              {project.audioTracks.length === 0 ? (
                <div className="h-16 px-4 flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                  Add audio tracks from toolbar
                </div>
              ) : (
                project.audioTracks.map((track) => (
                  <AudioTrackCard
                    key={track.id}
                    track={track}
                    isSelected={false}
                    onSelect={() => {}}
                    onDuplicate={() => {
                      const newTrack = {
                        ...track,
                        id: crypto.randomUUID(),
                        name: `${track.name} (Copy)`,
                      };
                      useProjectStore.getState().addAudioTrack(newTrack);
                    }}
                    onDelete={() => deleteAudioTrack(track.id)}
                    zoom={timeline.zoom}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
