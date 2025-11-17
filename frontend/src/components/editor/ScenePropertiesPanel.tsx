'use client';

import { useState } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { Scene } from '@/types';
import {
  Scissors,
  Copy,
  Trash2,
  Settings,
  ChevronDown,
  Sparkles,
  Volume2,
  Type,
  Palette,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ScenePropertiesPanel() {
  const { timeline, project, updateScene, deleteScene, duplicateScene } =
    useProjectStore();
  const [isOpen, setIsOpen] = useState(true);

  const selectedScene = project?.scenes.find(
    (s) => s.id === timeline.selectedSceneId
  );

  if (!selectedScene) {
    return (
      <div className="w-80 border-l bg-card p-4 text-center text-muted-foreground">
        <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select a scene to edit properties</p>
      </div>
    );
  }

  return (
    <div className="w-80 border-l bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Scene Properties
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? '' : 'rotate-180'
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              SCENE NAME
            </label>
            <input
              type="text"
              value={selectedScene.name}
              onChange={(e) =>
                updateScene(selectedScene.id, { name: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border rounded-md bg-background"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              DURATION (seconds)
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={selectedScene.duration}
              onChange={(e) =>
                updateScene(selectedScene.id, {
                  duration: parseFloat(e.target.value) || 1,
                })
              }
              className="w-full px-3 py-2 text-sm border rounded-md bg-background"
            />
          </div>

          {/* Filters */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-2">
              <Palette className="w-3 h-3" />
              FILTERS
            </label>

            {/* Brightness */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Brightness</span>
                  <span className="text-muted-foreground">
                    {selectedScene.filters?.find((f) => f.type === 'brightness')
                      ?.value || 100}
                    %
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={
                    selectedScene.filters?.find((f) => f.type === 'brightness')
                      ?.value || 100
                  }
                  onChange={(e) => {
                    const filters = selectedScene.filters || [];
                    const otherFilters = filters.filter(
                      (f) => f.type !== 'brightness'
                    );
                    updateScene(selectedScene.id, {
                      filters: [
                        ...otherFilters,
                        {
                          id: crypto.randomUUID(),
                          type: 'brightness',
                          value: parseInt(e.target.value),
                        },
                      ],
                    });
                  }}
                  className="w-full"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Contrast</span>
                  <span className="text-muted-foreground">
                    {selectedScene.filters?.find((f) => f.type === 'contrast')
                      ?.value || 100}
                    %
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={
                    selectedScene.filters?.find((f) => f.type === 'contrast')
                      ?.value || 100
                  }
                  onChange={(e) => {
                    const filters = selectedScene.filters || [];
                    const otherFilters = filters.filter(
                      (f) => f.type !== 'contrast'
                    );
                    updateScene(selectedScene.id, {
                      filters: [
                        ...otherFilters,
                        {
                          id: crypto.randomUUID(),
                          type: 'contrast',
                          value: parseInt(e.target.value),
                        },
                      ],
                    });
                  }}
                  className="w-full"
                />
              </div>

              {/* Saturation */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Saturation</span>
                  <span className="text-muted-foreground">
                    {selectedScene.filters?.find((f) => f.type === 'saturation')
                      ?.value || 100}
                    %
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={
                    selectedScene.filters?.find((f) => f.type === 'saturation')
                      ?.value || 100
                  }
                  onChange={(e) => {
                    const filters = selectedScene.filters || [];
                    const otherFilters = filters.filter(
                      (f) => f.type !== 'saturation'
                    );
                    updateScene(selectedScene.id, {
                      filters: [
                        ...otherFilters,
                        {
                          id: crypto.randomUUID(),
                          type: 'saturation',
                          value: parseInt(e.target.value),
                        },
                      ],
                    });
                  }}
                  className="w-full"
                />
              </div>

              {/* Blur */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Blur</span>
                  <span className="text-muted-foreground">
                    {selectedScene.filters?.find((f) => f.type === 'blur')?.value ||
                      0}
                    px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={
                    selectedScene.filters?.find((f) => f.type === 'blur')?.value ||
                    0
                  }
                  onChange={(e) => {
                    const filters = selectedScene.filters || [];
                    const otherFilters = filters.filter((f) => f.type !== 'blur');
                    updateScene(selectedScene.id, {
                      filters: [
                        ...otherFilters,
                        {
                          id: crypto.randomUUID(),
                          type: 'blur',
                          value: parseInt(e.target.value),
                        },
                      ],
                    });
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Transition */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              TRANSITION
            </label>
            <select
              value={selectedScene.transition?.type || 'none'}
              onChange={(e) => {
                if (e.target.value === 'none') {
                  updateScene(selectedScene.id, { transition: undefined });
                } else {
                  updateScene(selectedScene.id, {
                    transition: {
                      id: crypto.randomUUID(),
                      type: e.target.value as any,
                      duration: 1,
                    },
                  });
                }
              }}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background mb-2"
            >
              <option value="none">None</option>
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
              <option value="zoom">Zoom</option>
              <option value="dissolve">Dissolve</option>
              <option value="wipe">Wipe</option>
            </select>

            {selectedScene.transition && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Duration</span>
                  <span className="text-muted-foreground">
                    {selectedScene.transition.duration}s
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={selectedScene.transition.duration}
                  onChange={(e) => {
                    if (selectedScene.transition) {
                      updateScene(selectedScene.id, {
                        transition: {
                          ...selectedScene.transition,
                          duration: parseFloat(e.target.value),
                        },
                      });
                    }
                  }}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => duplicateScene(selectedScene.id)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplicate Scene
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => {
                if (confirm('Delete this scene?')) {
                  deleteScene(selectedScene.id);
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Scene
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
