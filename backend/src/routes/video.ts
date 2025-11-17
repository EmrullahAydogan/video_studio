import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadVideo, processVideo, getVideoInfo } from '../services/video';

const router = Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'));
    }
  },
});

// Upload video
router.post('/upload', upload.single('video'), uploadVideo);

// Process video (trim, effects, etc.)
router.post('/process', processVideo);

// Get video information
router.get('/info/:videoId', getVideoInfo);

export { router as videoRouter };
