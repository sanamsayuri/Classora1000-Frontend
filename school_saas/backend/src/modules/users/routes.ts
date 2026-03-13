import { Router } from 'express';
import { getUsers, createUser } from './controller';
import { authenticate } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();

// Protect all user routes
router.use(authenticate);

// Get all users (School Admin sees their school, Super Admin sees all)
router.get('/', requireRole(['SUPER_ADMIN', 'SCHOOL_ADMIN']), getUsers);

// Create user
router.post('/', requireRole(['SUPER_ADMIN', 'SCHOOL_ADMIN']), createUser);

export default router;
