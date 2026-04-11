import { Router } from 'express';
import ChatController from '../controllers/ChatController';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();
router.use(verifyToken);

router.post('/start',            ChatController.startConversation.bind(ChatController));
router.get('/conversations',     ChatController.getConversations.bind(ChatController));
router.get('/:id/messages',      ChatController.getMessages.bind(ChatController));

export default router;
