import { Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const videoInfo = await getVideoMetadata(req.file.path);

    res.json({
      success: true,
      file: {
        id: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        ...videoInfo,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};

export const processVideo = async (req: Request, res: Response) => {
  try {
    const { videoPath, startTime, duration, effects } = req.body;

    // TODO: Implement video processing with FFmpeg
    // - Trim video
    // - Apply filters/effects
    // - Generate thumbnail

    res.json({
      success: true,
      message: 'Video processing started',
    });
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
};

export const getVideoInfo = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const videoPath = path.join('uploads/videos', videoId);

    const info = await getVideoMetadata(videoPath);

    res.json({
      success: true,
      info,
    });
  } catch (error) {
    console.error('Info error:', error);
    res.status(500).json({ error: 'Failed to get video info' });
  }
};

// Helper function to get video metadata
function getVideoMetadata(videoPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        resolve({
          duration: metadata.format.duration,
          width: videoStream?.width,
          height: videoStream?.height,
          fps: eval(videoStream?.r_frame_rate || '30/1'),
          codec: videoStream?.codec_name,
        });
      }
    });
  });
}
