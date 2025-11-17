import { Filter, Transition, Scene } from '@/types';

// Color Grading Presets
export interface ColorGradingPreset {
  id: string;
  name: string;
  description: string;
  filters: Omit<Filter, 'id'>[];
}

export const COLOR_GRADING_PRESETS: ColorGradingPreset[] = [
  {
    id: 'none',
    name: 'None',
    description: 'No color grading',
    filters: [],
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Film-like look with enhanced contrast',
    filters: [
      { type: 'brightness', value: 95 },
      { type: 'contrast', value: 130 },
      { type: 'saturation', value: 90 },
    ],
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Warm and inviting tone',
    filters: [
      { type: 'brightness', value: 110 },
      { type: 'contrast', value: 105 },
      { type: 'saturation', value: 120 },
    ],
  },
  {
    id: 'cool',
    name: 'Cool',
    description: 'Cool and modern look',
    filters: [
      { type: 'brightness', value: 105 },
      { type: 'contrast', value: 115 },
      { type: 'saturation', value: 85 },
    ],
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro film aesthetic',
    filters: [
      { type: 'brightness', value: 90 },
      { type: 'contrast', value: 125 },
      { type: 'saturation', value: 70 },
    ],
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Punchy and colorful',
    filters: [
      { type: 'brightness', value: 108 },
      { type: 'contrast', value: 120 },
      { type: 'saturation', value: 140 },
    ],
  },
  {
    id: 'muted',
    name: 'Muted',
    description: 'Soft and desaturated',
    filters: [
      { type: 'brightness', value: 100 },
      { type: 'contrast', value: 95 },
      { type: 'saturation', value: 60 },
    ],
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast dramatic look',
    filters: [
      { type: 'brightness', value: 85 },
      { type: 'contrast', value: 150 },
      { type: 'saturation', value: 95 },
    ],
  },
];

// Transition Presets
export interface TransitionPreset {
  id: string;
  name: string;
  description: string;
  transition: Omit<Transition, 'id'>;
}

export const TRANSITION_PRESETS: TransitionPreset[] = [
  {
    id: 'none',
    name: 'None',
    description: 'No transition',
    transition: { type: 'fade', duration: 0 },
  },
  {
    id: 'quick-fade',
    name: 'Quick Fade',
    description: 'Fast fade transition',
    transition: { type: 'fade', duration: 0.3 },
  },
  {
    id: 'smooth-fade',
    name: 'Smooth Fade',
    description: 'Smooth fade transition',
    transition: { type: 'fade', duration: 1 },
  },
  {
    id: 'slow-fade',
    name: 'Slow Fade',
    description: 'Long fade transition',
    transition: { type: 'fade', duration: 2 },
  },
  {
    id: 'slide-left',
    name: 'Slide Left',
    description: 'Slide from right to left',
    transition: { type: 'slide', duration: 0.8, direction: 'left' },
  },
  {
    id: 'slide-right',
    name: 'Slide Right',
    description: 'Slide from left to right',
    transition: { type: 'slide', duration: 0.8, direction: 'right' },
  },
  {
    id: 'slide-up',
    name: 'Slide Up',
    description: 'Slide from bottom to top',
    transition: { type: 'slide', duration: 0.8, direction: 'up' },
  },
  {
    id: 'slide-down',
    name: 'Slide Down',
    description: 'Slide from top to bottom',
    transition: { type: 'slide', duration: 0.8, direction: 'down' },
  },
  {
    id: 'zoom-in',
    name: 'Zoom In',
    description: 'Zoom in transition',
    transition: { type: 'zoom', duration: 1 },
  },
  {
    id: 'dissolve',
    name: 'Dissolve',
    description: 'Soft dissolve effect',
    transition: { type: 'dissolve', duration: 1.5 },
  },
  {
    id: 'wipe',
    name: 'Wipe',
    description: 'Wipe transition',
    transition: { type: 'wipe', duration: 1 },
  },
];

// Text Style Presets
export interface TextStylePreset {
  id: string;
  name: string;
  description: string;
  style: {
    fontSize: number;
    fontFamily: string;
    color: string;
  };
}

