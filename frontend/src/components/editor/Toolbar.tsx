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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExportDialog } from './ExportDialog';

export function Toolbar() {
  const { project } = useProjectStore();
  const [showExportDialog, setShowExportDialog] = useState(false);

  return (
    <>
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
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

        <Button variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>

        <Button variant="outline" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save
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
