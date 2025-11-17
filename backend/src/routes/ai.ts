import { Router } from 'express';
import {
  generateImage,
  generateVideo,
  suggestTransitions,
  analyzeScene,
} from '../services/ai';

const router = Router();

// Generate image from text
router.post('/generate/image', generateImage);

// Generate video from text
router.post('/generate/video', generateVideo);

// Suggest transitions between scenes
router.post('/suggest-transitions', suggestTransitions);

// Analyze scene content
router.post('/analyze-scene', analyzeScene);

export { router as aiRouter };
