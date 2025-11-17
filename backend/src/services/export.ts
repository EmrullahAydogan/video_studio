import { Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import Bull from 'bull';

// Create a queue for video rendering jobs
const renderQueue = new Bull('video-render', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

export const exportProject = async (req: Request, res: Response) => {
  try {
    const { scenes, audioTracks, settings } = req.body;

    if (!scenes || scenes.length === 0) {
      return res.status(400).json({ error: 'No scenes provided' });
    }

    // Create a rendering job
    const job = await renderQueue.add({
      scenes,
      audioTracks,
      settings,
      timestamp: Date.now(),
    });

    // Process the job
    renderQueue.process(async (job) => {
      return processRenderJob(job.data);
    });

    res.json({
      success: true,
      jobId: job.id,
      message: 'Rendering started',
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to start export' });
  }
};

export const getExportStatus = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    const job = await renderQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const state = await job.getState();
    const progress = job.progress();

    res.json({
      success: true,
      jobId,
      state,
      progress,
    });
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ error: 'Failed to get export status' });
  }
};

async function processRenderJob(data: any) {
  const { scenes, audioTracks, settings } = data;

  return new Promise((resolve, reject) => {
    const outputPath = `exports/video-${Date.now()}.${settings.format || 'mp4'}`;

    // TODO: Implement actual video rendering with FFmpeg
    // - Concatenate scenes
    // - Apply transitions
    // - Mix audio tracks
    // - Apply effects
    // - Encode to desired format

    const command = ffmpeg();

    // Add input files
    scenes.forEach((scene: any) => {
      if (scene.src) {
        command.input(scene.src);
      }
    });

    // Set output options
    command
      .outputOptions([
        `-vcodec libx264`,
        `-acodec aac`,
        `-b:v ${settings.videoBitrate || '5000k'}`,
        `-b:a ${settings.audioBitrate || '192k'}`,
      ])
      .size(`${settings.resolution?.width || 1920}x${settings.resolution?.height || 1080}`)
      .fps(settings.fps || 30)
      .on('progress', (progress) => {
        console.log(`Processing: ${progress.percent}% done`);
      })
      .on('end', () => {
        console.log('Rendering finished');
        resolve({ outputPath });
      })
      .on('error', (err) => {
        console.error('Rendering error:', err);
        reject(err);
      })
      .save(outputPath);
  });
}
