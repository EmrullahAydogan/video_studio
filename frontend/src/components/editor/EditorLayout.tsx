'use client';

import { useEffect, useState } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { projectStorage } from '@/lib/projectStorage';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { VideoPreview } from './VideoPreview';
import { Timeline } from '../timeline/Timeline';
import { RightSidebar } from './RightSidebar';
import { Toolbar } from './Toolbar';
import { AssetPanel } from './AssetPanel';
import { KeyboardShortcutsDialog } from './KeyboardShortcutsDialog';

export function EditorLayout() {
  const {
    project,
    createProject,
    loadProject,
    timeline,
    setIsPlaying,
    setCurrentTime,
    setZoom,
    setLoop,
    setVolume,
    setPlaybackSpeed,
    saveProject,
    deleteScene,
    duplicateScene,
    undo,
    redo,
    copyScene,
    pasteScene,
  } = useProjectStore();
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  useEffect(() => {
    // Try to load the last opened project or create a new one
    if (!project) {
      const currentProjectId = projectStorage.getCurrentProjectId();

      if (currentProjectId) {
        const loadedProject = projectStorage.loadProject(currentProjectId);
        if (loadedProject) {
          loadProject(loadedProject);
          return;
        }
      }

      // If no project found, create a default one
      createProject('Untitled Project');
    }
  }, [project, createProject, loadProject]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    // Playback
    {
      key: ' ',
      description: 'Play/Pause',
      handler: () => setIsPlaying(!timeline.isPlaying),
    },
    {
      key: 'ArrowLeft',
      description: 'Skip backward 5s',
      handler: () => setCurrentTime(Math.max(0, timeline.currentTime - 5)),
    },
    {
      key: 'ArrowRight',
      description: 'Skip forward 5s',
      handler: () => {
        const totalDuration = project?.scenes.reduce(
          (max, scene) => Math.max(max, scene.startTime + scene.duration),
          0
        ) ?? 0;
        setCurrentTime(Math.min(totalDuration, timeline.currentTime + 5));
      },
    },
    {
      key: 'ArrowLeft',
      shift: true,
      description: 'Skip backward 10s',
      handler: () => setCurrentTime(Math.max(0, timeline.currentTime - 10)),
    },
    {
      key: 'ArrowRight',
      shift: true,
      description: 'Skip forward 10s',
      handler: () => {
        const totalDuration = project?.scenes.reduce(
          (max, scene) => Math.max(max, scene.startTime + scene.duration),
          0
        ) ?? 0;
        setCurrentTime(Math.min(totalDuration, timeline.currentTime + 10));
      },
    },
    {
      key: ',',
      description: 'Previous frame',
      handler: () => {
        const frameTime = 1 / (project?.fps || 30);
        setCurrentTime(Math.max(0, timeline.currentTime - frameTime));
      },
    },
    {
      key: '.',
      description: 'Next frame',
      handler: () => {
        const frameTime = 1 / (project?.fps || 30);
        const totalDuration = project?.scenes.reduce(
          (max, scene) => Math.max(max, scene.startTime + scene.duration),
          0
        ) ?? 0;
        setCurrentTime(Math.min(totalDuration, timeline.currentTime + frameTime));
      },
    },
    {
      key: '0',
      description: 'Stop',
      handler: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
    },
    {
      key: 'l',
      description: 'Toggle loop',
      handler: () => setLoop(!timeline.loop),
    },
    {
      key: 'm',
      description: 'Mute/Unmute',
      handler: () => setVolume(timeline.volume > 0 ? 0 : 1),
    },
    {
      key: '<',
      shift: true,
      description: 'Decrease playback speed',
      handler: () => {
        const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
        const currentIndex = speeds.indexOf(timeline.playbackSpeed);
        if (currentIndex > 0) {
          setPlaybackSpeed(speeds[currentIndex - 1]);
        }
      },
    },
    {
      key: '>',
      shift: true,
      description: 'Increase playback speed',
      handler: () => {
        const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
        const currentIndex = speeds.indexOf(timeline.playbackSpeed);
        if (currentIndex < speeds.length - 1) {
          setPlaybackSpeed(speeds[currentIndex + 1]);
        }
      },
    },
    // Timeline
    {
      key: '=',
      ctrl: true,
      description: 'Zoom in timeline',
      handler: () => setZoom(Math.min(200, timeline.zoom + 10)),
    },
    {
      key: '-',
      ctrl: true,
      description: 'Zoom out timeline',
      handler: () => setZoom(Math.max(10, timeline.zoom - 10)),
    },
    {
      key: '0',
      ctrl: true,
      description: 'Reset zoom',
      handler: () => setZoom(50),
    },
    // Editing
    {
      key: 'Delete',
      description: 'Delete selected scene',
      handler: () => {
        if (timeline.selectedSceneId) {
          deleteScene(timeline.selectedSceneId);
        }
      },
    },
    {
      key: 'd',
      ctrl: true,
      description: 'Duplicate scene',
      handler: (e) => {
        if (timeline.selectedSceneId) {
          e.preventDefault();
          duplicateScene(timeline.selectedSceneId);
        }
      },
    },
    {
      key: 'c',
      ctrl: true,
      description: 'Copy scene',
      handler: (e) => {
        if (timeline.selectedSceneId) {
          e.preventDefault();
          copyScene(timeline.selectedSceneId);
        }
      },
    },
    {
      key: 'v',
      ctrl: true,
      description: 'Paste scene',
      handler: (e) => {
        e.preventDefault();
        pasteScene();
      },
    },
    {
      key: 'z',
      ctrl: true,
      description: 'Undo',
      handler: (e) => {
        e.preventDefault();
        undo();
      },
    },
    {
      key: 'y',
      ctrl: true,
      description: 'Redo',
      handler: (e) => {
        e.preventDefault();
        redo();
      },
    },
    // Project
    {
      key: 's',
      ctrl: true,
      description: 'Save project',
      handler: (e) => {
        e.preventDefault();
        saveProject();
      },
    },
    // Help
    {
      key: '?',
      shift: true,
      description: 'Show keyboard shortcuts',
      handler: () => setShowShortcutsHelp(!showShortcutsHelp),
    },
  ]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Keyboard Shortcuts Help Dialog */}
      <KeyboardShortcutsDialog
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />

      {/* Toolbar */}
      <Toolbar />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Assets */}
        <div className="w-64 border-r">
          <AssetPanel />
        </div>

        {/* Center - Video Preview */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <VideoPreview />
          </div>

          {/* Bottom - Timeline */}
          <div className="h-64">
            <Timeline />
          </div>
        </div>

        {/* Right Sidebar - AI Panel & Properties */}
        <RightSidebar />
      </div>
    </div>
  );
}
