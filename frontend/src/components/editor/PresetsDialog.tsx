'use client';

import { useState } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import {
  Palette,
  Sparkles,
  Type,
  Film,
  X,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  COLOR_GRADING_PRESETS,
  TRANSITION_PRESETS,
  TEXT_STYLE_PRESETS,
  SCENE_TEMPLATES,
  applyColorGradingPreset,
  applyTransitionPreset,
  applyTextStylePreset,
  createSceneFromTemplate,
  ColorGradingPreset,
  TransitionPreset,
  TextStylePreset,
  SceneTemplate,
} from '@/lib/presets';

interface PresetsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'color' | 'transition' | 'text' | 'templates';

export function PresetsDialog({ isOpen, onClose }: PresetsDialogProps) {
  const { timeline, project, updateScene, addScene } = useProjectStore();
  const [activeTab, setActiveTab] = useState<TabType>('color');

  const selectedScene = project?.scenes.find(
    (s) => s.id === timeline.selectedSceneId
  );

  if (!isOpen) return null;

  const tabs = [
    { id: 'color' as TabType, label: 'Color Grading', icon: Palette },
    { id: 'transition' as TabType, label: 'Transitions', icon: Sparkles },
    { id: 'text' as TabType, label: 'Text Styles', icon: Type },
    { id: 'templates' as TabType, label: 'Templates', icon: Film },
  ];

  const handleApplyColorPreset = (preset: ColorGradingPreset) => {
    if (!selectedScene) {
      alert('Please select a scene first');
      return;
    }
    const filters = applyColorGradingPreset(preset);
    updateScene(selectedScene.id, { filters });
  };

  const handleApplyTransitionPreset = (preset: TransitionPreset) => {
    if (!selectedScene) {
      alert('Please select a scene first');
      return;
    }
    const transition = applyTransitionPreset(preset);
    updateScene(selectedScene.id, { transition });
  };

  const handleApplyTextStylePreset = (preset: TextStylePreset) => {
    if (!selectedScene || selectedScene.type !== 'text') {
      alert('Please select a text scene first');
      return;
    }
    const style = applyTextStylePreset(preset);
    updateScene(selectedScene.id, style);
  };

  const handleApplyTemplate = (template: SceneTemplate) => {
    const totalDuration = project?.scenes.reduce(
      (max, scene) => Math.max(max, scene.startTime + scene.duration),
      0
    ) ?? 0;
    const newScene = createSceneFromTemplate(template, totalDuration);
    addScene(newScene);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-card border rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Film className="w-5 h-5" />
            Presets & Templates
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-secondary/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Color Grading Presets */}
          {activeTab === 'color' && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedScene
                  ? 'Click a preset to apply it to the selected scene'
                  : 'Select a scene to apply color grading'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {COLOR_GRADING_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyColorPreset(preset)}
                    disabled={!selectedScene}
                    className="p-4 border-2 rounded-lg hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <div className="font-medium mb-1">{preset.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {preset.description}
                    </div>
                    {preset.filters.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {preset.filters.map((filter, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 bg-secondary rounded"
                          >
                            {filter.type}: {filter.value}%
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transition Presets */}
          {activeTab === 'transition' && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedScene
                  ? 'Click a preset to apply it to the selected scene'
                  : 'Select a scene to apply transitions'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {TRANSITION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyTransitionPreset(preset)}
                    disabled={!selectedScene}
                    className="p-4 border-2 rounded-lg hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium">{preset.name}</div>
                      {preset.transition.duration > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {preset.transition.duration}s
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {preset.description}
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] px-2 py-0.5 bg-secondary rounded capitalize">
                        {preset.transition.type}
                        {preset.transition.direction && ` - ${preset.transition.direction}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Text Style Presets */}
          {activeTab === 'text' && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedScene?.type === 'text'
                  ? 'Click a preset to apply it to the selected text scene'
                  : 'Select a text scene to apply text styles'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {TEXT_STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyTextStylePreset(preset)}
                    disabled={!selectedScene || selectedScene.type !== 'text'}
                    className="p-4 border-2 rounded-lg hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <div className="font-medium mb-1">{preset.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {preset.description}
                    </div>
                    <div
                      className="p-2 bg-secondary rounded text-center"
                      style={{
                        fontFamily: preset.style.fontFamily,
                        fontSize: `${Math.min(preset.style.fontSize / 3, 20)}px`,
                        color: preset.style.color,
                      }}
                    >
                      Sample Text
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scene Templates */}
          {activeTab === 'templates' && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Click a template to add it to your timeline
              </p>
              <div className="space-y-6">
                {['intro', 'outro', 'text', 'transition'].map((category) => {
                  const templates = SCENE_TEMPLATES.filter(
                    (t) => t.category === category
                  );
                  if (templates.length === 0) return null;

                  return (
                    <div key={category}>
                      <h3 className="text-sm font-semibold mb-3 capitalize">
                        {category}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {templates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => handleApplyTemplate(template)}
                            className="p-4 border-2 rounded-lg hover:border-primary transition-colors text-left"
                          >
                            <div className="font-medium mb-1">
                              {template.name}
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">
                              {template.description}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[10px] px-2 py-0.5 bg-secondary rounded">
                                {template.sceneData.duration}s
                              </span>
                              {template.sceneData.transition && (
                                <span className="text-[10px] px-2 py-0.5 bg-secondary rounded">
                                  {template.sceneData.transition.type}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {selectedScene
              ? `Selected: ${selectedScene.name}`
              : 'No scene selected'}
          </div>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
