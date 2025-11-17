'use client';

import { useRef, useEffect, useState } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  StopCircle,
  ChevronLeft,
  ChevronRight,
  Repeat,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

export function VideoPreview() {
  const {
    project,
    timeline,
    setCurrentTime,
    setIsPlaying,
    setPlaybackSpeed,
    setLoop,
    setVolume,
  } = useProjectStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    if (timeline.isPlaying) {
      const startTime = Date.now();
      const startCurrentTime = timeline.currentTime;

      const animate = () => {
        const elapsed = ((Date.now() - startTime) / 1000) * timeline.playbackSpeed;
        const newTime = startCurrentTime + elapsed;

        const totalDuration =
          project?.scenes.reduce(
            (max, scene) => Math.max(max, scene.startTime + scene.duration),
            0
          ) ?? 0;

        if (newTime >= totalDuration) {
          if (timeline.loop) {
            setCurrentTime(0);
            animationFrameRef.current = requestAnimationFrame(animate);
          } else {
            setIsPlaying(false);
            setCurrentTime(totalDuration);
          }
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
  }, [
    timeline.isPlaying,
    timeline.playbackSpeed,
    timeline.loop,
    project,
    setCurrentTime,
    setIsPlaying,
  ]);

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
      ctx.fillText(currentScene.name, canvas.width / 2, canvas.height / 2);

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
      ctx.fillText('No scene at current time', canvas.width / 2, canvas.height / 2);
    }
  }, [project, timeline.currentTime]);

  const togglePlayPause = () => {
    setIsPlaying(!timeline.isPlaying);
  };

  const stop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const skipBackward5 = () => {
    setCurrentTime(Math.max(0, timeline.currentTime - 5));
  };

  const skipForward5 = () => {
    const totalDuration =
      project?.scenes.reduce(
        (max, scene) => Math.max(max, scene.startTime + scene.duration),
        0
      ) ?? 0;
    setCurrentTime(Math.min(totalDuration, timeline.currentTime + 5));
  };

  const skipBackward10 = () => {
    setCurrentTime(Math.max(0, timeline.currentTime - 10));
  };

  const skipForward10 = () => {
    const totalDuration =
      project?.scenes.reduce(
        (max, scene) => Math.max(max, scene.startTime + scene.duration),
        0
      ) ?? 0;
    setCurrentTime(Math.min(totalDuration, timeline.currentTime + 10));
  };

  const frameBackward = () => {
    const frameTime = 1 / (project?.fps || 30);
    setCurrentTime(Math.max(0, timeline.currentTime - frameTime));
  };

  const frameForward = () => {
    const frameTime = 1 / (project?.fps || 30);
    const totalDuration =
      project?.scenes.reduce(
        (max, scene) => Math.max(max, scene.startTime + scene.duration),
        0
      ) ?? 0;
    setCurrentTime(Math.min(totalDuration, timeline.currentTime + frameTime));
  };

  const cycleSpeed = () => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(timeline.playbackSpeed);
    const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length;
    setPlaybackSpeed(PLAYBACK_SPEEDS[nextIndex]);
  };

  const toggleMute = () => {
    setVolume(timeline.volume > 0 ? 0 : 1);
  };

  const totalDuration =
    project?.scenes.reduce(
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

          {/* Resolution & Speed Display */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
            <div className="bg-black/70 text-white px-3 py-1 rounded text-xs">
              {project?.resolution.width}x{project?.resolution.height} @ {project?.fps}
              fps
            </div>
            {timeline.playbackSpeed !== 1 && (
              <div className="bg-primary/90 text-white px-3 py-1 rounded text-xs font-medium">
                {timeline.playbackSpeed}x
              </div>
            )}
            {timeline.loop && (
              <div className="bg-blue-500/90 text-white px-3 py-1 rounded text-xs font-medium flex items-center gap-1">
                <Repeat className="w-3 h-3" />
                Loop
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="p-4 bg-card border-t space-y-4">
        {/* Main Controls */}
        <div className="flex items-center justify-center gap-2">
          {/* Frame Backward */}
          <Button
            size="icon"
            variant="ghost"
            onClick={frameBackward}
            title="Previous Frame"
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Skip Backward 10s */}
          <Button
            size="icon"
            variant="outline"
            onClick={skipBackward10}
            title="Skip Backward 10s"
          >
            <Rewind className="w-4 h-4" />
          </Button>

          {/* Skip Backward 5s */}
          <Button
            size="icon"
            variant="outline"
            onClick={skipBackward5}
            title="Skip Backward 5s"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          {/* Stop */}
          <Button
            size="icon"
            variant="outline"
            onClick={stop}
            title="Stop"
          >
            <StopCircle className="w-4 h-4" />
          </Button>

          {/* Play/Pause */}
          <Button size="icon" className="h-12 w-12" onClick={togglePlayPause}>
            {timeline.isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>

          {/* Skip Forward 5s */}
          <Button
            size="icon"
            variant="outline"
            onClick={skipForward5}
            title="Skip Forward 5s"
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          {/* Skip Forward 10s */}
          <Button
            size="icon"
            variant="outline"
            onClick={skipForward10}
            title="Skip Forward 10s"
          >
            <FastForward className="w-4 h-4" />
          </Button>

          {/* Frame Forward */}
          <Button
            size="icon"
            variant="ghost"
            onClick={frameForward}
            title="Next Frame"
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <div className="w-px h-8 bg-border mx-2" />

          {/* Speed Control */}
          <Button
            size="sm"
            variant="outline"
            onClick={cycleSpeed}
            className="min-w-[60px]"
            title="Playback Speed"
          >
            {timeline.playbackSpeed}x
          </Button>

          {/* Loop Toggle */}
          <Button
            size="icon"
            variant={timeline.loop ? 'default' : 'outline'}
            onClick={() => setLoop(!timeline.loop)}
            title="Loop"
          >
            <Repeat className="w-4 h-4" />
          </Button>

          {/* Volume Control */}
          <div className="relative">
            <Button
              size="icon"
              variant="outline"
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              title={timeline.volume > 0 ? 'Mute' : 'Unmute'}
            >
              {timeline.volume > 0 ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>

            {/* Volume Slider */}
            {showVolumeSlider && (
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border rounded-lg p-2 shadow-lg"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={timeline.volume * 100}
                  onChange={(e) => setVolume(parseInt(e.target.value) / 100)}
                  className="w-24 h-2 -rotate-90 origin-center"
                  style={{ margin: '30px 0' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <input
            type="range"
            min={0}
            max={totalDuration}
            step={0.01}
            value={timeline.currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${
                (timeline.currentTime / totalDuration) * 100
              }%, hsl(var(--secondary)) ${
                (timeline.currentTime / totalDuration) * 100
              }%, hsl(var(--secondary)) 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
