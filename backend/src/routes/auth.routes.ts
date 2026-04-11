import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, AuthController.register.bind(AuthController));
router.post('/login',    authLimiter, AuthController.login.bind(AuthController));

export default router;
