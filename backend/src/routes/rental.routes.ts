import { Router } from 'express';
import RentalController from '../controllers/RentalController';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();
router.use(verifyToken);

router.post('/',              RentalController.rent.bind(RentalController));
router.get('/my',             RentalController.getMyRentals.bind(RentalController));
router.patch('/:id/return',   RentalController.returnBook.bind(RentalController));

export default router;
