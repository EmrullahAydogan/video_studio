'use client';

import { useState } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { Bookmark, X, Plus, Trash2, Play, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Marker } from '@/types';

interface MarkersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MARKER_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

export function MarkersDialog({ isOpen, onClose }: MarkersDialogProps) {
  const { project, timeline, addMarker, updateMarker, deleteMarker, jumpToMarker } =
    useProjectStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Marker>>({});

  if (!isOpen || !project) return null;

  const markers = project.markers.sort((a, b) => a.time - b.time);

  const handleAddMarker = () => {
    const newMarker = {
      name: `Marker ${markers.length + 1}`,
      time: timeline.currentTime,
      color: MARKER_COLORS[markers.length % MARKER_COLORS.length],
    };
    addMarker(newMarker);
  };

  const handleStartEdit = (marker: Marker) => {
    setEditingId(marker.id);
    setEditForm(marker);
  };

  const handleSaveEdit = () => {
    if (editingId && editForm) {
      updateMarker(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleJumpToMarker = (id: string) => {
    jumpToMarker(id);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-card border rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bookmark className="w-5 h-5" />
            Markers & Bookmarks
          </h2>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddMarker} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Marker
            </Button>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {markers.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm mb-2">No markers yet</p>
              <p className="text-xs">
                Add markers to bookmark important moments in your timeline
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {markers.map((marker) => (
                <div
                  key={marker.id}
                  className="border-2 rounded-lg p-4 hover:border-primary transition-colors"
                  style={{ borderLeftColor: marker.color || '#3b82f6', borderLeftWidth: '4px' }}
                >
                  {editingId === marker.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          NAME
                        </label>
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          TIME (seconds)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={editForm.time || 0}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              time: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          COLOR
                        </label>
                        <div className="flex gap-2">
                          {MARKER_COLORS.map((color) => (
                            <button
                              key={color}
                              onClick={() => setEditForm({ ...editForm, color })}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                editForm.color === color
                                  ? 'border-white scale-110'
                                  : 'border-transparent'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          DESCRIPTION (optional)
                        </label>
                        <textarea
                          value={editForm.description || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                          className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                          rows={2}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} size="sm">
                          Save
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium">{marker.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(marker.time)}
                          </p>
                          {marker.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {marker.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleJumpToMarker(marker.id)}
                            title="Jump to marker"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStartEdit(marker)}
                            title="Edit marker"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm('Delete this marker?')) {
                                deleteMarker(marker.id);
                              }
                            }}
                            title="Delete marker"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {markers.length === 0
              ? 'No markers'
              : `${markers.length} marker${markers.length !== 1 ? 's' : ''}`}
          </div>
          <div className="text-xs text-muted-foreground">
            Current time: {formatTime(timeline.currentTime)}
          </div>
        </div>
      </div>
    </div>
  );
}
