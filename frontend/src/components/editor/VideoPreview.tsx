'use client';

import { useRef, useEffect } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';

export function VideoPreview() {
  const { project, timeline, setCurrentTime, setIsPlaying } = useProjectStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (timeline.isPlaying) {
      const startTime = Date.now();
      const startCurrentTime = timeline.currentTime;

      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const newTime = startCurrentTime + elapsed;

        const totalDuration = project?.scenes.reduce(
          (max, scene) => Math.max(max, scene.startTime + scene.duration),
          0
        ) ?? 0;

        if (newTime >= totalDuration) {
          setIsPlaying(false);
          setCurrentTime(0);
        } else {
          setCurrentTime(newTime);
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [timeline.isPlaying, project, setCurrentTime, setIsPlaying]);

  // Render current frame on canvas
  useEffect(() => {
    if (!canvasRef.current || !project) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Find current scene
    const currentScene = project.scenes.find(
      (scene) =>
        timeline.currentTime >= scene.startTime &&
        timeline.currentTime < scene.startTime + scene.duration
    );

    if (currentScene) {
      // Draw scene
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw placeholder text
      ctx.fillStyle = '#fff';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        currentScene.name,
        canvas.width / 2,
        canvas.height / 2
      );

      // Draw scene type
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#888';
      ctx.fillText(
        currentScene.type.toUpperCase(),
        canvas.width / 2,
        canvas.height / 2 + 30
      );
    } else {
      // No scene at current time
      ctx.fillStyle = '#666';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        'No scene at current time',
        canvas.width / 2,
        canvas.height / 2
      );
    }
  }, [project, timeline.currentTime]);

  const togglePlayPause = () => {
    setIsPlaying(!timeline.isPlaying);
  };

  const skipBackward = () => {
    setCurrentTime(Math.max(0, timeline.currentTime - 5));
  };

  const skipForward = () => {
    const totalDuration = project?.scenes.reduce(
      (max, scene) => Math.max(max, scene.startTime + scene.duration),
      0
    ) ?? 0;
    setCurrentTime(Math.min(totalDuration, timeline.currentTime + 5));
  };

  const totalDuration = project?.scenes.reduce(
    (max, scene) => Math.max(max, scene.startTime + scene.duration),
    0
  ) ?? 0;

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Video Canvas */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className="w-full h-full object-contain"
          />

          {/* Time Display Overlay */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-mono">
            {formatTime(timeline.currentTime)} / {formatTime(totalDuration)}
          </div>

          {/* Resolution Display */}
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-xs">
            {project?.resolution.width}x{project?.resolution.height} @ {project?.fps}fps
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="p-4 bg-card border-t">
        <div className="flex items-center justify-center gap-4">
          <Button
            size="icon"
            variant="outline"
            onClick={skipBackward}
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            className="h-12 w-12"
            onClick={togglePlayPause}
          >
            {timeline.isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={skipForward}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <input
            type="range"
            min={0}
            max={totalDuration}
            step={0.1}
            value={timeline.currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(timeline.currentTime / totalDuration) * 100}%, hsl(var(--secondary)) ${(timeline.currentTime / totalDuration) * 100}%, hsl(var(--secondary)) 100%)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
