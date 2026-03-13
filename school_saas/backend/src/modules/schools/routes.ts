import { Router } from 'express';
import { getSchools, createSchool } from './controller';
import { authenticate } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();

// Only Super Admin can manage schools
router.use(authenticate, requireRole(['SUPER_ADMIN']));

router.get('/', getSchools);
router.post('/', createSchool);

export default router;
