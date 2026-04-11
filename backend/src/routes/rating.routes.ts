import { Router } from 'express';
import RatingController from '../controllers/RatingController';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/seller/:sellerId', RatingController.getSellerRatings.bind(RatingController));
router.post('/', verifyToken, RatingController.rate.bind(RatingController));

export default router;
