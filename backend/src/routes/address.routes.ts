import { Router } from 'express';
import AddressController from '../controllers/AddressController';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();
router.use(verifyToken);

router.get('/',               AddressController.getAddresses.bind(AddressController));
router.post('/',              AddressController.addAddress.bind(AddressController));
router.patch('/:id/default',  AddressController.setDefault.bind(AddressController));
router.delete('/:id',         AddressController.remove.bind(AddressController));

export default router;
