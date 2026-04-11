import { Router } from 'express';
import BookController from '../controllers/BookController';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/',          BookController.getAll.bind(BookController));
router.get('/my',        verifyToken, BookController.getMyListings.bind(BookController));
router.get('/:id',       BookController.getById.bind(BookController));
router.post('/',         verifyToken, BookController.create.bind(BookController));
router.put('/:id',       verifyToken, BookController.update.bind(BookController));
router.delete('/:id',    verifyToken, BookController.remove.bind(BookController));

export default router;
