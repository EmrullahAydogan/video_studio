'use client';

import { useEffect } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { projectStorage } from '@/lib/projectStorage';
import { VideoPreview } from './VideoPreview';
import { Timeline } from '../timeline/Timeline';
import { RightSidebar } from './RightSidebar';
import { Toolbar } from './Toolbar';
import { AssetPanel } from './AssetPanel';

export function EditorLayout() {
  const { project, createProject, loadProject } = useProjectStore();

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

        {/* Right Sidebar - AI Panel & Properties */}
        <RightSidebar />
      </div>
    </div>
  );
}
