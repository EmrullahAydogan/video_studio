'use client';

import { useState } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { api } from '@/lib/api';
import { Download, X, Loader2, Info, Film, HardDrive, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExportSettings } from '@/types';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  const { project } = useProjectStore();
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'mp4',
    quality: 'high',
    fps: 30,
    resolution: { width: 1920, height: 1080 },
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!project || project.scenes.length === 0) {
      setError('No scenes to export');
      return;
    }

    setIsExporting(true);
    setError(null);
    setExportProgress(0);

    try {
      // Start export job
      const response = await api.exportProject(
        project.scenes,
        project.audioTracks,
        settings
      );

      if (response.success && response.jobId) {
        // Poll for export status
        const pollInterval = setInterval(async () => {
          try {
            const status = await api.getExportStatus(response.jobId);

            if (status.progress) {
              setExportProgress(status.progress);
            }

            if (status.state === 'completed') {
              clearInterval(pollInterval);
              setIsExporting(false);
              setExportProgress(100);
              // TODO: Download the exported video
              setTimeout(onClose, 2000);
            } else if (status.state === 'failed') {
              clearInterval(pollInterval);
              setError('Export failed');
              setIsExporting(false);
            }
          } catch (err) {
            clearInterval(pollInterval);
            setError('Failed to get export status');
            setIsExporting(false);
          }
        }, 1000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed';
      setError(errorMessage);
      setIsExporting(false);
    }
  };

  const resolutionOptions = [
    { label: '720p', width: 1280, height: 720 },
    { label: '1080p', width: 1920, height: 1080 },
    { label: '2K', width: 2560, height: 1440 },
    { label: '4K', width: 3840, height: 2160 },
  ];

  const qualityOptions: Array<ExportSettings['quality']> = ['low', 'medium', 'high', '4k'];
  const formatOptions: Array<ExportSettings['format']> = ['mp4', 'webm', 'gif'];
  const fpsOptions = [24, 30, 60];

  // Calculate export statistics
  const totalDuration = project?.scenes.reduce(
    (max, scene) => Math.max(max, scene.startTime + scene.duration),
    0
  ) ?? 0;

  const estimatedFileSize = (() => {
    const bitrates = {
      low: 2,
      medium: 5,
      high: 10,
      '4k': 25,
    };
    const bitrate = bitrates[settings.quality];
    return ((bitrate * totalDuration) / 8).toFixed(1); // MB
  })();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Video
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            disabled={isExporting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Preview */}
        <div className="mb-6 border rounded-lg p-4 bg-secondary/20">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-primary" />
            <h3 className="font-medium text-sm">Export Preview</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Video Preview Box */}
            <div className="col-span-2 bg-black/20 rounded-lg flex items-center justify-center aspect-video border border-border">
              <div className="text-center">
                <Film className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  {settings.resolution.width} × {settings.resolution.height}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {(settings.resolution.width / settings.resolution.height).toFixed(2)}:1 aspect ratio
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Duration</div>
                <div className="font-medium">{totalDuration.toFixed(1)}s</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <HardDrive className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Est. Size</div>
                <div className="font-medium">~{estimatedFileSize} MB</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Film className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Scenes</div>
                <div className="font-medium">{project?.scenes.length || 0}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Download className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Format</div>
                <div className="font-medium">{settings.format.toUpperCase()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4 mb-6">
          {/* Format */}
          <div>
            <label className="text-sm font-medium block mb-2">Format</label>
            <div className="grid grid-cols-3 gap-2">
              {formatOptions.map((format) => (
                <button
                  key={format}
                  onClick={() => setSettings({ ...settings, format })}
                  className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
                    settings.format === format
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-accent'
                  }`}
                  disabled={isExporting}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div>
            <label className="text-sm font-medium block mb-2">Resolution</label>
            <div className="grid grid-cols-2 gap-2">
              {resolutionOptions.map((res) => (
                <button
                  key={res.label}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      resolution: { width: res.width, height: res.height },
                    })
                  }
                  className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
                    settings.resolution.width === res.width &&
                    settings.resolution.height === res.height
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-accent'
                  }`}
                  disabled={isExporting}
                >
                  {res.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div>
            <label className="text-sm font-medium block mb-2">Quality</label>
            <select
              value={settings.quality}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  quality: e.target.value as ExportSettings['quality'],
                })
              }
              className="w-full px-3 py-2 border rounded-md bg-background"
              disabled={isExporting}
            >
              {qualityOptions.map((quality) => (
                <option key={quality} value={quality}>
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* FPS */}
          <div>
            <label className="text-sm font-medium block mb-2">Frame Rate (FPS)</label>
            <div className="grid grid-cols-3 gap-2">
              {fpsOptions.map((fps) => (
                <button
                  key={fps}
                  onClick={() => setSettings({ ...settings, fps })}
                  className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
                    settings.fps === fps
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-accent'
                  }`}
                  disabled={isExporting}
                >
                  {fps}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        {isExporting && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Exporting...</span>
              <span>{Math.round(exportProgress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button onClick={handleExport} className="flex-1" disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
