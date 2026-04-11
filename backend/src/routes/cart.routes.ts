import { Router } from 'express';
import CartController from '../controllers/CartController';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();
router.use(verifyToken);

router.get('/',       CartController.getCart.bind(CartController));
router.post('/',      CartController.addToCart.bind(CartController));
router.delete('/:id', CartController.removeFromCart.bind(CartController));

export default router;
