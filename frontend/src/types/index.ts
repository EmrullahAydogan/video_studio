// Core types for the video studio

export interface Scene {
  id: string;
  type: 'video' | 'image' | 'ai-generated' | 'text';
  name: string;
  duration: number; // in seconds
  startTime: number; // in seconds (position on timeline)
  thumbnail?: string;

  // Media properties
  src?: string; // video/image source
  width?: number;
  height?: number;
  originalDuration?: number; // original duration before trimming
  trimStart?: number; // trim from start in seconds
  trimEnd?: number; // trim from end in seconds

  // AI properties
  prompt?: string;
  aiProvider?: 'openai' | 'stability' | 'runway';

  // Text properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;

  // Text Animation properties
  textAnimation?: {
    type: 'none' | 'fadeIn' | 'slideIn' | 'bounce' | 'typewriter' | 'zoom' | 'rotate';
    duration: number; // in seconds
    delay: number; // in seconds
    direction?: 'left' | 'right' | 'up' | 'down';
  };

  // Layer/Position properties (for PiP and overlays)
  layer?: number; // z-index, higher = on top
  position?: {
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
  };
  scale?: number; // scale factor (0.1-2.0)
  opacity?: number; // opacity (0-1)
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay';

  // Effects
  filters?: Filter[];
  transition?: Transition;
}

export interface Filter {
  id: string;
  type: 'brightness' | 'contrast' | 'saturation' | 'blur' | 'grayscale';
  value: number;
}

export interface Transition {
  id: string;
  type: 'fade' | 'slide' | 'zoom' | 'dissolve' | 'wipe';
  duration: number; // in seconds
  direction?: 'left' | 'right' | 'up' | 'down';
}

export interface AudioTrack {
  id: string;
  name: string;
  src: string;
  startTime: number;
  duration: number;
  volume: number; // 0-1
  fadeIn?: number; // fade in duration in seconds
  fadeOut?: number; // fade out duration in seconds
}

export interface Project {
  id: string;
  name: string;
  scenes: Scene[];
  audioTracks: AudioTrack[];
  totalDuration: number;
  resolution: {
    width: number;
    height: number;
  };
  fps: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExportSettings {
  format: 'mp4' | 'webm' | 'gif';
  quality: 'low' | 'medium' | 'high' | '4k';
  fps: number;
  resolution: {
    width: number;
    height: number;
  };
}

export interface AIGenerationRequest {
  prompt: string;
  type: 'image' | 'video';
  style?: string;
  duration?: number; // for video
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3';
}

export interface TimelineState {
  zoom: number; // pixels per second
  currentTime: number; // playhead position in seconds
  isPlaying: boolean;
  selectedSceneId: string | null;
  playbackSpeed: number; // 0.25, 0.5, 1, 1.5, 2
  loop: boolean;
  volume: number; // 0-1
}
