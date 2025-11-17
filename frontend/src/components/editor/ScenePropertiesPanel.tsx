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
  Layers,
  Move,
  Maximize2,
  Eye,
  Gauge,
  Wand2,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Film,
  ZoomIn,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ScenePropertiesPanel() {
  const { timeline, project, updateScene, deleteScene, duplicateScene, splitScene } =
    useProjectStore();
  const [isOpen, setIsOpen] = useState(true);
  const [splitTime, setSplitTime] = useState('');

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

          {/* Trim Controls */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-2">
              <Scissors className="w-3 h-3" />
              TRIM
            </label>

            {/* Trim Start */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Trim Start</span>
                  <span className="text-muted-foreground">
                    {(selectedScene.trimStart || 0).toFixed(2)}s
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={selectedScene.duration}
                  step="0.01"
                  value={selectedScene.trimStart || 0}
                  onChange={(e) => {
                    const trimStart = parseFloat(e.target.value);
                    const trimEnd = selectedScene.trimEnd || 0;
                    const originalDuration = selectedScene.originalDuration || selectedScene.duration;
                    updateScene(selectedScene.id, {
                      trimStart,
                      duration: originalDuration - trimStart - trimEnd,
                      originalDuration,
                    });
                  }}
                  className="w-full"
                />
              </div>

              {/* Trim End */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Trim End</span>
                  <span className="text-muted-foreground">
                    {(selectedScene.trimEnd || 0).toFixed(2)}s
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={selectedScene.duration}
                  step="0.01"
                  value={selectedScene.trimEnd || 0}
                  onChange={(e) => {
                    const trimEnd = parseFloat(e.target.value);
                    const trimStart = selectedScene.trimStart || 0;
                    const originalDuration = selectedScene.originalDuration || selectedScene.duration;
                    updateScene(selectedScene.id, {
                      trimEnd,
                      duration: originalDuration - trimStart - trimEnd,
                      originalDuration,
                    });
                  }}
                  className="w-full"
                />
              </div>

              {/* Reset Trim Button */}
              {(selectedScene.trimStart || selectedScene.trimEnd) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const originalDuration = selectedScene.originalDuration || selectedScene.duration;
                    updateScene(selectedScene.id, {
                      trimStart: 0,
                      trimEnd: 0,
                      duration: originalDuration,
                    });
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset Trim
                </Button>
              )}
            </div>
          </div>

          {/* Layer & Position Controls */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-2">
              <Layers className="w-3 h-3" />
              LAYER & POSITION
            </label>

            <div className="space-y-3">
              {/* Quick Position Presets */}
              <div>
                <div className="text-xs mb-2">Quick Position</div>
                <div className="grid grid-cols-3 gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() =>
                      updateScene(selectedScene.id, {
                        position: { x: 10, y: 10 },
                        scale: 0.3,
                      })
                    }
                  >
                    Top L
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() =>
                      updateScene(selectedScene.id, {
                        position: { x: 50, y: 10 },
                        scale: 0.3,
                      })
                    }
                  >
                    Top C
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() =>
                      updateScene(selectedScene.id, {
                        position: { x: 90, y: 10 },
                        scale: 0.3,
                      })
                    }
                  >
                    Top R
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() =>
                      updateScene(selectedScene.id, {
                        position: { x: 10, y: 80 },
                        scale: 0.3,
                      })
                    }
                  >
                    Bot L
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() =>
                      updateScene(selectedScene.id, {
                        position: { x: 50, y: 50 },
                        scale: 1,
                      })
                    }
                  >
                    Center
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() =>
                      updateScene(selectedScene.id, {
                        position: { x: 90, y: 80 },
                        scale: 0.3,
                      })
                    }
                  >
                    Bot R
                  </Button>
                </div>
              </div>

              {/* Layer (Z-Index) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Layer (Z-Index)</span>
                  <span className="text-muted-foreground">
                    {selectedScene.layer || 0}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={selectedScene.layer || 0}
                  onChange={(e) =>
                    updateScene(selectedScene.id, {
                      layer: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              {/* Position X */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Position X</span>
                  <span className="text-muted-foreground">
                    {selectedScene.position?.x || 50}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedScene.position?.x || 50}
                  onChange={(e) =>
                    updateScene(selectedScene.id, {
                      position: {
                        x: parseInt(e.target.value),
                        y: selectedScene.position?.y || 50,
                      },
                    })
                  }
                  className="w-full"
                />
              </div>

              {/* Position Y */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Position Y</span>
                  <span className="text-muted-foreground">
                    {selectedScene.position?.y || 50}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedScene.position?.y || 50}
                  onChange={(e) =>
                    updateScene(selectedScene.id, {
                      position: {
                        x: selectedScene.position?.x || 50,
                        y: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full"
                />
              </div>

              {/* Scale */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Scale</span>
                  <span className="text-muted-foreground">
                    {((selectedScene.scale || 1) * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={(selectedScene.scale || 1) * 100}
                  onChange={(e) =>
                    updateScene(selectedScene.id, {
                      scale: parseInt(e.target.value) / 100,
                    })
                  }
                  className="w-full"
                />
              </div>

              {/* Opacity */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Opacity</span>
                  <span className="text-muted-foreground">
                    {((selectedScene.opacity || 1) * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(selectedScene.opacity || 1) * 100}
                  onChange={(e) =>
                    updateScene(selectedScene.id, {
                      opacity: parseInt(e.target.value) / 100,
                    })
                  }
                  className="w-full"
                />
              </div>

              {/* Blend Mode */}
              <div>
                <div className="text-xs mb-1">Blend Mode</div>
                <select
                  value={selectedScene.blendMode || 'normal'}
                  onChange={(e) =>
                    updateScene(selectedScene.id, {
                      blendMode: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                >
                  <option value="normal">Normal</option>
                  <option value="multiply">Multiply</option>
                  <option value="screen">Screen</option>
                  <option value="overlay">Overlay</option>
                </select>
              </div>

              {/* Reset Position Button */}
              {(selectedScene.position || selectedScene.scale !== 1 || selectedScene.opacity !== 1) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    updateScene(selectedScene.id, {
                      position: undefined,
                      scale: 1,
                      opacity: 1,
                      layer: 0,
                      blendMode: 'normal',
                    })
                  }
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset Layer
                </Button>
              )}
            </div>
          </div>

          {/* Playback Speed Control */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-2">
              <Gauge className="w-3 h-3" />
              PLAYBACK SPEED
            </label>

            <div className="space-y-3">
              {/* Quick Speed Presets */}
              <div>
                <div className="text-xs mb-2">Speed Presets</div>
                <div className="grid grid-cols-5 gap-1">
                  <Button
                    size="sm"
                    variant={selectedScene.playbackSpeed === 0.25 ? 'default' : 'outline'}
                    className="h-8 text-xs"
                    onClick={() =>
                      updateScene(selectedScene.id, { playbackSpeed: 0.25 })
                    }
                  >
                    0.25x
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedScene.playbackSpeed === 0.5 ? 'default' : 'outline'}
                    className="h-8 text-xs"
                    onClick={() =>
                      updateScene(selectedScene.id, { playbackSpeed: 0.5 })
                    }
                  >
                    0.5x
                  </Button>
                  <Button
                    size="sm"
                    variant={!selectedScene.playbackSpeed || selectedScene.playbackSpeed === 1 ? 'default' : 'outline'}
                    className="h-8 text-xs"
                    onClick={() =>
                      updateScene(selectedScene.id, { playbackSpeed: 1 })
                    }
                  >
                    1x
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedScene.playbackSpeed === 1.5 ? 'default' : 'outline'}
                    className="h-8 text-xs"
                    onClick={() =>
                      updateScene(selectedScene.id, { playbackSpeed: 1.5 })
                    }
                  >
                    1.5x
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedScene.playbackSpeed === 2 ? 'default' : 'outline'}
                    className="h-8 text-xs"
                    onClick={() =>
                      updateScene(selectedScene.id, { playbackSpeed: 2 })
                    }
                  >
                    2x
                  </Button>
                </div>
              </div>

              {/* Speed Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Custom Speed</span>
                  <span className="text-muted-foreground">
                    {(selectedScene.playbackSpeed || 1).toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="200"
                  step="25"
                  value={(selectedScene.playbackSpeed || 1) * 100}
                  onChange={(e) =>
                    updateScene(selectedScene.id, {
                      playbackSpeed: parseInt(e.target.value) / 100,
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>Slow Motion</span>
                  <span>Normal</span>
                  <span>Fast Forward</span>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded">
                {selectedScene.playbackSpeed && selectedScene.playbackSpeed < 1
                  ? '🐢 Slow motion effect'
                  : selectedScene.playbackSpeed && selectedScene.playbackSpeed > 1
                  ? '⚡ Fast forward effect'
                  : '▶️ Normal speed'}
              </div>

              {/* Reset Button */}
              {selectedScene.playbackSpeed && selectedScene.playbackSpeed !== 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    updateScene(selectedScene.id, { playbackSpeed: 1 })
                  }
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset to Normal Speed
                </Button>
              )}
            </div>
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

          {/* Text Animation - Only for text scenes */}
          {selectedScene.type === 'text' && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Type className="w-3 h-3" />
                TEXT ANIMATION
              </label>

              <div className="space-y-3">
                {/* Animation Type */}
                <div>
                  <div className="text-xs mb-1">Animation Type</div>
                  <select
                    value={selectedScene.textAnimation?.type || 'none'}
                    onChange={(e) => {
                      if (e.target.value === 'none') {
                        updateScene(selectedScene.id, { textAnimation: undefined });
                      } else {
                        updateScene(selectedScene.id, {
                          textAnimation: {
                            type: e.target.value as any,
                            duration: 1,
                            delay: 0,
                          },
                        });
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                  >
                    <option value="none">None</option>
                    <option value="fadeIn">Fade In</option>
                    <option value="slideIn">Slide In</option>
                    <option value="bounce">Bounce</option>
                    <option value="typewriter">Typewriter</option>
                    <option value="zoom">Zoom In</option>
                    <option value="rotate">Rotate In</option>
                  </select>
                </div>

                {selectedScene.textAnimation && selectedScene.textAnimation.type !== 'none' && (
                  <>
                    {/* Animation Duration */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Animation Duration</span>
                        <span className="text-muted-foreground">
                          {selectedScene.textAnimation.duration}s
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={selectedScene.textAnimation.duration}
                        onChange={(e) =>
                          updateScene(selectedScene.id, {
                            textAnimation: {
                              ...selectedScene.textAnimation!,
                              duration: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Animation Delay */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Animation Delay</span>
                        <span className="text-muted-foreground">
                          {selectedScene.textAnimation.delay}s
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={selectedScene.textAnimation.delay}
                        onChange={(e) =>
                          updateScene(selectedScene.id, {
                            textAnimation: {
                              ...selectedScene.textAnimation!,
                              delay: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Direction for slideIn */}
                    {selectedScene.textAnimation.type === 'slideIn' && (
                      <div>
                        <div className="text-xs mb-1">Slide Direction</div>
                        <select
                          value={selectedScene.textAnimation.direction || 'left'}
                          onChange={(e) =>
                            updateScene(selectedScene.id, {
                              textAnimation: {
                                ...selectedScene.textAnimation!,
                                direction: e.target.value as any,
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                        >
                          <option value="left">From Left</option>
                          <option value="right">From Right</option>
                          <option value="up">From Top</option>
                          <option value="down">From Bottom</option>
                        </select>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Transform Effects - Only for video and image scenes */}
          {(selectedScene.type === 'video' || selectedScene.type === 'image') && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <RotateCw className="w-3 h-3" />
                TRANSFORM
              </label>

              <div className="space-y-3">
                {/* Rotation */}
                <div>
                  <div className="text-xs mb-2">Rotation</div>
                  <div className="grid grid-cols-4 gap-1">
                    <Button
                      size="sm"
                      variant={!selectedScene.transform?.rotate || selectedScene.transform?.rotate === 0 ? 'default' : 'outline'}
                      className="h-8 text-xs"
                      onClick={() =>
                        updateScene(selectedScene.id, {
                          transform: { ...selectedScene.transform, rotate: 0 },
                        })
                      }
                    >
                      0°
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedScene.transform?.rotate === 90 ? 'default' : 'outline'}
                      className="h-8 text-xs"
                      onClick={() =>
                        updateScene(selectedScene.id, {
                          transform: { ...selectedScene.transform, rotate: 90 },
                        })
                      }
                    >
                      90°
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedScene.transform?.rotate === 180 ? 'default' : 'outline'}
                      className="h-8 text-xs"
                      onClick={() =>
                        updateScene(selectedScene.id, {
                          transform: { ...selectedScene.transform, rotate: 180 },
                        })
                      }
                    >
                      180°
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedScene.transform?.rotate === 270 ? 'default' : 'outline'}
                      className="h-8 text-xs"
                      onClick={() =>
                        updateScene(selectedScene.id, {
                          transform: { ...selectedScene.transform, rotate: 270 },
                        })
                      }
                    >
                      270°
                    </Button>
                  </div>
                </div>

                {/* Flip Controls */}
                <div>
                  <div className="text-xs mb-2">Flip</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant={selectedScene.transform?.flipHorizontal ? 'default' : 'outline'}
                      className="h-8"
                      onClick={() =>
                        updateScene(selectedScene.id, {
                          transform: {
                            ...selectedScene.transform,
                            flipHorizontal: !selectedScene.transform?.flipHorizontal,
                          },
                        })
                      }
                    >
                      <FlipHorizontal className="w-4 h-4 mr-2" />
                      Horizontal
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedScene.transform?.flipVertical ? 'default' : 'outline'}
                      className="h-8"
                      onClick={() =>
                        updateScene(selectedScene.id, {
                          transform: {
                            ...selectedScene.transform,
                            flipVertical: !selectedScene.transform?.flipVertical,
                          },
                        })
                      }
                    >
                      <FlipVertical className="w-4 h-4 mr-2" />
                      Vertical
                    </Button>
                  </div>
                </div>

                {/* Crop Controls */}
                <div>
                  <div className="text-xs mb-2 flex items-center gap-2">
                    <Crop className="w-3 h-3" />
                    Crop
                  </div>
                  <div className="space-y-2">
                    {/* Top Crop */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Top</span>
                        <span className="text-muted-foreground">
                          {selectedScene.transform?.crop?.top || 0}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={selectedScene.transform?.crop?.top || 0}
                        onChange={(e) =>
                          updateScene(selectedScene.id, {
                            transform: {
                              ...selectedScene.transform,
                              crop: {
                                top: parseInt(e.target.value),
                                right: selectedScene.transform?.crop?.right || 0,
                                bottom: selectedScene.transform?.crop?.bottom || 0,
                                left: selectedScene.transform?.crop?.left || 0,
                              },
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Bottom Crop */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Bottom</span>
                        <span className="text-muted-foreground">
                          {selectedScene.transform?.crop?.bottom || 0}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={selectedScene.transform?.crop?.bottom || 0}
                        onChange={(e) =>
                          updateScene(selectedScene.id, {
                            transform: {
                              ...selectedScene.transform,
                              crop: {
                                top: selectedScene.transform?.crop?.top || 0,
                                right: selectedScene.transform?.crop?.right || 0,
                                bottom: parseInt(e.target.value),
                                left: selectedScene.transform?.crop?.left || 0,
                              },
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Left Crop */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Left</span>
                        <span className="text-muted-foreground">
                          {selectedScene.transform?.crop?.left || 0}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={selectedScene.transform?.crop?.left || 0}
                        onChange={(e) =>
                          updateScene(selectedScene.id, {
                            transform: {
                              ...selectedScene.transform,
                              crop: {
                                top: selectedScene.transform?.crop?.top || 0,
                                right: selectedScene.transform?.crop?.right || 0,
                                bottom: selectedScene.transform?.crop?.bottom || 0,
                                left: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Right Crop */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Right</span>
                        <span className="text-muted-foreground">
                          {selectedScene.transform?.crop?.right || 0}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={selectedScene.transform?.crop?.right || 0}
                        onChange={(e) =>
                          updateScene(selectedScene.id, {
                            transform: {
                              ...selectedScene.transform,
                              crop: {
                                top: selectedScene.transform?.crop?.top || 0,
                                right: parseInt(e.target.value),
                                bottom: selectedScene.transform?.crop?.bottom || 0,
                                left: selectedScene.transform?.crop?.left || 0,
                              },
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Reset Transform Button */}
                {selectedScene.transform && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      updateScene(selectedScene.id, { transform: undefined })
                    }
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reset Transform
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Ken Burns Effect - Only for image scenes */}
          {selectedScene.type === 'image' && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Film className="w-3 h-3" />
                KEN BURNS EFFECT
              </label>

              <div className="space-y-3">
                {/* Enable Toggle */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Pan & Zoom Animation</div>
                    <div className="text-xs text-muted-foreground">
                      Animated camera movement over image
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedScene.kenBurnsEffect?.enabled || false}
                      onChange={(e) =>
                        updateScene(selectedScene.id, {
                          kenBurnsEffect: e.target.checked
                            ? {
                                enabled: true,
                                startPosition: { x: 0, y: 0 },
                                endPosition: { x: 20, y: 20 },
                                startScale: 1.2,
                                endScale: 1,
                                easing: 'ease-in-out',
                              }
                            : undefined,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {selectedScene.kenBurnsEffect?.enabled && (
                  <>
                    {/* Start Position */}
                    <div>
                      <div className="text-xs mb-2 font-medium">Start Position</div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>X Offset</span>
                            <span className="text-muted-foreground">
                              {selectedScene.kenBurnsEffect.startPosition.x}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={selectedScene.kenBurnsEffect.startPosition.x}
                            onChange={(e) =>
                              updateScene(selectedScene.id, {
                                kenBurnsEffect: {
                                  ...selectedScene.kenBurnsEffect!,
                                  startPosition: {
                                    x: parseInt(e.target.value),
                                    y: selectedScene.kenBurnsEffect!.startPosition.y,
                                  },
                                },
                              })
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Y Offset</span>
                            <span className="text-muted-foreground">
                              {selectedScene.kenBurnsEffect.startPosition.y}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={selectedScene.kenBurnsEffect.startPosition.y}
                            onChange={(e) =>
                              updateScene(selectedScene.id, {
                                kenBurnsEffect: {
                                  ...selectedScene.kenBurnsEffect!,
                                  startPosition: {
                                    x: selectedScene.kenBurnsEffect!.startPosition.x,
                                    y: parseInt(e.target.value),
                                  },
                                },
                              })
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* End Position */}
                    <div>
                      <div className="text-xs mb-2 font-medium">End Position</div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>X Offset</span>
                            <span className="text-muted-foreground">
                              {selectedScene.kenBurnsEffect.endPosition.x}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={selectedScene.kenBurnsEffect.endPosition.x}
                            onChange={(e) =>
                              updateScene(selectedScene.id, {
                                kenBurnsEffect: {
                                  ...selectedScene.kenBurnsEffect!,
                                  endPosition: {
                                    x: parseInt(e.target.value),
                                    y: selectedScene.kenBurnsEffect!.endPosition.y,
                                  },
                                },
                              })
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Y Offset</span>
                            <span className="text-muted-foreground">
                              {selectedScene.kenBurnsEffect.endPosition.y}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={selectedScene.kenBurnsEffect.endPosition.y}
                            onChange={(e) =>
                              updateScene(selectedScene.id, {
                                kenBurnsEffect: {
                                  ...selectedScene.kenBurnsEffect!,
                                  endPosition: {
                                    x: selectedScene.kenBurnsEffect!.endPosition.x,
                                    y: parseInt(e.target.value),
                                  },
                                },
                              })
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Start Scale */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Start Zoom</span>
                        <span className="text-muted-foreground">
                          {(selectedScene.kenBurnsEffect.startScale * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="200"
                        step="5"
                        value={selectedScene.kenBurnsEffect.startScale * 100}
                        onChange={(e) =>
                          updateScene(selectedScene.id, {
                            kenBurnsEffect: {
                              ...selectedScene.kenBurnsEffect!,
                              startScale: parseInt(e.target.value) / 100,
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    {/* End Scale */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>End Zoom</span>
                        <span className="text-muted-foreground">
                          {(selectedScene.kenBurnsEffect.endScale * 100).toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="200"
                        step="5"
                        value={selectedScene.kenBurnsEffect.endScale * 100}
                        onChange={(e) =>
                          updateScene(selectedScene.id, {
                            kenBurnsEffect: {
                              ...selectedScene.kenBurnsEffect!,
                              endScale: parseInt(e.target.value) / 100,
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Easing */}
                    <div>
                      <div className="text-xs mb-1">Animation Easing</div>
                      <select
                        value={selectedScene.kenBurnsEffect.easing || 'ease-in-out'}
                        onChange={(e) =>
                          updateScene(selectedScene.id, {
                            kenBurnsEffect: {
                              ...selectedScene.kenBurnsEffect!,
                              easing: e.target.value as any,
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                      >
                        <option value="linear">Linear</option>
                        <option value="ease-in">Ease In</option>
                        <option value="ease-out">Ease Out</option>
                        <option value="ease-in-out">Ease In-Out</option>
                      </select>
                    </div>

                    {/* Quick Presets */}
                    <div>
                      <div className="text-xs mb-2">Quick Presets</div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-auto py-2 px-3 flex flex-col items-start"
                          onClick={() =>
                            updateScene(selectedScene.id, {
                              kenBurnsEffect: {
                                enabled: true,
                                startPosition: { x: 0, y: 0 },
                                endPosition: { x: 20, y: 20 },
                                startScale: 1.2,
                                endScale: 1,
                                easing: 'ease-in-out',
                              },
                            })
                          }
                        >
                          <span className="text-xs font-medium">Zoom Out</span>
                          <span className="text-[10px] text-muted-foreground">
                            Start close, end wide
                          </span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-auto py-2 px-3 flex flex-col items-start"
                          onClick={() =>
                            updateScene(selectedScene.id, {
                              kenBurnsEffect: {
                                enabled: true,
                                startPosition: { x: 0, y: 0 },
                                endPosition: { x: -20, y: -20 },
                                startScale: 1,
                                endScale: 1.4,
                                easing: 'ease-in-out',
                              },
                            })
                          }
                        >
                          <span className="text-xs font-medium">Zoom In</span>
                          <span className="text-[10px] text-muted-foreground">
                            Start wide, end close
                          </span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-auto py-2 px-3 flex flex-col items-start"
                          onClick={() =>
                            updateScene(selectedScene.id, {
                              kenBurnsEffect: {
                                enabled: true,
                                startPosition: { x: -20, y: 0 },
                                endPosition: { x: 20, y: 0 },
                                startScale: 1.1,
                                endScale: 1.1,
                                easing: 'linear',
                              },
                            })
                          }
                        >
                          <span className="text-xs font-medium">Pan Right</span>
                          <span className="text-[10px] text-muted-foreground">
                            Left to right pan
                          </span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-auto py-2 px-3 flex flex-col items-start"
                          onClick={() =>
                            updateScene(selectedScene.id, {
                              kenBurnsEffect: {
                                enabled: true,
                                startPosition: { x: 0, y: -20 },
                                endPosition: { x: 0, y: 20 },
                                startScale: 1.1,
                                endScale: 1.1,
                                easing: 'linear',
                              },
                            })
                          }
                        >
                          <span className="text-xs font-medium">Pan Down</span>
                          <span className="text-[10px] text-muted-foreground">
                            Top to bottom pan
                          </span>
                        </Button>
                      </div>
                    </div>

                    {/* Info Message */}
                    <div className="text-xs bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        💡 Ken Burns Effect
                      </div>
                      <div className="text-blue-700 dark:text-blue-300">
                        Creates a documentary-style pan and zoom animation over your still image,
                        adding dynamic movement to static photos.
                      </div>
                    </div>

                    {/* Reset Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        updateScene(selectedScene.id, {
                          kenBurnsEffect: undefined,
                        })
                      }
                    >
                      <X className="w-4 h-4 mr-2" />
                      Disable Ken Burns Effect
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* AI Background Removal - Only for video and image scenes */}
          {(selectedScene.type === 'video' || selectedScene.type === 'image') && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Wand2 className="w-3 h-3" />
                AI BACKGROUND REMOVAL
              </label>

              <div className="space-y-3">
                {/* Enable Toggle */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Remove Background</div>
                    <div className="text-xs text-muted-foreground">
                      AI-powered background removal
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedScene.backgroundRemoval?.enabled || false}
                      onChange={(e) =>
                        updateScene(selectedScene.id, {
                          backgroundRemoval: {
                            enabled: e.target.checked,
                            provider: 'remove-bg',
                            quality: 'medium',
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {selectedScene.backgroundRemoval?.enabled && (
                  <>
                    {/* AI Provider */}
                    <div>
                      <div className="text-xs mb-1">AI Provider</div>
                      <select
                        value={selectedScene.backgroundRemoval?.provider || 'remove-bg'}
                        onChange={(e) =>
                          updateScene(selectedScene.id, {
                            backgroundRemoval: {
                              ...selectedScene.backgroundRemoval!,
                              provider: e.target.value as any,
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                      >
                        <option value="remove-bg">Remove.bg</option>
                        <option value="stability">Stability AI</option>
                        <option value="runway">Runway ML</option>
                      </select>
                    </div>

                    {/* Quality */}
                    <div>
                      <div className="text-xs mb-1">Processing Quality</div>
                      <select
                        value={selectedScene.backgroundRemoval?.quality || 'medium'}
                        onChange={(e) =>
                          updateScene(selectedScene.id, {
                            backgroundRemoval: {
                              ...selectedScene.backgroundRemoval!,
                              quality: e.target.value as any,
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                      >
                        <option value="low">Low (Faster)</option>
                        <option value="medium">Medium (Balanced)</option>
                        <option value="high">High (Best Quality)</option>
                      </select>
                    </div>

                    {/* Info Message */}
                    <div className="text-xs bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        ℹ️ AI Integration Required
                      </div>
                      <div className="text-blue-700 dark:text-blue-300">
                        Background removal requires an AI provider API key. Configure your API
                        keys in Settings to enable this feature.
                      </div>
                    </div>

                    {/* Reset Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        updateScene(selectedScene.id, {
                          backgroundRemoval: undefined,
                        })
                      }
                    >
                      <X className="w-4 h-4 mr-2" />
                      Disable Background Removal
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t space-y-2">
            {/* Split Scene */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                SPLIT SCENE AT (seconds)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.1"
                  max={selectedScene.duration - 0.1}
                  step="0.1"
                  value={splitTime}
                  onChange={(e) => setSplitTime(e.target.value)}
                  placeholder={`0.1 - ${(selectedScene.duration - 0.1).toFixed(1)}`}
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const time = parseFloat(splitTime);
                    if (time > 0 && time < selectedScene.duration) {
                      splitScene(selectedScene.id, time);
                      setSplitTime('');
                    } else {
                      alert(`Split time must be between 0.1 and ${(selectedScene.duration - 0.1).toFixed(1)} seconds`);
                    }
                  }}
                  disabled={!splitTime}
                >
                  <Scissors className="w-4 h-4" />
                </Button>
              </div>
            </div>

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
