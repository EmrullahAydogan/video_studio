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
  Music,
  Palette,
  Smile,
  Bookmark,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExportDialog } from './ExportDialog';
import { ProjectManager } from './ProjectManager';
import { TextOverlayDialog } from './TextOverlayDialog';
import { AudioUploadDialog } from './AudioUploadDialog';
import { PresetsDialog } from './PresetsDialog';
import { StickersDialog } from './StickersDialog';
import { MarkersDialog } from './MarkersDialog';
import { TemplateLibrary } from './TemplateLibrary';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Toolbar() {
  const { project, saveProject, hasUnsavedChanges, undo, redo, canUndo, canRedo } = useProjectStore();
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [showTextOverlay, setShowTextOverlay] = useState(false);
  const [showAudioUpload, setShowAudioUpload] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);

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
      <AudioUploadDialog
        isOpen={showAudioUpload}
        onClose={() => setShowAudioUpload(false)}
      />
      <PresetsDialog
        isOpen={showPresets}
        onClose={() => setShowPresets(false)}
      />
      <StickersDialog
        isOpen={showStickers}
        onClose={() => setShowStickers(false)}
      />
      <MarkersDialog
        isOpen={showMarkers}
        onClose={() => setShowMarkers(false)}
      />
      <TemplateLibrary
        isOpen={showTemplateLibrary}
        onClose={() => setShowTemplateLibrary(false)}
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
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo()}
          title="Redo (Ctrl+Y)"
        >
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
          onClick={() => setShowTemplateLibrary(true)}
        >
          <FileText className="w-4 h-4 mr-2" />
          Templates
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

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAudioUpload(true)}
        >
          <Music className="w-4 h-4 mr-2" />
          Add Audio
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPresets(true)}
        >
          <Palette className="w-4 h-4 mr-2" />
          Presets
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowStickers(true)}
        >
          <Smile className="w-4 h-4 mr-2" />
          Stickers
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMarkers(true)}
        >
          <Bookmark className="w-4 h-4 mr-2" />
          Markers
        </Button>

        <Button size="sm" onClick={() => setShowExportDialog(true)}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Right - Settings */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
    </>
  );
}