export const TEXT_STYLE_PRESETS: TextStylePreset[] = [
  {
    id: 'title',
    name: 'Title',
    description: 'Large bold title',
    style: {
      fontSize: 72,
      fontFamily: 'Arial Black',
      color: '#FFFFFF',
    },
  },
  {
    id: 'subtitle',
    name: 'Subtitle',
    description: 'Medium subtitle text',
    style: {
      fontSize: 48,
      fontFamily: 'Arial',
      color: '#FFFFFF',
    },
  },
  {
    id: 'body',
    name: 'Body',
    description: 'Regular body text',
    style: {
      fontSize: 32,
      fontFamily: 'Arial',
      color: '#FFFFFF',
    },
  },
  {
    id: 'caption',
    name: 'Caption',
    description: 'Small caption text',
    style: {
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#CCCCCC',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean modern look',
    style: {
      fontSize: 56,
      fontFamily: 'Helvetica',
      color: '#000000',
    },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Elegant serif font',
    style: {
      fontSize: 64,
      fontFamily: 'Georgia',
      color: '#2C3E50',
    },
  },
];

// Scene Templates
export interface SceneTemplate {
  id: string;
  name: string;
  description: string;
  category: 'intro' | 'outro' | 'transition' | 'text';
  sceneData: Omit<Scene, 'id' | 'startTime'>;
}

export const SCENE_TEMPLATES: SceneTemplate[] = [
  {
    id: 'intro-fade',
    name: 'Fade In Intro',
    description: 'Simple fade in text intro',
    category: 'intro',
    sceneData: {
      type: 'text',
      name: 'Intro',
      duration: 3,
      text: 'Your Title Here',
      fontSize: 72,
      fontFamily: 'Arial Black',
      color: '#FFFFFF',
      transition: { id: '', type: 'fade', duration: 1 },
    },
  },
  {
    id: 'intro-cinematic',
    name: 'Cinematic Intro',
    description: 'Dramatic cinematic intro',
    category: 'intro',
    sceneData: {
      type: 'text',
      name: 'Cinematic Intro',
      duration: 4,
      text: 'Your Title Here',
      fontSize: 84,
      fontFamily: 'Arial Black',
      color: '#FFFFFF',
      transition: { id: '', type: 'zoom', duration: 1.5 },
      filters: [
        { id: '', type: 'brightness', value: 95 },
        { id: '', type: 'contrast', value: 130 },
      ],
    },
  },
  {
    id: 'outro-fade',
    name: 'Fade Out Outro',
    description: 'Simple fade out text outro',
    category: 'outro',
    sceneData: {
      type: 'text',
      name: 'Outro',
      duration: 3,
      text: 'Thanks for Watching!',
      fontSize: 64,
      fontFamily: 'Arial',
      color: '#FFFFFF',
      transition: { id: '', type: 'fade', duration: 1.5 },
    },
  },
  {
    id: 'text-lower-third',
    name: 'Lower Third',
    description: 'Name/title lower third',
    category: 'text',
    sceneData: {
      type: 'text',
      name: 'Lower Third',
      duration: 5,
      text: 'John Doe\nCEO',
      fontSize: 32,
      fontFamily: 'Arial',
      color: '#FFFFFF',
    },
  },
  {
    id: 'text-quote',
    name: 'Quote',
    description: 'Centered quote display',
    category: 'text',
    sceneData: {
      type: 'text',
      name: 'Quote',
      duration: 6,
      text: '"Your quote here"',
      fontSize: 48,
      fontFamily: 'Georgia',
      color: '#2C3E50',
    },
  },
];

// Helper functions to apply presets
export function applyColorGradingPreset(
  preset: ColorGradingPreset
): Filter[] {
  return preset.filters.map((filter) => ({
    ...filter,
    id: crypto.randomUUID(),
  }));
}

export function applyTransitionPreset(
  preset: TransitionPreset
): Transition | undefined {
  if (preset.transition.duration === 0) {
    return undefined;
  }
  return {
    ...preset.transition,
    id: crypto.randomUUID(),
  };
}

export function applyTextStylePreset(
  preset: TextStylePreset
): Partial<Scene> {
  return {
    fontSize: preset.style.fontSize,
    fontFamily: preset.style.fontFamily,
    color: preset.style.color,
  };
}

export function createSceneFromTemplate(
  template: SceneTemplate,
  startTime: number = 0
): Scene {
  return {
    ...template.sceneData,
    id: crypto.randomUUID(),
    startTime,
    // Add IDs to filters and transition
    filters: template.sceneData.filters?.map((filter) => ({
      ...filter,
      id: crypto.randomUUID(),
    })),
    transition: template.sceneData.transition
      ? {
          ...template.sceneData.transition,
          id: crypto.randomUUID(),
        }
      : undefined,
  };
}
