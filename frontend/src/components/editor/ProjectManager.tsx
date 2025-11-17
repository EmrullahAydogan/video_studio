'use client';

import { useState, useEffect } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { projectStorage, SavedProject } from '@/lib/projectStorage';
import {
  FolderOpen,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  X,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';

interface ProjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectManager({ isOpen, onClose }: ProjectManagerProps) {
  const { project, createProject, loadProject } = useProjectStore();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  const loadProjects = () => {
    const savedProjects = projectStorage.listProjects();
    // Sort by last modified (newest first)
    savedProjects.sort(
      (a, b) => b.lastModified.getTime() - a.lastModified.getTime()
    );
    setProjects(savedProjects);
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    createProject(newProjectName);
    setNewProjectName('');
    setShowNewProjectInput(false);
    loadProjects();
  };

  const handleLoadProject = (projectId: string) => {
    const loadedProject = projectStorage.loadProject(projectId);
    if (loadedProject) {
      loadProject(loadedProject);
      onClose();
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      projectStorage.deleteProject(projectId);
      loadProjects();
    }
  };

  const handleDuplicateProject = (projectId: string) => {
    const original = projects.find((p) => p.id === projectId);
    if (!original) return;

    const newName = `${original.name} (Copy)`;
    const duplicated = projectStorage.duplicateProject(projectId, newName);

    if (duplicated) {
      loadProjects();
    }
  };

  const handleExportProject = (projectId: string) => {
    const proj = projectStorage.loadProject(projectId);
    if (proj) {
      projectStorage.exportProjectToFile(proj);
    }
  };

  const handleImportProject = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await projectStorage.importProjectFromFile(file);
      loadProject(imported);
      loadProjects();
      e.target.value = ''; // Reset input
      onClose();
    } catch (error) {
      alert('Failed to import project. Please check the file format.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Project Manager
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="p-4 border-b flex gap-2">
          <Button
            onClick={() => setShowNewProjectInput(true)}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>

          <label htmlFor="import-project">
            <Button size="sm" variant="outline" asChild>
              <span className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </span>
            </Button>
          </label>
          <input
            id="import-project"
            type="file"
            accept=".json"
            onChange={handleImportProject}
            className="hidden"
          />
        </div>

        {/* New Project Input */}
        {showNewProjectInput && (
          <div className="p-4 border-b bg-accent/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name..."
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleCreateProject();
                }}
              />
              <Button onClick={handleCreateProject} size="sm">
                Create
              </Button>
              <Button
                onClick={() => {
                  setShowNewProjectInput(false);
                  setNewProjectName('');
                }}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-4">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No projects yet</p>
              <Button onClick={() => setShowNewProjectInput(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                    project?.id === proj.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleLoadProject(proj.id)}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    {proj.thumbnail ? (
                      <img
                        src={proj.thumbnail}
                        alt={proj.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FolderOpen className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold truncate mb-2">{proj.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                      <Clock className="w-3 h-3" />
                      {new Date(proj.lastModified).toLocaleDateString()}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateProject(proj.id);
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportProject(proj.id);
                        }}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(proj.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </span>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
