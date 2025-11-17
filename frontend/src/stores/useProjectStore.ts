import { create } from 'zustand';
import { Scene, AudioTrack, Project, TimelineState } from '@/types';
import { projectStorage } from '@/lib/projectStorage';

interface ProjectStore {
  // Project data
  project: Project | null;
  hasUnsavedChanges: boolean;

  // Timeline state
  timeline: TimelineState;

  // Actions
  createProject: (name: string) => void;
  loadProject: (project: Project) => void;
  saveProject: () => void;
  updateProjectName: (name: string) => void;

  // Scene actions
  addScene: (scene: Omit<Scene, 'id'>) => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;
  deleteScene: (id: string) => void;
  reorderScenes: (sceneIds: string[]) => void;
  duplicateScene: (id: string) => void;

  // Audio actions
  addAudioTrack: (track: Omit<AudioTrack, 'id'>) => void;
  updateAudioTrack: (id: string, updates: Partial<AudioTrack>) => void;
  deleteAudioTrack: (id: string) => void;

  // Timeline actions
  setCurrentTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setZoom: (zoom: number) => void;
  setSelectedScene: (id: string | null) => void;

  // Utility
  getTotalDuration: () => number;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  project: null,
  hasUnsavedChanges: false,
  timeline: {
    zoom: 50, // 50 pixels per second
    currentTime: 0,
    isPlaying: false,
    selectedSceneId: null,
  },

  createProject: (name: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      scenes: [],
      audioTracks: [],
      totalDuration: 0,
      resolution: { width: 1920, height: 1080 },
      fps: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set({ project: newProject, hasUnsavedChanges: false });
    projectStorage.saveProject(newProject);
  },

  loadProject: (project: Project) => {
    set({ project, hasUnsavedChanges: false });
  },

  saveProject: () => {
    const project = get().project;
    if (!project) return;

    project.updatedAt = new Date();
    projectStorage.saveProject(project);
    set({ hasUnsavedChanges: false });
  },

  updateProjectName: (name: string) => {
    const project = get().project;
    if (!project) return;

    set({
      project: { ...project, name, updatedAt: new Date() },
      hasUnsavedChanges: true,
    });
  },

  addScene: (sceneData) => {
    const project = get().project;
    if (!project) return;

    const newScene: Scene = {
      ...sceneData,
      id: crypto.randomUUID(),
    };

    const updatedProject = {
      ...project,
      scenes: [...project.scenes, newScene],
      updatedAt: new Date(),
    };

    set({
      project: updatedProject,
      hasUnsavedChanges: true,
    });

    // Auto-save
    projectStorage.saveProject(updatedProject);
  },

  updateScene: (id, updates) => {
    const project = get().project;
    if (!project) return;

    const updatedProject = {
      ...project,
      scenes: project.scenes.map((scene) =>
        scene.id === id ? { ...scene, ...updates } : scene
      ),
      updatedAt: new Date(),
    };

    set({
      project: updatedProject,
      hasUnsavedChanges: true,
    });

    // Auto-save
    projectStorage.saveProject(updatedProject);
  },

  deleteScene: (id) => {
    const project = get().project;
    if (!project) return;

    const updatedProject = {
      ...project,
      scenes: project.scenes.filter((scene) => scene.id !== id),
      updatedAt: new Date(),
    };

    set({
      project: updatedProject,
      hasUnsavedChanges: true,
    });

    // Auto-save
    projectStorage.saveProject(updatedProject);
  },

  reorderScenes: (sceneIds) => {
    const project = get().project;
    if (!project) return;

    const sceneMap = new Map(project.scenes.map((s) => [s.id, s]));
    const reorderedScenes = sceneIds
      .map((id) => sceneMap.get(id))
      .filter((s): s is Scene => s !== undefined);

    // Recalculate startTime for each scene
    let currentTime = 0;
    const updatedScenes = reorderedScenes.map((scene) => {
      const updatedScene = { ...scene, startTime: currentTime };
      currentTime += scene.duration;
      return updatedScene;
    });

    set({
      project: {
        ...project,
        scenes: updatedScenes,
        updatedAt: new Date(),
      },
    });
  },

  duplicateScene: (id) => {
    const project = get().project;
    if (!project) return;

    const sceneToDuplicate = project.scenes.find((s) => s.id === id);
    if (!sceneToDuplicate) return;

    const newScene: Scene = {
      ...sceneToDuplicate,
      id: crypto.randomUUID(),
      name: `${sceneToDuplicate.name} (Copy)`,
    };

    set({
      project: {
        ...project,
        scenes: [...project.scenes, newScene],
        updatedAt: new Date(),
      },
    });
  },

  addAudioTrack: (trackData) => {
    const project = get().project;
    if (!project) return;

    const newTrack: AudioTrack = {
      ...trackData,
      id: crypto.randomUUID(),
    };

    set({
      project: {
        ...project,
        audioTracks: [...project.audioTracks, newTrack],
        updatedAt: new Date(),
      },
    });
  },

  updateAudioTrack: (id, updates) => {
    const project = get().project;
    if (!project) return;

    set({
      project: {
        ...project,
        audioTracks: project.audioTracks.map((track) =>
          track.id === id ? { ...track, ...updates } : track
        ),
        updatedAt: new Date(),
      },
    });
  },

  deleteAudioTrack: (id) => {
    const project = get().project;
    if (!project) return;

    set({
      project: {
        ...project,
        audioTracks: project.audioTracks.filter((track) => track.id !== id),
        updatedAt: new Date(),
      },
    });
  },

  setCurrentTime: (time) => {
    set((state) => ({
      timeline: { ...state.timeline, currentTime: time },
    }));
  },

  setIsPlaying: (isPlaying) => {
    set((state) => ({
      timeline: { ...state.timeline, isPlaying },
    }));
  },

  setZoom: (zoom) => {
    set((state) => ({
      timeline: { ...state.timeline, zoom },
    }));
  },

  setSelectedScene: (id) => {
    set((state) => ({
      timeline: { ...state.timeline, selectedSceneId: id },
    }));
  },

  getTotalDuration: () => {
    const project = get().project;
    if (!project || project.scenes.length === 0) return 0;

    return project.scenes.reduce((total, scene) => {
      return Math.max(total, scene.startTime + scene.duration);
    }, 0);
  },
}));
