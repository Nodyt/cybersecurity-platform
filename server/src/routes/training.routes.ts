import { Router } from 'express';
import { getTrainingStatus, getModuleDetails, completeModule } from '../controllers/training.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Protect all routes
router.use(authenticateToken);

router.get('/status', getTrainingStatus);
router.get('/module/:moduleId', getModuleDetails);
router.post('/module/:moduleId/complete', completeModule);

export default router;
