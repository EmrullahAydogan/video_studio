'use client';

import { useState } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import {
  Save,
  Download,
  Upload,
  Undo,
  Redo,
  Settings,
  Film,
  FolderOpen,
  Type,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExportDialog } from './ExportDialog';
import { ProjectManager } from './ProjectManager';
import { TextOverlayDialog } from './TextOverlayDialog';

export function Toolbar() {
  const { project, saveProject, hasUnsavedChanges } = useProjectStore();
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [showTextOverlay, setShowTextOverlay] = useState(false);

  return (
    <>
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      />
      <ProjectManager
        isOpen={showProjectManager}
        onClose={() => setShowProjectManager(false)}
      />
      <TextOverlayDialog
        isOpen={showTextOverlay}
        onClose={() => setShowTextOverlay(false)}
      />
    <div className="h-14 border-b bg-card flex items-center justify-between px-4">
      {/* Left - Logo and Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Film className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">AI Video Studio</span>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="text-sm">
          {project?.name || 'Untitled Project'}
        </div>
      </div>

      {/* Center - Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" disabled>
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <Redo className="w-4 h-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-2" />

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowProjectManager(true)}
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Projects
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={saveProject}
          className={hasUnsavedChanges ? 'border-orange-500' : ''}
        >
          <Save className="w-4 h-4 mr-2" />
          Save{hasUnsavedChanges && '*'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTextOverlay(true)}
        >
          <Type className="w-4 h-4 mr-2" />
          Add Text
        </Button>

        <Button size="sm" onClick={() => setShowExportDialog(true)}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Right - Settings */}
      <div>
        <Button variant="ghost" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
    </>
  );
}
