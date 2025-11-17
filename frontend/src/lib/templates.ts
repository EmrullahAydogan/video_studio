import { Project, Scene } from '@/types';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'social-media' | 'youtube' | 'business' | 'education' | 'personal';
  thumbnail?: string;
  resolution: {
    width: number;
    height: number;
  };
  fps: number;
  defaultScenes: Omit<Scene, 'id'>[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Project',
    description: 'Start from scratch with an empty timeline',
    category: 'personal',
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    defaultScenes: [],
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    description: 'Vertical video optimized for Instagram Stories (9:16)',
    category: 'social-media',
    resolution: { width: 1080, height: 1920 },
    fps: 30,
    defaultScenes: [
      {
        type: 'text',
        name: 'Opening Title',
        duration: 3,
        startTime: 0,
        text: 'Your Story Title',
        fontSize: 72,
        fontFamily: 'Inter',
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        textAnimation: {
          type: 'fadeIn',
          duration: 1,
          delay: 0,
        },
        position: { x: 50, y: 20 },
      },
    ],
  },
  {
    id: 'youtube-intro',
    name: 'YouTube Intro',
    description: '5-second intro for YouTube videos',
    category: 'youtube',
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    defaultScenes: [
      {
        type: 'text',
        name: 'Channel Name',
        duration: 2,
        startTime: 0,
        text: 'YOUR CHANNEL',
        fontSize: 96,
        fontFamily: 'Inter',
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        textAnimation: {
          type: 'zoom',
          duration: 1.5,
          delay: 0,
        },
        position: { x: 50, y: 50 },
      },
      {
        type: 'text',
        name: 'Tagline',
        duration: 3,
        startTime: 2,
        text: 'Subscribe for more!',
        fontSize: 48,
        fontFamily: 'Inter',
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        textAnimation: {
          type: 'slideIn',
          duration: 0.8,
          delay: 0,
          direction: 'up',
        },
        position: { x: 50, y: 60 },
      },
    ],
  },
  {
    id: 'product-demo',
    name: 'Product Demo',
    description: 'Professional product demonstration video',
    category: 'business',
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    defaultScenes: [
      {
        type: 'text',
        name: 'Product Name',
        duration: 3,
        startTime: 0,
        text: 'Introducing...',
        fontSize: 64,
        fontFamily: 'Inter',
        color: '#000000',
        backgroundColor: 'transparent',
        textAnimation: {
          type: 'fadeIn',
          duration: 1,
          delay: 0,
        },
        position: { x: 50, y: 30 },
      },
      {
        type: 'text',
        name: 'Features',
        duration: 5,
        startTime: 3,
        text: 'Key Features',
        fontSize: 48,
        fontFamily: 'Inter',
        color: '#333333',
        backgroundColor: 'transparent',
        textAnimation: {
          type: 'slideIn',
          duration: 0.8,
          delay: 0,
          direction: 'left',
        },
        position: { x: 20, y: 20 },
      },
    ],
  },
  {
    id: 'tiktok-video',
    name: 'TikTok Video',
    description: 'Vertical video optimized for TikTok (9:16)',
    category: 'social-media',
    resolution: { width: 1080, height: 1920 },
    fps: 30,
    defaultScenes: [
      {
        type: 'text',
        name: 'Hook',
        duration: 2,
        startTime: 0,
        text: 'Wait for it...',
        fontSize: 64,
        fontFamily: 'Inter',
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        textAnimation: {
          type: 'bounce',
          duration: 1,
          delay: 0,
        },
        position: { x: 50, y: 15 },
      },
    ],
  },
  {
    id: 'presentation',
    name: 'Presentation',
    description: 'Educational or business presentation template',
    category: 'education',
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    defaultScenes: [
      {
        type: 'text',
        name: 'Title Slide',
        duration: 4,
        startTime: 0,
        text: 'Presentation Title',
        fontSize: 80,
        fontFamily: 'Inter',
        color: '#1a1a1a',
        backgroundColor: 'transparent',
        textAnimation: {
          type: 'fadeIn',
          duration: 1,
          delay: 0,
        },
        position: { x: 50, y: 40 },
      },
      {
        type: 'text',
        name: 'Subtitle',
        duration: 4,
        startTime: 0,
        text: 'Your Name',
        fontSize: 36,
        fontFamily: 'Inter',
        color: '#666666',
        backgroundColor: 'transparent',
        textAnimation: {
          type: 'fadeIn',
          duration: 1,
          delay: 0.5,
        },
        position: { x: 50, y: 55 },
      },
    ],
  },
  {
    id: 'square-video',
    name: 'Square Video (1:1)',
    description: 'Square format for social media posts',
    category: 'social-media',
    resolution: { width: 1080, height: 1080 },
    fps: 30,
    defaultScenes: [
      {
        type: 'text',
        name: 'Title',
        duration: 3,
        startTime: 0,
        text: 'Your Message',
        fontSize: 56,
        fontFamily: 'Inter',
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        textAnimation: {
          type: 'fadeIn',
          duration: 1,
          delay: 0,
        },
        position: { x: 50, y: 50 },
      },
    ],
  },
  {
    id: 'tutorial',
    name: 'Tutorial Video',
    description: 'Step-by-step tutorial template',
    category: 'education',
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    defaultScenes: [
      {
        type: 'text',
        name: 'Intro',
        duration: 3,
        startTime: 0,
        text: 'How To...',
        fontSize: 72,
        fontFamily: 'Inter',
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        textAnimation: {
          type: 'slideIn',
          duration: 0.8,
          delay: 0,
          direction: 'down',
        },
        position: { x: 50, y: 20 },
      },
      {
        type: 'text',
        name: 'Step 1',
        duration: 5,
        startTime: 3,
        text: 'Step 1: ...',
        fontSize: 48,
        fontFamily: 'Inter',
        color: '#333333',
        backgroundColor: 'transparent',
        textAnimation: {
          type: 'fadeIn',
          duration: 0.5,
          delay: 0,
        },
        position: { x: 20, y: 15 },
      },
    ],
  },
];

export function getTemplateById(id: string): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES.find((template) => template.id === id);
}

export function getTemplatesByCategory(category: ProjectTemplate['category']): ProjectTemplate[] {
  return PROJECT_TEMPLATES.filter((template) => template.category === category);
}

export function createProjectFromTemplate(templateId: string, projectName: string): Project {
  const template = getTemplateById(templateId);

  if (!template) {
    throw new Error(`Template with id "${templateId}" not found`);
  }

  // Create scenes from template with generated IDs
  const scenes: Scene[] = template.defaultScenes.map((sceneData) => ({
    ...sceneData,
    id: crypto.randomUUID(),
  }));

  const project: Project = {
    id: crypto.randomUUID(),
    name: projectName,
    scenes,
    audioTracks: [],
    markers: [],
    totalDuration: scenes.reduce(
      (max, scene) => Math.max(max, scene.startTime + scene.duration),
      0
    ),
    resolution: template.resolution,
    fps: template.fps,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return project;
}
