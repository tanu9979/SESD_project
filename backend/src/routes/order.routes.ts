import { Router } from 'express';
import OrderController from '../controllers/OrderController';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();
router.use(verifyToken);

router.post('/',                OrderController.placeOrder.bind(OrderController));
router.get('/my',               OrderController.getBuyerOrders.bind(OrderController));
router.get('/selling',          OrderController.getSellerOrders.bind(OrderController));
router.get('/:id',              OrderController.getOrder.bind(OrderController));
router.patch('/:id/status',     OrderController.updateStatus.bind(OrderController));
router.patch('/:id/cancel',     OrderController.cancel.bind(OrderController));

export default router;
