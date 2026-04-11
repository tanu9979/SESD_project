import { Router } from 'express';
import PaymentController from '../controllers/PaymentController';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();
router.use(verifyToken);

router.post('/initiate', PaymentController.initiate.bind(PaymentController));
router.post('/confirm',  PaymentController.confirm.bind(PaymentController));

export default router;
