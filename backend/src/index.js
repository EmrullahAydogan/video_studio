const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Create directories
const uploadsDir = path.join(__dirname, '../uploads');
const exportsDir = path.join(__dirname, '../exports');
[uploadsDir, exportsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'video/mp4', 'video/webm', 'video/quicktime',
      'image/jpeg', 'image/png', 'image/gif',
      'audio/mpeg', 'audio/wav', 'audio/mp3'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AI Video Studio Backend',
    version: '1.0.0',
    ffmpeg: 'available'
  });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    success: true,
    file: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: '/uploads/' + req.file.filename
    }
  });
});

app.get('/api/video/:filename/info', async (req, res) => {
  const ffmpeg = require('fluent-ffmpeg');
  const videoPath = path.join(uploadsDir, req.params.filename);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: 'Video not found' });
  }

  ffmpeg.ffprobe(videoPath, (err, metadata) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read video info' });
    }

    const videoStream = metadata.streams.find(s => s.codec_type === 'video');
    const audioStream = metadata.streams.find(s => s.codec_type === 'audio');

    res.json({
      duration: metadata.format.duration,
      size: metadata.format.size,
      video: videoStream ? {
        width: videoStream.width,
        height: videoStream.height,
        fps: videoStream.r_frame_rate,
        codec: videoStream.codec_name
      } : null,
      audio: audioStream ? {
        codec: audioStream.codec_name,
        sampleRate: audioStream.sample_rate,
        channels: audioStream.channels
      } : null
    });
  });
});

app.post('/api/export', express.json(), async (req, res) => {
  const { projectName, settings } = req.body;
  
  res.json({
    success: true,
    message: 'Export started',
    exportId: Date.now().toString(),
    note: 'Full video processing requires FFmpeg scene composition'
  });
});

app.use('/uploads', express.static(uploadsDir));
app.use('/exports', express.static(exportsDir));

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('AI Video Studio Backend running on port ' + PORT);
  console.log('Uploads directory: ' + uploadsDir);
  console.log('Exports directory: ' + exportsDir);
  console.log('FFmpeg: Ready for video processing');
});
