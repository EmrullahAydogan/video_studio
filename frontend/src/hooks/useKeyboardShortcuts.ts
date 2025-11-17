import { useEffect } from 'react';

export type ShortcutHandler = (event: KeyboardEvent) => void;

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: ShortcutHandler;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl === undefined || shortcut.ctrl === (event.ctrlKey || event.metaKey);
        const shiftMatch = shortcut.shift === undefined || shortcut.shift === event.shiftKey;
        const altMatch = shortcut.alt === undefined || shortcut.alt === event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          shortcut.handler(event);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Predefined shortcuts
export const SHORTCUTS = {
  // Playback
  PLAY_PAUSE: { key: ' ', description: 'Play/Pause' },
  SKIP_FORWARD: { key: 'ArrowRight', description: 'Skip forward 5s' },
  SKIP_BACKWARD: { key: 'ArrowLeft', description: 'Skip backward 5s' },

  // Editing
  UNDO: { key: 'z', ctrl: true, description: 'Undo' },
  REDO: { key: 'z', ctrl: true, shift: true, description: 'Redo' },
  CUT: { key: 'x', ctrl: true, description: 'Cut scene' },
  COPY: { key: 'c', ctrl: true, description: 'Copy scene' },
  PASTE: { key: 'v', ctrl: true, description: 'Paste scene' },
  DELETE: { key: 'Delete', description: 'Delete selected scene' },

  // Timeline
  ZOOM_IN: { key: '=', ctrl: true, description: 'Zoom in timeline' },
  ZOOM_OUT: { key: '-', ctrl: true, description: 'Zoom out timeline' },

  // Project
  SAVE: { key: 's', ctrl: true, description: 'Save project' },
  EXPORT: { key: 'e', ctrl: true, description: 'Export video' },

  // View
  FULLSCREEN: { key: 'f', description: 'Toggle fullscreen' },
  HELP: { key: '/', shift: true, description: 'Show shortcuts help' },
};
