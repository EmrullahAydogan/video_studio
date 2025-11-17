import { Project } from '@/types';

const STORAGE_KEY = 'ai-video-studio-projects';
const CURRENT_PROJECT_KEY = 'ai-video-studio-current-project';

export interface SavedProject {
  id: string;
  name: string;
  lastModified: Date;
  thumbnail?: string;
}

class ProjectStorage {
  /**
   * Save project to localStorage
   */
  saveProject(project: Project): void {
    try {
      // Save the full project
      localStorage.setItem(`project-${project.id}`, JSON.stringify(project));

      // Update projects list
      const projects = this.listProjects();
      const existingIndex = projects.findIndex((p) => p.id === project.id);

      const savedProject: SavedProject = {
        id: project.id,
        name: project.name,
        lastModified: new Date(),
        thumbnail: project.scenes[0]?.thumbnail,
      };

      if (existingIndex >= 0) {
        projects[existingIndex] = savedProject;
      } else {
        projects.push(savedProject);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      localStorage.setItem(CURRENT_PROJECT_KEY, project.id);
    } catch (error) {
      console.error('Failed to save project:', error);
      throw new Error('Failed to save project to storage');
    }
  }

  /**
   * Load project from localStorage
   */
  loadProject(projectId: string): Project | null {
    try {
      const data = localStorage.getItem(`project-${projectId}`);
      if (!data) return null;

      const project = JSON.parse(data);

      // Convert date strings back to Date objects
      project.createdAt = new Date(project.createdAt);
      project.updatedAt = new Date(project.updatedAt);

      localStorage.setItem(CURRENT_PROJECT_KEY, projectId);
      return project;
    } catch (error) {
      console.error('Failed to load project:', error);
      return null;
    }
  }

  /**
   * List all saved projects
   */
  listProjects(): SavedProject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const projects = JSON.parse(data);
      return projects.map((p: any) => ({
        ...p,
        lastModified: new Date(p.lastModified),
      }));
    } catch (error) {
      console.error('Failed to list projects:', error);
      return [];
    }
  }

  /**
   * Delete a project
   */
  deleteProject(projectId: string): void {
    try {
      localStorage.removeItem(`project-${projectId}`);

      const projects = this.listProjects();
      const filtered = projects.filter((p) => p.id !== projectId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      // If deleted project was current, clear current
      const currentId = localStorage.getItem(CURRENT_PROJECT_KEY);
      if (currentId === projectId) {
        localStorage.removeItem(CURRENT_PROJECT_KEY);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw new Error('Failed to delete project');
    }
  }

  /**
   * Get current project ID
   */
  getCurrentProjectId(): string | null {
    return localStorage.getItem(CURRENT_PROJECT_KEY);
  }

  /**
   * Duplicate a project
   */
  duplicateProject(projectId: string, newName: string): Project | null {
    const original = this.loadProject(projectId);
    if (!original) return null;

    const duplicate: Project = {
      ...original,
      id: crypto.randomUUID(),
      name: newName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.saveProject(duplicate);
    return duplicate;
  }

  /**
   * Export project as JSON file
   */
  exportProjectToFile(project: Project): void {
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/[^a-z0-9]/gi, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /**
   * Import project from JSON file
   */
  async importProjectFromFile(file: File): Promise<Project> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const project = JSON.parse(e.target?.result as string);

          // Generate new ID and update dates
          project.id = crypto.randomUUID();
          project.createdAt = new Date();
          project.updatedAt = new Date();

          this.saveProject(project);
          resolve(project);
        } catch (error) {
          reject(new Error('Invalid project file'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Clear all projects (for testing/reset)
   */
  clearAll(): void {
    const projects = this.listProjects();
    projects.forEach((p) => {
      localStorage.removeItem(`project-${p.id}`);
    });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_PROJECT_KEY);
  }
}

export const projectStorage = new ProjectStorage();
