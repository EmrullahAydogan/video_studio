import { create } from 'zustand';
import { Scene, AudioTrack, Marker, Project, TimelineState } from '@/types';
import { projectStorage } from '@/lib/projectStorage';

// Helper to save state to history
const saveToHistory = (
  set: any,
  get: any,
  updatedProject: Project
) => {
  const { history, historyIndex } = get();
  const MAX_HISTORY = 50; // Keep last 50 states

  // Remove any future history if we're not at the end
  const newHistory = history.slice(0, historyIndex + 1);

  // Add new state
  newHistory.push(JSON.parse(JSON.stringify(updatedProject)));

  // Limit history size
  if (newHistory.length > MAX_HISTORY) {
    newHistory.shift();
  }

  set({
    project: updatedProject,
    history: newHistory,
    historyIndex: newHistory.length - 1,
    hasUnsavedChanges: true,
  });

  // Auto-save
  projectStorage.saveProject(updatedProject);
};

interface ProjectStore {
  // Project data
  project: Project | null;
  hasUnsavedChanges: boolean;

  // History for undo/redo
  history: Project[];
  historyIndex: number;

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
  splitScene: (id: string, splitTime: number) => void;

  // Audio actions
  addAudioTrack: (track: Omit<AudioTrack, 'id'>) => void;
  updateAudioTrack: (id: string, updates: Partial<AudioTrack>) => void;
  deleteAudioTrack: (id: string) => void;

  // Marker actions
  addMarker: (marker: Omit<Marker, 'id'>) => void;
  updateMarker: (id: string, updates: Partial<Marker>) => void;
  deleteMarker: (id: string) => void;
  jumpToMarker: (id: string) => void;

  // Timeline actions
  setCurrentTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setZoom: (zoom: number) => void;
  setSelectedScene: (id: string | null) => void;
  setPlaybackSpeed: (speed: number) => void;
  setLoop: (loop: boolean) => void;
  setVolume: (volume: number) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Utility
  getTotalDuration: () => number;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  project: null,
  hasUnsavedChanges: false,
  history: [],
  historyIndex: -1,
  timeline: {
    zoom: 50, // 50 pixels per second
    currentTime: 0,
    isPlaying: false,
    selectedSceneId: null,
    playbackSpeed: 1,
    loop: false,
    volume: 1,
  },

  createProject: (name: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      scenes: [],
      audioTracks: [],
      markers: [],
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
    // Ensure markers array exists for backwards compatibility
    if (!project.markers) {
      project.markers = [];
    }
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

    saveToHistory(set, get, updatedProject);
  },

