import { Router } from 'express';
import FeedbackController from '../controllers/FeedbackController';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', verifyToken, FeedbackController.submit.bind(FeedbackController));

export default router;
