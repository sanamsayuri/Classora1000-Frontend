import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

// Middleware to ensure user is accessing their own tenant's data
export const enforceTenant = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Super admins bypass tenant checks (they can access any school)
  if (req.user.role === 'SUPER_ADMIN') {
    next();
    return;
  }

  // Ensure user is bound to a school
  if (!req.user.school_id) {
    res.status(403).json({ error: 'User is not associated with any school.' });
    return;
  }

  // Controllers must use req.user.school_id to filter all queries
  next();
};