  deleteScene: (id) => {
    const project = get().project;
    if (!project) return;

    const updatedProject = {
      ...project,
      scenes: project.scenes.filter((scene) => scene.id !== id),
      updatedAt: new Date(),
    };

    saveToHistory(set, get, updatedProject);
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

  splitScene: (id, splitTime) => {
    const project = get().project;
    if (!project) return;

    const sceneIndex = project.scenes.findIndex((s) => s.id === id);
    if (sceneIndex === -1) return;

    const sceneToSplit = project.scenes[sceneIndex];
    if (splitTime <= 0 || splitTime >= sceneToSplit.duration) return;

    // Create first part (before split)
    const firstPart: Scene = {
      ...sceneToSplit,
      id: crypto.randomUUID(),
      duration: splitTime,
      name: `${sceneToSplit.name} (Part 1)`,
      trimEnd: (sceneToSplit.trimEnd || 0) + (sceneToSplit.duration - splitTime),
    };

    // Create second part (after split)
    const secondPart: Scene = {
      ...sceneToSplit,
      id: crypto.randomUUID(),
      duration: sceneToSplit.duration - splitTime,
      startTime: sceneToSplit.startTime + splitTime,
      name: `${sceneToSplit.name} (Part 2)`,
      trimStart: (sceneToSplit.trimStart || 0) + splitTime,
    };

    // Replace original scene with two new scenes
    const newScenes = [...project.scenes];
    newScenes.splice(sceneIndex, 1, firstPart, secondPart);

    const updatedProject = {
      ...project,
      scenes: newScenes,
      updatedAt: new Date(),
    };

    set({
      project: updatedProject,
      hasUnsavedChanges: true,
    });

    // Auto-save
    projectStorage.saveProject(updatedProject);
  },

  addAudioTrack: (trackData) => {
    const project = get().project;
    if (!project) return;

    const newTrack: AudioTrack = {
      ...trackData,
      id: crypto.randomUUID(),
    };

    const updatedProject = {
      ...project,
      audioTracks: [...project.audioTracks, newTrack],
      updatedAt: new Date(),
    };

    set({
      project: updatedProject,
      hasUnsavedChanges: true,
    });

    // Auto-save
    projectStorage.saveProject(updatedProject);
  },

  updateAudioTrack: (id, updates) => {
    const project = get().project;
    if (!project) return;

    const updatedProject = {
      ...project,
      audioTracks: project.audioTracks.map((track) =>
        track.id === id ? { ...track, ...updates } : track
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

  deleteAudioTrack: (id) => {
    const project = get().project;
    if (!project) return;

    const updatedProject = {
      ...project,
      audioTracks: project.audioTracks.filter((track) => track.id !== id),
      updatedAt: new Date(),
    };

    set({
      project: updatedProject,
      hasUnsavedChanges: true,
    });

    // Auto-save
    projectStorage.saveProject(updatedProject);
  },

  addMarker: (markerData) => {
    const project = get().project;
    if (!project) return;

    const newMarker: Marker = {
      ...markerData,
      id: crypto.randomUUID(),
    };

    const updatedProject = {
      ...project,
      markers: [...project.markers, newMarker].sort((a, b) => a.time - b.time),
      updatedAt: new Date(),
    };

    set({
      project: updatedProject,
      hasUnsavedChanges: true,
    });

    // Auto-save
    projectStorage.saveProject(updatedProject);
  },

  updateMarker: (id, updates) => {
    const project = get().project;
    if (!project) return;

    const updatedProject = {
      ...project,
      markers: project.markers
        .map((marker) => (marker.id === id ? { ...marker, ...updates } : marker))
        .sort((a, b) => a.time - b.time),
      updatedAt: new Date(),
    };

    set({
      project: updatedProject,
      hasUnsavedChanges: true,
    });

    // Auto-save
    projectStorage.saveProject(updatedProject);
  },

  deleteMarker: (id) => {
    const project = get().project;
    if (!project) return;

    const updatedProject = {
      ...project,
      markers: project.markers.filter((marker) => marker.id !== id),
      updatedAt: new Date(),
    };

    set({
      project: updatedProject,
      hasUnsavedChanges: true,
    });

    // Auto-save
    projectStorage.saveProject(updatedProject);
  },

  jumpToMarker: (id) => {
    const project = get().project;
    if (!project) return;

    const marker = project.markers.find((m) => m.id === id);
    if (!marker) return;

    set((state) => ({
      timeline: { ...state.timeline, currentTime: marker.time },
    }));
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

  setPlaybackSpeed: (speed) => {
    set((state) => ({
      timeline: { ...state.timeline, playbackSpeed: speed },
    }));
  },

  setLoop: (loop) => {
    set((state) => ({
      timeline: { ...state.timeline, loop },
    }));
  },

  setVolume: (volume) => {
    set((state) => ({
      timeline: { ...state.timeline, volume },
    }));
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const previousProject = history[historyIndex - 1];
      set({
        project: previousProject,
        historyIndex: historyIndex - 1,
        hasUnsavedChanges: true,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextProject = history[historyIndex + 1];
      set({
        project: nextProject,
        historyIndex: historyIndex + 1,
        hasUnsavedChanges: true,
      });
    }
  },

  canUndo: () => {
    const { historyIndex } = get();
    return historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },

  getTotalDuration: () => {
    const project = get().project;
    if (!project || project.scenes.length === 0) return 0;

    return project.scenes.reduce((total, scene) => {
      return Math.max(total, scene.startTime + scene.duration);
    }, 0);
  },
}));
