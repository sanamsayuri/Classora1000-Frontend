import { Router } from 'express';
import { createPaymentOrder, verifyPayment } from './controller';
import { authenticate } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();

// Protect ALL payment routes
router.use(authenticate);

// Parents initiate payments (this could be opened to other roles too)
router.post('/order', requireRole(['PARENT', 'STUDENT']), createPaymentOrder);

// Verify payment signature
router.post('/verify', verifyPayment);

export default router;
