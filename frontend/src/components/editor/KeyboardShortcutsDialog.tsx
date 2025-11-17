'use client';

import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  {
    category: 'Playback',
    items: [
      { keys: ['Space'], description: 'Play/Pause' },
      { keys: ['←'], description: 'Skip backward 5s' },
      { keys: ['→'], description: 'Skip forward 5s' },
      { keys: ['Shift', '←'], description: 'Skip backward 10s' },
      { keys: ['Shift', '→'], description: 'Skip forward 10s' },
      { keys: [','], description: 'Previous frame' },
      { keys: ['.'], description: 'Next frame' },
      { keys: ['0'], description: 'Stop (go to start)' },
      { keys: ['L'], description: 'Toggle loop' },
      { keys: ['M'], description: 'Mute/Unmute' },
      { keys: ['<'], description: 'Decrease playback speed' },
      { keys: ['>'], description: 'Increase playback speed' },
    ],
  },
  {
    category: 'Editing',
    items: [
      { keys: ['Ctrl', 'Z'], description: 'Undo' },
      { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
      { keys: ['Ctrl', 'X'], description: 'Cut scene' },
      { keys: ['Ctrl', 'C'], description: 'Copy scene' },
      { keys: ['Ctrl', 'V'], description: 'Paste scene' },
      { keys: ['Delete'], description: 'Delete selected scene' },
      { keys: ['Ctrl', 'D'], description: 'Duplicate scene' },
    ],
  },
  {
    category: 'Timeline',
    items: [
      { keys: ['Ctrl', '='], description: 'Zoom in timeline' },
      { keys: ['Ctrl', '-'], description: 'Zoom out timeline' },
      { keys: ['Ctrl', '0'], description: 'Reset zoom' },
    ],
  },
  {
    category: 'Project',
    items: [
      { keys: ['Ctrl', 'S'], description: 'Save project' },
      { keys: ['Ctrl', 'E'], description: 'Export video' },
      { keys: ['Ctrl', 'O'], description: 'Open projects' },
    ],
  },
  {
    category: 'View',
    items: [
      { keys: ['F'], description: 'Toggle fullscreen' },
      { keys: ['?'], description: 'Show/hide this help' },
    ],
  },
];

export function KeyboardShortcutsDialog({
  isOpen,
  onClose,
}: KeyboardShortcutsDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-card border rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shortcuts.map((section) => (
              <div key={section.category}>
                <h3 className="font-semibold text-sm mb-3 text-primary">
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.description}
                      </span>
                      <div className="flex gap-1">
                        {item.keys.map((key, keyIdx) => (
                          <kbd
                            key={keyIdx}
                            className="px-2 py-1 text-xs font-semibold border rounded bg-secondary"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
