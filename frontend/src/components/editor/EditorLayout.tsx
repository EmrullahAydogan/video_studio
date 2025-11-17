'use client';

import { useEffect } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { VideoPreview } from './VideoPreview';
import { Timeline } from '../timeline/Timeline';
import { AIPanel } from '../ai/AIPanel';
import { Toolbar } from './Toolbar';
import { AssetPanel } from './AssetPanel';

export function EditorLayout() {
  const { project, createProject } = useProjectStore();

  useEffect(() => {
    // Create a default project if none exists
    if (!project) {
      createProject('Untitled Project');
    }
  }, [project, createProject]);

  return (
    <div className="h-screen flex flex-col bg-background">
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

        {/* Right Sidebar - AI Panel */}
        <div className="w-80">
          <AIPanel />
        </div>
      </div>
    </div>
  );
}
