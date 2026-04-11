import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import { verifyToken, requireRole } from '../middleware/auth.middleware';

const router = Router();
router.use(verifyToken, requireRole('admin'));

router.get('/users',              AdminController.getUsers.bind(AdminController));
router.delete('/users/:id',       AdminController.deleteUser.bind(AdminController));
router.get('/listings',           AdminController.getListings.bind(AdminController));
router.delete('/listings/:id',    AdminController.deleteListing.bind(AdminController));
router.get('/transactions',       AdminController.getTransactions.bind(AdminController));
router.get('/feedback',           AdminController.getFeedback.bind(AdminController));

export default router;
