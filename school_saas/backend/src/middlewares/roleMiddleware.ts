import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden. You do not have the required role.' });
      return;
    }

    next();
  };
};
