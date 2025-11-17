'use client';

import { useState } from 'react';
import { PROJECT_TEMPLATES, ProjectTemplate, createProjectFromTemplate } from '@/lib/templates';
import { useProjectStore } from '@/stores/useProjectStore';
import { X, FileText, Video, Briefcase, GraduationCap, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons = {
  'social-media': Video,
  youtube: Video,
  business: Briefcase,
  education: GraduationCap,
  personal: User,
};

const categoryLabels = {
  'social-media': 'Social Media',
  youtube: 'YouTube',
  business: 'Business',
  education: 'Education',
  personal: 'Personal',
};

export function TemplateLibrary({ isOpen, onClose }: TemplateLibraryProps) {
  const { loadProject } = useProjectStore();
  const [selectedCategory, setSelectedCategory] = useState<ProjectTemplate['category'] | 'all'>('all');
  const [projectName, setProjectName] = useState('');

  if (!isOpen) return null;

  const categories: Array<ProjectTemplate['category'] | 'all'> = ['all', 'social-media', 'youtube', 'business', 'education', 'personal'];

  const filteredTemplates = selectedCategory === 'all'
    ? PROJECT_TEMPLATES
    : PROJECT_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleSelectTemplate = (template: ProjectTemplate) => {
    const name = projectName.trim() || `${template.name} Project`;
    const project = createProjectFromTemplate(template.id, name);
    loadProject(project);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Project Templates
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Start your video project with a professional template
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Project Name Input */}
        <div className="px-6 pt-4">
          <label className="block text-sm font-medium mb-2">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name (optional)"
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
        </div>

        {/* Category Filter */}
        <div className="px-6 py-4 border-b">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => {
              const Icon = category === 'all' ? FileText : categoryIcons[category as ProjectTemplate['category']];
              const label = category === 'all' ? 'All Templates' : categoryLabels[category as ProjectTemplate['category']];

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-accent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const Icon = categoryIcons[template.category];

              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="text-left border rounded-lg p-4 hover:border-primary hover:bg-accent/50 transition-all group"
                >
                  {/* Template Preview */}
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-md mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <div className="text-center">
                      <Icon className="w-12 h-12 mx-auto mb-2 text-primary" />
                      <div className="text-xs text-muted-foreground">
                        {template.resolution.width} × {template.resolution.height}
                      </div>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 bg-secondary rounded">
                        {categoryLabels[template.category]}
                      </span>
                      <span>{template.fps} FPS</span>
                      <span>• {template.defaultScenes.length} scenes</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-secondary/20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            </p>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
