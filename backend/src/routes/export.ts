import { Router } from 'express';
import { exportProject, getExportStatus } from '../services/export';

const router = Router();

// Export project to video
router.post('/render', exportProject);

// Get export job status
router.get('/status/:jobId', getExportStatus);

export { router as exportRouter };
